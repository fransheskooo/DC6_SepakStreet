import { Head, Link, router } from '@inertiajs/react';
import { badgeClass, peso } from '../../lib/format';
import StoreLayout from '../../Layouts/StoreLayout';

export default function Orders({ orders, selectedOrder, filters, statuses }) {
    const order = selectedOrder;

    return (
        <StoreLayout>
            <Head title="My Orders" />
            <div className="mb-6 flex flex-wrap gap-3">
                {statuses.map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => router.get('/orders', { status }, { preserveState: true, preserveScroll: true })}
                        className={filters.status === status ? 'store-button' : 'store-button-secondary'}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {orders.length ? (
                <div className="grid gap-6 xl:grid-cols-[1.05fr,1.15fr]">
                    <div className="space-y-4">
                        {orders.map((item) => (
                            <Link key={item.id} href={`/orders/${item.id}`} className="store-card block p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-lg font-black">{item.order_number}</div>
                                        <div className="mt-1 text-sm text-slate-500">{item.placed_at}</div>
                                    </div>
                                    <span className={`store-badge ${badgeClass(item.status)}`}>{item.status}</span>
                                </div>
                                <div className="mt-4 flex items-center justify-between text-sm">
                                    <span className="text-slate-500">{item.items_count} item(s)</span>
                                    <span className="text-xl font-black">{peso(item.total)}</span>
                                </div>
                                <div className="mt-4 flex -space-x-2">
                                    {item.items.slice(0, 3).map((orderItem) => (
                                        <div key={orderItem.id} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--color-store-border)] bg-slate-50 text-[10px] text-slate-400">
                                            {orderItem.image ? <img src={orderItem.image} alt={orderItem.name} className="h-full w-full rounded-2xl object-contain object-center p-1" /> : 'Item'}
                                        </div>
                                    ))}
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="store-card p-6">
                        {order ? (
                            <>
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-store-border)] pb-5">
                                    <div>
                                        <div className="text-sm text-slate-500">Order Details</div>
                                        <h1 className="text-3xl font-black">{order.order_number}</h1>
                                        <div className="mt-1 text-sm text-slate-500">{order.placed_at}</div>
                                    </div>
                                    <span className={`store-badge ${badgeClass(order.status)}`}>{order.status}</span>
                                </div>

                                <div className="mt-6 space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between gap-4 rounded-3xl border border-[var(--color-store-border)] p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-xs text-slate-400">
                                                    {item.image ? <img src={item.image} alt={item.name} className="h-full w-full rounded-2xl object-contain object-center p-1" /> : 'Item'}
                                                </div>
                                                <div>
                                                    <div className="font-bold">{item.name}</div>
                                                    <div className="text-sm text-slate-500">Qty: {item.quantity}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-slate-500">{peso(item.unit_price)} each</div>
                                                <div className="text-lg font-black">{peso(item.line_total)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                                    <div className="rounded-3xl border border-[var(--color-store-border)] p-5">
                                        <div className="text-lg font-black">Delivery Information</div>
                                        <div className="mt-4 space-y-2 text-sm">
                                            <div className="font-semibold">{order.shipping_address.full_name}</div>
                                            <div className="text-slate-500">{order.shipping_address.phone}</div>
                                            <div className="text-slate-500">
                                                {order.shipping_address.address_line}, {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}
                                            </div>
                                            {order.shipping_address.landmark ? <div className="text-slate-500">Landmark: {order.shipping_address.landmark}</div> : null}
                                        </div>
                                    </div>

                                    <div className="rounded-3xl border border-[var(--color-store-border)] p-5">
                                        <div className="text-lg font-black">Payment Summary</div>
                                        <div className="mt-4 space-y-3 text-sm">
                                            <div className="flex justify-between"><span className="text-slate-500">Payment Method</span><span className="font-semibold">{order.payment_method}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-semibold">{peso(order.subtotal)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-500">Shipping Fee</span><span className="font-semibold">{peso(order.shipping_fee)}</span></div>
                                            <div className="flex justify-between text-xl font-black"><span>Total</span><span>{peso(order.total)}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="py-16 text-center text-slate-500">Select an order to view its details.</div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="store-card p-12 text-center">
                    <h1 className="text-3xl font-black">No orders yet</h1>
                    <p className="mt-3 text-slate-500">Once you place an order, it will appear here with tracking-style details.</p>
                    <Link href="/products" className="store-button mt-6">Start Shopping</Link>
                </div>
            )}
        </StoreLayout>
    );
}
