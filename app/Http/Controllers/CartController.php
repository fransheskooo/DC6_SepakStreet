<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCartItemRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Models\CartItem;
use App\Models\Product;
use App\Support\StoreData;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        $cart = request()->user()->cart()->firstOrCreate()->load('items.product.category', 'items.product.inventory');

        return Inertia::render('Store/Cart', [
            'cart' => StoreData::cart($cart),
        ]);
    }

    public function store(StoreCartItemRequest $request): RedirectResponse
    {
        $product = Product::query()->with('inventory')->findOrFail($request->integer('product_id'));
        abort_if(! $product->is_active || $product->available_stock === 0, 422, 'This product is unavailable.');

        $cart = $request->user()->cart()->firstOrCreate();
        $item = $cart->items()->firstOrNew(['product_id' => $product->id]);
        $newQuantity = ($item->exists ? $item->quantity : 0) + $request->integer('quantity');

        abort_if($newQuantity > $product->available_stock, 422, 'Requested quantity exceeds stock.');

        $item->quantity = $newQuantity;
        $item->save();

        return back()->with('success', 'Product added to cart.');
    }

    public function update(UpdateCartItemRequest $request, CartItem $cartItem): RedirectResponse
    {
        abort_unless($cartItem->cart->user_id === $request->user()->id, 403);

        $cartItem->load('product.inventory');
        abort_if($request->integer('quantity') > $cartItem->product->available_stock, 422, 'Requested quantity exceeds stock.');

        $cartItem->update(['quantity' => $request->integer('quantity')]);

        return back()->with('success', 'Cart updated.');
    }

    public function destroy(CartItem $cartItem): RedirectResponse
    {
        abort_unless($cartItem->cart->user_id === request()->user()->id, 403);
        $cartItem->delete();

        return back()->with('success', 'Item removed from cart.');
    }
}
