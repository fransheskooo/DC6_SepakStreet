import { Head, useForm } from '@inertiajs/react';
import { badgeClass, peso } from '../../lib/format';
import StoreLayout from '../../Layouts/StoreLayout';

export default function Checkout({ cart, lastAddress }) {
    const form = useForm({
        full_name: lastAddress?.full_name || '',
        phone: lastAddress?.phone || '',
        address_line: lastAddress?.address_line || '',
        city: lastAddress?.city || '',
        province: lastAddress?.province || '',
        postal_code: lastAddress?.postal_code || '',
        landmark: lastAddress?.landmark || '',
        payment_method: 'Cash on Delivery',
    });

    return (
        <StoreLayout>
            <Head title="Checkout" />
            <div className="store-card mx-auto max-w-4xl p-4">
                <div className="grid gap-4 lg:grid-cols-[1.2fr,0.9fr]">
                    <form onSubmit={(e) => { e.preventDefault(); form.post('/checkout'); }} className="space-y-4 p-4">
                        <h2 className="text-3xl font-black">Shipping Form</h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <input className="store-input" placeholder="Full Name" value={form.data.full_name} onChange={(e) => form.setData('full_name', e.target.value)} />
                            <input className="store-input" placeholder="Phone Number" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                        </div>
                        <input className="store-input" placeholder="Address" value={form.data.address_line} onChange={(e) => form.setData('address_line', e.target.value)} />
                        <div className="grid gap-3 sm:grid-cols-2">
                            <input className="store-input" placeholder="City" value={form.data.city} onChange={(e) => form.setData('city', e.target.value)} />
                            <input className="store-input" placeholder="Province" value={form.data.province} onChange={(e) => form.setData('province', e.target.value)} />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <input className="store-input" placeholder="Postal Code" value={form.data.postal_code} onChange={(e) => form.setData('postal_code', e.target.value)} />
                            <input className="store-input" placeholder="Landmark" value={form.data.landmark} onChange={(e) => form.setData('landmark', e.target.value)} />
                        </div>
                        <div>
                            <div className="mb-3 text-2xl font-bold">Payment Method</div>
                            <div className="space-y-3">
                                {['Cash on Delivery', 'Bank Transfer'].map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => form.setData('payment_method', method)}
                                        className="store-card flex w-full items-center justify-between px-4 py-4 text-left"
                                    >
                                        <span>{method}</span>
                                        <span className={`store-badge ${badgeClass(method === form.data.payment_method ? 'available' : 'simulation')}`}>
                                            {method === form.data.payment_method ? 'Selected' : 'Simulation'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button className="store-button w-full" disabled={form.processing}>Place Order</button>
                    </form>

                    <div className="border-l border-[var(--color-store-border)] p-4">
                        <h2 className="text-3xl font-black">Order Summary</h2>
                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between"><span className="text-slate-500">Products</span><span className="font-semibold">{cart.summary.items_count} items</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-semibold">{peso(cart.summary.subtotal)}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Shipping Fee</span><span className="font-semibold">{peso(cart.summary.shipping_fee)}</span></div>
                            <div className="flex justify-between text-3xl font-black"><span>Total</span><span>{peso(cart.summary.total)}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
