<?php

namespace App\Support;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class StoreData
{
    public static function productImageUrl(Product $product): ?string
    {
        if ($product->image) {
            return asset('storage/'.$product->image);
        }

        foreach (['jpg', 'jpeg', 'png', 'webp', 'svg'] as $extension) {
            $fallback = 'images/products/'.$product->slug.'.'.$extension;

            if (file_exists(public_path($fallback))) {
                return asset($fallback);
            }
        }

        return asset('images/products/default.svg');
    }

    public static function productCard(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'price' => (float) $product->price,
            'description' => $product->description,
            'image' => self::productImageUrl($product),
            'category' => $product->category?->name,
            'category_slug' => $product->category?->slug,
            'is_featured' => $product->is_featured,
            'is_active' => $product->is_active,
            'stock' => $product->available_stock,
            'is_low_stock' => $product->is_low_stock,
            'status_label' => $product->status_label,
        ];
    }

    public static function paginator(LengthAwarePaginator $paginator): array
    {
        return [
            'data' => $paginator->getCollection()->all(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];
    }

    public static function cart(Cart $cart): array
    {
        $items = $cart->items->map(function ($item) {
            $product = $item->product;
            $lineTotal = $product->price * $item->quantity;

            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'line_total' => (float) $lineTotal,
                'product' => self::productCard($product),
            ];
        })->values();

        $subtotal = $items->sum('line_total');
        $shippingFee = $items->isEmpty() ? 0 : 100;

        return [
            'id' => $cart->id,
            'items' => $items,
            'summary' => [
                'items_count' => $items->count(),
                'subtotal' => (float) $subtotal,
                'shipping_fee' => (float) $shippingFee,
                'total' => (float) ($subtotal + $shippingFee),
            ],
        ];
    }

    public static function categories(Collection $categories): array
    {
        return $categories->map(fn ($category) => [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
        ])->values()->all();
    }
}
