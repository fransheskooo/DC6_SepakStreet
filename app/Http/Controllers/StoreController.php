<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Support\StoreData;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StoreController extends Controller
{
    public function landing(): Response
    {
        $featured = Product::query()
            ->with(['category', 'inventory'])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->latest()
            ->take(3)
            ->get()
            ->map(fn ($product) => StoreData::productCard($product));

        $categories = Category::query()
            ->withCount('products')
            ->take(4)
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'count' => $category->products_count,
            ]);

        return Inertia::render('Store/Landing', [
            'featured' => $featured,
            'categories' => $categories,
        ]);
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'category', 'sort', 'page']);

        $products = Product::query()
            ->with(['category', 'inventory'])
            ->where('is_active', true)
            ->when($request->filled('search'), fn (Builder $query) => $query->where('name', 'like', '%'.$request->string('search').'%'))
            ->when($request->filled('category'), fn (Builder $query) => $query->whereHas('category', fn (Builder $category) => $category->where('slug', $request->string('category'))))
            ->when($request->string('sort') === 'price_asc', fn (Builder $query) => $query->orderBy('price'))
            ->when($request->string('sort') === 'price_desc', fn (Builder $query) => $query->orderByDesc('price'))
            ->when(! in_array($request->string('sort')->value(), ['price_asc', 'price_desc'], true), fn (Builder $query) => $query->latest())
            ->paginate(6)
            ->withQueryString();

        $products->setCollection($products->getCollection()->map(fn ($product) => StoreData::productCard($product)));

        return Inertia::render('Store/Products', [
            'products' => StoreData::paginator($products),
            'categories' => StoreData::categories(Category::orderBy('name')->get()),
            'filters' => $filters,
        ]);
    }

    public function show(Product $product): Response
    {
        $product->load(['category', 'inventory']);

        abort_unless($product->is_active, 404);

        return Inertia::render('Store/ProductDetails', [
            'product' => StoreData::productCard($product) + [
                'details' => [
                    'category' => $product->category->name,
                    'stock_label' => $product->available_stock > 0
                        ? 'In Stock - '.$product->available_stock.' available'
                        : 'Out of stock',
                ],
            ],
        ]);
    }
}
