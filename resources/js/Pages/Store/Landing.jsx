import { Head, Link } from '@inertiajs/react';
import ProductCard from '../../Components/ProductCard';
import StoreLayout from '../../Layouts/StoreLayout';

export default function Landing({ featured, categories }) {
    return (
        <StoreLayout>
            <Head title="Sepak Street" />
            <div className="store-card mb-6 flex min-h-56 items-center justify-center bg-gradient-to-r from-[#f6d7d2] to-[#f3f5f8] p-10 text-center">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Sepak Street Featured Collection</p>
                    <h1 className="mt-4 text-5xl font-black">Gear Up For Every Match</h1>
                    <p className="mt-4 max-w-2xl text-slate-500">Shop curated sepak takraw essentials with a clean checkout flow and real stock availability.</p>
                    <Link href="/products" className="store-button mt-6">Browse Products</Link>
                </div>
            </div>

            
            <section>
                <div className="mb-4 text-2xl font-bold">Category Highlights</div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/products?category=${category.slug}`} className="store-card p-5">
                            <h3 className="text-xl font-bold">{category.name}</h3>
                            <p className="mt-2 text-slate-500">{category.description}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </StoreLayout>
    );
}
