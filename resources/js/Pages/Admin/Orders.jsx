import { Head, router, useForm } from '@inertiajs/react';
import { badgeClass, peso } from '../../lib/format';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Orders({ orders, selectedOrder }) {
    const order = selectedOrder || orders.data[0];
    const form = useForm({ status: order?.status || 'Pending' });

    return (
        <AdminLayout>
            <Head title="Admin Orders" />
            <div className="space-y-3">
                {orders.data.map((item) => (
                    <div key={item.id} className="store-card grid items-center gap-3 p-4 md:grid-cols-[1fr,1.5fr,1fr,1fr,120px]">
                        <div>{item.order_number}</div>
                        <div>
                            <div className="font-bold">{item.customer}</div>
                            <div className="text-sm text-slate-500">{item.city}</div>
                        </div>
                        <div>{peso(item.total)}</div>
                        <div><span className={`store-badge ${badgeClass(item.status)}`}>{item.status}</span></div>
                        <a href={`/admin/orders/${item.id}`} className="store-button-secondary text-center">Open</a>
                    </div>
                ))}
            </div>

            {order ? (
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="store-card p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <h2 className="text-3xl font-black">Order Details</h2>
                            <span className={`store-badge ${badgeClass(order.status)}`}>{order.status}</span>
                        </div>
                        <div className="space-y-5">
                            <div className="flex justify-between"><span className="text-slate-500">Order Number</span><span className="font-bold">{order.order_number}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Customer</span><span className="font-bold">{order.customer}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Items</span><span className="font-bold">{order.items_count}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Payment Method</span><span className="font-bold">{order.payment_method}</span></div>
                            <div>
                                <div className="text-slate-500">Shipping Address</div>
                                <div className="mt-2 font-bold">{order.shipping_address.full_name}</div>
                                <div className="text-slate-500">{order.shipping_address.address_line}, {order.shipping_address.city}, {order.shipping_address.province}</div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); form.patch(`/admin/orders/${order.id}`); }} className="store-card p-6">
                        <h2 className="text-3xl font-black">Update Order Status</h2>
                        <div className="mt-6 space-y-3">
                            {['Pending', 'Paid', 'Shipped', 'Completed'].map((status) => (
                                <label key={status} className="store-card flex items-center justify-between px-4 py-4">
                                    <span>{status}</span>
                                    <div className="flex items-center gap-3">
                                        {status === order.status ? <span className={`store-badge ${badgeClass('current')}`}>Current</span> : null}
                                        <input type="radio" name="status" checked={form.data.status === status} onChange={() => form.setData('status', status)} />
                                    </div>
                                </label>
                            ))}
                        </div>
                        <button className="store-button mt-6 w-full" disabled={form.processing}>Save Status</button>
                    </form>
                </div>
            ) : (
                <div className="store-card p-10 text-center text-slate-500">No orders found.</div>
            )}
        </AdminLayout>
    );
}
