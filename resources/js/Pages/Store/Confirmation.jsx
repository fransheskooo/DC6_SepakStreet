import { Head, Link } from '@inertiajs/react';
import { badgeClass } from '../../lib/format';
import StoreLayout from '../../Layouts/StoreLayout';

export default function Confirmation({ order }) {
    return (
        <StoreLayout>
            <Head title="Order Confirmation" />
            <div className="store-card mx-auto max-w-3xl p-16 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-store-green-soft)] text-4xl text-[var(--color-store-green)]">✓</div>
                <h1 className="mt-8 text-5xl font-black">Thank you for your order</h1>
                <p className="mt-3 text-slate-500">Your order has been placed successfully.</p>
                <div className="store-card mx-auto mt-8 max-w-sm p-5 text-left">
                    <div className="flex justify-between py-2"><span className="text-slate-500">Order Number</span><span className="font-bold">{order.order_number}</span></div>
                    <div className="flex justify-between py-2"><span className="text-slate-500">Order Summary</span><span className="font-bold">{order.items_count} products</span></div>
                    <div className="flex justify-between py-2"><span className="text-slate-500">Status</span><span className={`store-badge ${badgeClass(order.status)}`}>{order.status}</span></div>
                </div>
                <Link href="/products" className="store-button mt-8">Continue Shopping</Link>
            </div>
        </StoreLayout>
    );
}
