import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { badgeClass, peso } from '../../lib/format';
import StoreLayout from '../../Layouts/StoreLayout';

export default function ProductDetails({ product }) {
    const [quantity, setQuantity] = useState(1);

    return (
        <StoreLayout>
            <Head title={product.name} />
            <div className="store-card p-6">
                <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
                    <div>
                        <div className="flex h-96 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 p-4">
                            {product.image ? <img src={product.image} alt={product.name} className="h-full w-full rounded-3xl object-contain object-center" /> : <span className="text-slate-400">Main Product Image</span>}
                        </div>
                        <div className="mt-4 flex gap-3">
                            {[1, 2, 3].map((thumb) => <div key={thumb} className="h-16 w-16 rounded-2xl border border-[var(--color-store-border)] bg-slate-50" />)}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <span className="store-badge border border-[var(--color-store-border)] bg-white text-slate-500">{product.category}</span>
                        <h1 className="text-4xl font-black">{product.name}</h1>
                        <p className="text-slate-500">{product.description}</p>
                        <div className="text-3xl font-black">{peso(product.price)}</div>
                        <span className={`store-badge ${badgeClass(product.stock > 0 ? 'available' : 'out')}`}>{product.details.stock_label}</span>
                        <div>
                            <div className="mb-2 font-semibold">Quantity</div>
                            <div className="flex items-center gap-2">
                                <button type="button" className="store-button-secondary h-11 w-11 px-0" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
                                <div className="store-card flex h-11 w-16 items-center justify-center">{quantity}</div>
                                <button type="button" className="store-button-secondary h-11 w-11 px-0" onClick={() => setQuantity((value) => Math.min(product.stock || 1, value + 1))}>+</button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                disabled={product.stock === 0}
                                onClick={() => {
                                    if (confirm(`Add ${quantity} × ${product.name} to your cart?`)) {
                                        // Store cart item in session for after login
                                        const cartItem = {
                                            product_id: product.id,
                                            quantity: quantity,
                                            product_name: product.name
                                        };
                                        sessionStorage.setItem('pending_cart_item', JSON.stringify(cartItem));
                                        
                                        // Redirect to login
                                        router.visit('/login', {
                                            method: 'get',
                                            data: { redirect_to_cart: true }
                                        });
                                    }
                                }}
                                className={product.stock === 0 ? 'store-button-secondary' : 'store-button'}
                            >
                                Add to Cart
                            </button>
                            <a href="/products" className="store-button-secondary">Back to Products</a>
                        </div>
                        <div className="store-card max-w-md p-5">
                            <div className="font-bold">Description</div>
                            <p className="mt-2 text-slate-500">{product.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
