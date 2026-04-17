import { Head, router } from '@inertiajs/react';
import Pagination from '../../Components/Pagination';
import ProductCard from '../../Components/ProductCard';
import StoreLayout from '../../Layouts/StoreLayout';

export default function Products({ products, categories, filters }) {
    const updateFilter = (key, value) => {
        router.get('/products', { ...filters, [key]: value, page: 1 }, { preserveState: true, preserveScroll: true });
    };

    return (
        <StoreLayout>
            <Head title="Products" />
            <div className="store-card p-4">
                <div className="grid gap-3 md:grid-cols-[2fr,1.3fr,1.3fr,120px]">
                    <input className="store-input" placeholder="Search products" defaultValue={filters.search || ''} onBlur={(e) => updateFilter('search', e.target.value)} />
                    <select className="store-input" value={String(filters.category || '')} onChange={(e) => updateFilter('category', e.target.value)}>
                        <option value="">Category: All</option>
                        {categories.map((category) => <option key={category.id} value={String(category.slug)}>{category.name}</option>)}
                    </select>
                    <select className="store-input" value={String(filters.sort || '')} onChange={(e) => updateFilter('sort', e.target.value)}>
                        <option value="">Sort: Latest</option>
                        <option value="price_asc">Price Low-High</option>
                        <option value="price_desc">Price High-Low</option>
                    </select>
                    <div className="store-card flex items-center justify-center px-3 py-2 text-sm text-slate-500">{products.meta.total} items</div>
                </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {products.data.length ? products.data.map((product) => <ProductCard key={product.id} product={product} />) : (
                    <div className="store-card col-span-full p-10 text-center text-slate-500">No products matched your filters.</div>
                )}
            </div>

            <div className="mt-6">
                <Pagination meta={products.meta} url="/products" query={filters} />
            </div>
        </StoreLayout>
    );
}
