<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCartItemRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Models\CartItem;
use App\Models\Product;
use App\Support\StoreData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        if (Auth::check()) {
            $cart = request()->user()->cart()->firstOrCreate()->load('items.product.category', 'items.product.inventory');
        } else {
            $cart = $this->getGuestCart();
        }

        return Inertia::render('Store/Cart', [
            'cart' => StoreData::cart($cart),
        ]);
    }

    public function store(StoreCartItemRequest $request): RedirectResponse
    {
        $product = Product::query()->with('inventory')->findOrFail($request->integer('product_id'));
        abort_if(! $product->is_active || $product->available_stock === 0, 422, 'This product is unavailable.');

        if (Auth::check()) {
            $cart = $request->user()->cart()->firstOrCreate();
            $item = $cart->items()->firstOrNew(['product_id' => $product->id]);
            $newQuantity = ($item->exists ? $item->quantity : 0) + $request->integer('quantity');

            abort_if($newQuantity > $product->available_stock, 422, 'Requested quantity exceeds stock.');

            $item->quantity = $newQuantity;
            $item->save();
        } else {
            $this->addToGuestCart($product->id, $request->integer('quantity'), $product->available_stock);
        }

        return back()->with('success', 'Product added to cart.');
    }

    public function update(UpdateCartItemRequest $request, CartItem $cartItem): RedirectResponse
    {
        if (Auth::check()) {
            abort_unless($cartItem->cart->user_id === $request->user()->id, 403);

            $cartItem->load('product.inventory');
            abort_if($request->integer('quantity') > $cartItem->product->available_stock, 422, 'Requested quantity exceeds stock.');

            $cartItem->update(['quantity' => $request->integer('quantity')]);
        } else {
            // For guests, update the session cart
            $this->updateGuestCartItem($cartItem->id, $request->integer('quantity'));
        }

        return back()->with('success', 'Cart updated.');
    }

    public function destroy(CartItem $cartItem): RedirectResponse
    {
        if (Auth::check()) {
            abort_unless($cartItem->cart->user_id === request()->user()->id, 403);
            $cartItem->delete();
        } else {
            // For guests, remove from session cart
            $this->removeFromGuestCart($cartItem->id);
        }

        return back()->with('success', 'Item removed from cart.');
    }

    /**
     * Get guest cart from session
     */
    private function getGuestCart()
    {
        $items = Session::get('guest_cart', []);
        $cart = new \stdClass();
        $cart->items = collect();

        foreach ($items as $productId => $quantity) {
            $product = Product::with('category', 'inventory')->find($productId);
            if ($product && $product->is_active && $product->available_stock > 0) {
                $cartItem = new \stdClass();
                $cartItem->id = 'guest_' . $productId;
                $cartItem->product_id = $productId;
                $cartItem->quantity = min($quantity, $product->available_stock);
                $cartItem->product = $product;
                $cartItem->line_total = $product->price * $cartItem->quantity;
                $cart->items->push($cartItem);
            }
        }

        // Calculate summary
        $cart->summary = [
            'items_count' => $cart->items->sum('quantity'),
            'subtotal' => $cart->items->sum('line_total'),
            'shipping_fee' => $cart->items->count() > 0 ? 50 : 0, // Example shipping fee
            'total' => 0,
        ];
        $cart->summary['total'] = $cart->summary['subtotal'] + $cart->summary['shipping_fee'];

        return $cart;
    }

    /**
     * Add item to guest cart
     */
    private function addToGuestCart($productId, $quantity, $availableStock)
    {
        $cart = Session::get('guest_cart', []);
        $currentQuantity = $cart[$productId] ?? 0;
        $newQuantity = $currentQuantity + $quantity;

        abort_if($newQuantity > $availableStock, 422, 'Requested quantity exceeds stock.');

        $cart[$productId] = $newQuantity;
        Session::put('guest_cart', $cart);
    }

    /**
     * Update guest cart item quantity
     */
    private function updateGuestCartItem($cartItemId, $quantity)
    {
        $productId = str_replace('guest_', '', $cartItemId);
        $cart = Session::get('guest_cart', []);

        if (isset($cart[$productId])) {
            $product = Product::find($productId);
            if ($product && $quantity <= $product->available_stock) {
                $cart[$productId] = $quantity;
                Session::put('guest_cart', $cart);
            }
        }
    }

    /**
     * Remove item from guest cart
     */
    private function removeFromGuestCart($cartItemId)
    {
        $productId = str_replace('guest_', '', $cartItemId);
        $cart = Session::get('guest_cart', []);

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
            Session::put('guest_cart', $cart);
        }
    }

    /**
     * Merge guest cart into user cart
     */
    public static function mergeGuestCart($user)
    {
        $guestCart = Session::get('guest_cart', []);
        if (empty($guestCart)) {
            return;
        }

        $cart = $user->cart()->firstOrCreate();

        foreach ($guestCart as $productId => $quantity) {
            $product = Product::with('inventory')->find($productId);
            if ($product && $product->is_active && $product->available_stock > 0) {
                $existingItem = $cart->items()->where('product_id', $productId)->first();
                
                if ($existingItem) {
                    $newQuantity = $existingItem->quantity + $quantity;
                    if ($newQuantity <= $product->available_stock) {
                        $existingItem->quantity = $newQuantity;
                        $existingItem->save();
                    }
                } else {
                    if ($quantity <= $product->available_stock) {
                        $cart->items()->create([
                            'product_id' => $productId,
                            'quantity' => $quantity,
                        ]);
                    }
                }
            }
        }

        // Clear guest cart after merging
        Session::forget('guest_cart');
    }
}
