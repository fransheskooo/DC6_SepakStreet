import { Link, usePage } from '@inertiajs/react';
import FlashMessages from '../Components/FlashMessages';

export default function AdminLayout({ children }) {
    const { url } = usePage();
    const nav = [
        { href: '/admin/dashboard', label: 'Overview' },
        { href: '/admin/products', label: 'Products' },
        { href: '/admin/orders', label: 'Orders' },
    ];

    return (
        <div className="store-shell">
            <div className="store-container">
                <FlashMessages />
                <div className="grid gap-6 lg:grid-cols-[220px,1fr]">
                    <aside className="store-card h-fit p-3">
                        <div className="mb-4 flex items-center gap-3 px-3 py-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-store-green)] text-sm font-bold text-white">SS</div>
                            <div>
                                <div className="font-semibold">Admin Panel</div>
                                <div className="text-xs text-slate-500">Sepak Store</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {nav.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`block rounded-2xl px-4 py-3 text-sm ${url.startsWith(item.href) ? 'bg-[var(--color-store-green-soft)] text-[var(--color-store-green)]' : 'border border-[var(--color-store-border)] text-slate-500'}`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </aside>
                    <main className="space-y-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
