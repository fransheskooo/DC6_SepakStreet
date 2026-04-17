<?php

namespace App\Http\Controllers;

use App\Support\StoreData;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->value();
        $orders = $request->user()->orders()
            ->with(['items.product', 'shippingAddress'])
            ->when($status && $status !== 'All', fn ($query) => $query->where('status', $status))
            ->latest('placed_at')
            ->get();

        $formattedOrders = $orders->map(fn (Order $order) => $this->formatOrder($order))->values();

        return Inertia::render('Store/Orders', [
            'orders' => $formattedOrders,
            'selectedOrder' => $formattedOrders->first(),
            'filters' => [
                'status' => $status ?: 'All',
            ],
            'statuses' => ['All', 'Pending', 'Paid', 'Shipped', 'Completed'],
        ]);
    }

    public function details(Order $order): Response
    {
        $order->load(['items.product', 'shippingAddress']);

        return Inertia::render('Store/Orders', [
            'orders' => request()->user()->orders()
                ->with(['items.product', 'shippingAddress'])
                ->latest('placed_at')
                ->get()
                ->map(fn (Order $item) => $this->formatOrder($item))
                ->values(),
            'selectedOrder' => $this->formatOrder($order),
            'filters' => [
                'status' => 'All',
            ],
            'statuses' => ['All', 'Pending', 'Paid', 'Shipped', 'Completed'],
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load('items', 'shippingAddress');

        return Inertia::render('Store/Confirmation', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'items_count' => $order->items->sum('quantity'),
                'payment_method' => $order->payment_method,
                'total' => (float) $order->total,
                'shipping_address' => [
                    'full_name' => $order->shippingAddress->full_name,
                    'city' => $order->shippingAddress->city,
                    'province' => $order->shippingAddress->province,
                ],
            ],
        ]);
    }

    private function formatOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'placed_at' => $order->placed_at?->format('M d, Y h:i A'),
            'items_count' => $order->items->sum('quantity'),
            'payment_method' => $order->payment_method,
            'subtotal' => (float) $order->subtotal,
            'shipping_fee' => (float) $order->shipping_fee,
            'total' => (float) $order->total,
            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->product_name,
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'line_total' => (float) $item->line_total,
                'image' => $item->product ? StoreData::productImageUrl($item->product) : asset('images/products/default.svg'),
            ])->values(),
            'shipping_address' => [
                'full_name' => $order->shippingAddress->full_name,
                'phone' => $order->shippingAddress->phone,
                'address_line' => $order->shippingAddress->address_line,
                'city' => $order->shippingAddress->city,
                'province' => $order->shippingAddress->province,
                'postal_code' => $order->shippingAddress->postal_code,
                'landmark' => $order->shippingAddress->landmark,
            ],
        ];
    }
}
