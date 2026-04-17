<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Support\StoreData;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->with(['category', 'inventory'])
            ->when($request->filled('search'), fn (Builder $query) => $query->where('name', 'like', '%'.$request->string('search').'%'))
            ->when($request->filled('category'), fn (Builder $query) => $query->where('category_id', $request->integer('category')))
            ->when($request->filled('status'), function (Builder $query) use ($request) {
                $status = $request->string('status')->value();
                if ($status === 'available') {
                    $query->where('is_active', true)->whereHas('inventory', fn (Builder $inventory) => $inventory->whereColumn('stock', '>', 'low_stock_threshold'));
                }
                if ($status === 'low') {
                    $query->whereHas('inventory', fn (Builder $inventory) => $inventory->whereColumn('stock', '<=', 'low_stock_threshold')->where('stock', '>', 0));
                }
                if ($status === 'out') {
                    $query->whereHas('inventory', fn (Builder $inventory) => $inventory->where('stock', 0));
                }
            })
            ->latest()
            ->paginate(8)
            ->withQueryString();

        $products->setCollection($products->getCollection()->map(fn ($product) => StoreData::productCard($product) + [
            'category_id' => $product->category_id,
            'low_stock_threshold' => $product->inventory->low_stock_threshold,
        ]));

        return Inertia::render('Admin/Products', [
            'products' => StoreData::paginator($products),
            'categories' => StoreData::categories(Category::orderBy('name')->get()),
            'filters' => $request->only(['search', 'category', 'status']),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $product = Product::create([
            'category_id' => $data['category_id'],
            'name' => $data['name'],
            'slug' => Str::slug($data['name']).'-'.Str::lower(Str::random(4)),
            'sku' => 'SS'.str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
            'price' => $data['price'],
            'description' => $data['description'],
            'image' => $request->file('image')?->store('products', 'public'),
            'is_featured' => (bool) ($data['is_featured'] ?? false),
            'is_active' => (bool) ($data['is_active'] ?? true),
        ]);

        $product->inventory()->create([
            'stock' => $data['stock'],
            'low_stock_threshold' => $data['low_stock_threshold'] ?? 10,
        ]);

        return back()->with('success', 'Product created successfully.');
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();
        $image = $product->image;

        if ($request->hasFile('image')) {
            if ($image) {
                Storage::disk('public')->delete($image);
            }
            $image = $request->file('image')->store('products', 'public');
        }

        $product->update([
            'category_id' => $data['category_id'],
            'name' => $data['name'],
            'slug' => $product->slug,
            'price' => $data['price'],
            'description' => $data['description'],
            'image' => $image,
            'is_featured' => (bool) ($data['is_featured'] ?? false),
            'is_active' => (bool) ($data['is_active'] ?? false),
        ]);

        $product->inventory()->update([
            'stock' => $data['stock'],
            'low_stock_threshold' => $data['low_stock_threshold'] ?? 10,
        ]);

        return back()->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return back()->with('success', 'Product deleted.');
    }
}
