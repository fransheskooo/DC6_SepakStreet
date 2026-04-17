import { Link, Head, router } from '@inertiajs/react';
import { peso } from '../../lib/format';
import StoreLayout from '../../Layouts/StoreLayout';

export default function Cart({ cart }) {
    return (
        <StoreLayout>
            <Head title="Cart" />
            <div className="grid gap-6 lg:grid-cols-[1.5fr,340px]">
                <div className="space-y-4">
                    {cart.items.length ? cart.items.map((item) => (
                        <div key={item.id} className="store-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 p-2">
                                    {item.product.image ? <img src={item.product.image} alt={item.product.name} className="h-full w-full rounded-xl object-contain object-center" /> : null}
                                </div>
                                <div>
                                    <div className="text-xl font-bold">{item.product.name}</div>
                                    <div className="text-sm text-slate-500">{item.product.description}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button type="button" className="store-button-secondary h-10 w-10 px-0" onClick={() => item.quantity > 1 && router.patch(`/cart/items/${item.id}`, { quantity: item.quantity - 1 })}>-</button>
                                <div className="store-card flex h-10 w-12 items-center justify-center">{item.quantity}</div>
                                <button type="button" className="store-button-secondary h-10 w-10 px-0" onClick={() => router.patch(`/cart/items/${item.id}`, { quantity: item.quantity + 1 })}>+</button>
                            </div>
                            <div className="text-2xl font-black">{peso(item.line_total)}</div>
                            <button type="button" className="store-badge bg-[var(--color-store-red)] text-[#d92d20]" onClick={() => router.delete(`/cart/items/${item.id}`)}>Remove</button>
                        </div>
                    )) : (
                        <div className="store-card p-10 text-center">
                            <div className="text-2xl font-bold">Your cart is empty</div>
                            <p className="mt-2 text-slate-500">Browse the catalog and add products to continue.</p>
                            <Link href="/products" className="store-button mt-6">Shop Now</Link>
                        </div>
                    )}
                </div>

                <div className="store-card h-fit p-6 text-center">
                    <h2 className="text-3xl font-black">Order Summary</h2>
                    <div className="mt-8 space-y-4 text-left">
                        <div className="flex justify-between text-slate-500"><span>Subtotal</span><span className="font-semibold text-slate-900">{peso(cart.summary.subtotal)}</span></div>
                        <div className="flex justify-between text-slate-500"><span>Shipping Fee</span><span className="font-semibold text-slate-900">{peso(cart.summary.shipping_fee)}</span></div>
                        <div className="flex justify-between text-2xl font-black"><span>Total</span><span>{peso(cart.summary.total)}</span></div>
                    </div>
                    <Link href="/checkout" className={`mt-8 inline-flex w-full justify-center ${cart.items.length ? 'store-button' : 'store-button-secondary'}`}>Proceed to Checkout</Link>
                </div>
            </div>
        </StoreLayout>
    );
}
