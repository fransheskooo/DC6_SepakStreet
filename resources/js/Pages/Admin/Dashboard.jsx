import { Head, Link } from '@inertiajs/react';
import { peso } from '../../lib/format';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Dashboard({ stats, lowStockItems }) {
    const cards = [
        { label: 'Total Sales', value: peso(stats.sales) },
        { label: 'Total Orders', value: stats.orders },
        { label: 'Customers', value: stats.customers },
        { label: 'Low Stock', value: stats.lowStock },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.label} className="store-card p-5">
                        <div className="text-slate-500">{card.label}</div>
                        <div className="mt-2 text-4xl font-black">{card.value}</div>
                    </div>
                ))}
            </div>
            <div className="store-card p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-3xl font-black">Low Stock Alerts</h2>
                    <Link href="/admin/products" className="store-button-secondary">Manage Products</Link>
                </div>
                <div className="space-y-3">
                    {lowStockItems.length ? lowStockItems.map((item) => (
                        <div key={item.id} className="store-card flex items-center justify-between px-4 py-3">
                            <span className="font-semibold">{item.name}</span>
                            <span className="store-badge bg-[var(--color-store-yellow)] text-[#9a6200]">{item.stock} left</span>
                        </div>
                    )) : <div className="text-slate-500">No low stock items right now.</div>}
                </div>
            </div>
        </AdminLayout>
    );
}
