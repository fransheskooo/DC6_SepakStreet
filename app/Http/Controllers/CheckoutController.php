<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use App\Models\ShippingAddress;
use App\Support\StoreData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        $cart = request()->user()->cart()->firstOrCreate()->load('items.product.category', 'items.product.inventory');

        if ($cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        return Inertia::render('Store/Checkout', [
            'cart' => StoreData::cart($cart),
            'lastAddress' => optional(request()->user()->shippingAddresses()->latest()->first(), fn ($address) => [
                'full_name' => $address->full_name,
                'phone' => $address->phone,
                'address_line' => $address->address_line,
                'city' => $address->city,
                'province' => $address->province,
                'postal_code' => $address->postal_code,
                'landmark' => $address->landmark,
            ]),
        ]);
    }

    public function store(CheckoutRequest $request): RedirectResponse
    {
        $user = $request->user();
        $cart = $user->cart()->firstOrCreate()->load('items.product.inventory');
        abort_if($cart->items->isEmpty(), 422, 'Your cart is empty.');

        $order = DB::transaction(function () use ($request, $user, $cart) {
            foreach ($cart->items as $item) {
                abort_if($item->quantity > $item->product->inventory->stock, 422, 'One or more items do not have enough stock.');
            }

            $shippingAddress = ShippingAddress::create([
                'user_id' => $user->id,
                ...$request->safe()->except('payment_method'),
            ]);

            $subtotal = $cart->items->sum(fn ($item) => $item->product->price * $item->quantity);
            $shippingFee = 100;

            $order = Order::create([
                'user_id' => $user->id,
                'shipping_address_id' => $shippingAddress->id,
                'order_number' => '#SS-'.str_pad((string) random_int(1, 99999), 5, '0', STR_PAD_LEFT),
                'payment_method' => $request->string('payment_method')->value(),
                'status' => 'Pending',
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'total' => $subtotal + $shippingFee,
                'placed_at' => now(),
            ]);

            foreach ($cart->items as $item) {
                $unitPrice = $item->product->price;
                $lineTotal = $unitPrice * $item->quantity;

                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'unit_price' => $unitPrice,
                    'quantity' => $item->quantity,
                    'line_total' => $lineTotal,
                ]);

                $item->product->inventory()->decrement('stock', $item->quantity);
            }

            $cart->items()->delete();

            return $order;
        });

        return redirect()->route('orders.confirmation', $order)->with('success', 'Order placed successfully.');
    }
}
