<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $lowStock = Product::query()
            ->with(['category', 'inventory'])
            ->get()
            ->filter(fn ($product) => $product->is_low_stock)
            ->take(5)
            ->values()
            ->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'stock' => $product->available_stock,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'sales' => (float) Order::query()->sum('total'),
                'orders' => Order::query()->count(),
                'customers' => User::query()->where('role', 'customer')->count(),
                'lowStock' => $lowStock->count(),
            ],
            'lowStockItems' => $lowStock,
        ]);
    }
}
