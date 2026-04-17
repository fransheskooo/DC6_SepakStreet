import { Link, router } from '@inertiajs/react';
import { badgeClass, peso } from '../lib/format';

export default function ProductCard({ product, canAdd = true }) {
    return (
        <div className="store-card overflow-hidden">
            <Link href={`/products/${product.slug}`} className="block h-56 bg-gradient-to-br from-slate-100 to-slate-50 p-3">
                {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full rounded-3xl object-contain object-center" />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">Product Image</div>
                )}
            </Link>
            <div className="space-y-3 p-4">
                <div className="space-y-1">
                    <Link href={`/products/${product.slug}`} className="text-xl font-semibold">
                        {product.name}
                    </Link>
                    <p className="text-sm text-slate-500">{product.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="store-badge border border-[var(--color-store-border)] bg-white text-slate-500">{product.category}</span>
                    <span className={`store-badge ${badgeClass(product.is_featured ? 'featured' : product.status_label)}`}>
                        {product.is_featured ? 'Featured' : product.status_label}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <div className="text-2xl font-bold">{peso(product.price)}</div>
                    {canAdd ? (
                        <button
                            type="button"
                            disabled={product.stock === 0}
                            onClick={() => router.post('/cart/items', { product_id: product.id, quantity: 1 }, { preserveScroll: true })}
                            className={product.stock === 0 ? 'store-button-secondary' : 'store-button'}
                        >
                            {product.stock === 0 ? 'Out of Stock' : 'Add'}
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
