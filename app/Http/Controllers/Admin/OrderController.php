<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::query()
            ->with(['user', 'items', 'shippingAddress'])
            ->latest('placed_at')
            ->paginate(8);

        $orders->setCollection($orders->getCollection()->map(fn ($order) => $this->formatOrder($order)));

        return Inertia::render('Admin/Orders', [
            'orders' => [
                'data' => $orders->getCollection(),
                'meta' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                ],
            ],
            'selectedOrder' => $orders->getCollection()->first(),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['user', 'items', 'shippingAddress']);

        return Inertia::render('Admin/Orders', [
            'orders' => [
                'data' => Order::query()->with(['user', 'items', 'shippingAddress'])->latest('placed_at')->take(8)->get()->map(fn ($item) => $this->formatOrder($item)),
                'meta' => ['current_page' => 1, 'last_page' => 1],
            ],
            'selectedOrder' => $this->formatOrder($order),
        ]);
    }

    public function update(UpdateOrderStatusRequest $request, Order $order): RedirectResponse
    {
        $order->update(['status' => $request->string('status')->value()]);

        return back()->with('success', 'Order status updated.');
    }

    private function formatOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'customer' => $order->user->name,
            'city' => $order->shippingAddress->city,
            'items_count' => $order->items->sum('quantity'),
            'payment_method' => $order->payment_method,
            'status' => $order->status,
            'total' => (float) $order->total,
            'shipping_address' => [
                'full_name' => $order->shippingAddress->full_name,
                'address_line' => $order->shippingAddress->address_line,
                'city' => $order->shippingAddress->city,
                'province' => $order->shippingAddress->province,
                'postal_code' => $order->shippingAddress->postal_code,
                'phone' => $order->shippingAddress->phone,
            ],
        ];
    }
}
