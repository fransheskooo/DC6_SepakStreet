import { Link, router, usePage } from '@inertiajs/react';
import FlashMessages from '../Components/FlashMessages';

export default function StoreLayout({ children }) {
    const { auth, cartCount } = usePage().props;

    return (
        <div className="store-shell">
            <div className="store-container">
                <div className="store-card mb-6 flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-store-green)] text-sm font-bold text-white">SS</div>
                        <div>
                            <Link href="/" className="text-2xl font-black tracking-tight">
                                SEPAK STREET
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <Link href="/products" className="store-button-secondary">Shop</Link>
                        <Link href="/cart" className="store-button-secondary">Cart ({cartCount ?? 0})</Link>
                        {auth.user ? (
                            <>
                                {auth.user.role !== 'admin' ? <Link href="/orders" className="store-button-secondary">Orders</Link> : null}
                                <button 
                                    type="button"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to logout?')) {
                                            router.post('/logout');
                                        }
                                    }}
                                    className="store-button"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="store-button">Login / Register</Link>
                        )}
                    </div>
                </div>
                <FlashMessages />
                {children}
            </div>
        </div>
    );
}
