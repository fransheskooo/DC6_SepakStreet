import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '../../Layouts/StoreLayout';

export default function Login() {
    const form = useForm({ email: '', password: '' });

    return (
        <StoreLayout>
            <Head title="Login" />
            <div className="mx-auto max-w-3xl">
                <div className="store-card grid gap-6 p-6 lg:grid-cols-[1fr,1.05fr]">
                    <div className="rounded-3xl bg-slate-50 p-8">
                        <span className="store-badge bg-[var(--color-store-green-soft)] text-[var(--color-store-green)]">Login</span>
                        <h1 className="mt-8 text-5xl font-black">Welcome back</h1>
                        <p className="mt-4 text-lg text-slate-500">Sign in to continue to your account.</p>
                        <div className="mt-8 rounded-3xl border border-[var(--color-store-border)] bg-white p-5 text-sm text-slate-500">
                            New here? <Link href="/register" className="font-semibold text-[var(--color-store-green)]">Create an account</Link>
                        </div>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); form.post('/login'); }} className="space-y-5 self-center">
                        <input
                            className="store-input"
                            placeholder="Email Address"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                        />
                        <input
                            className="store-input"
                            placeholder="Password"
                            type="password"
                            value={form.data.password}
                            onChange={(e) => form.setData('password', e.target.value)}
                        />
                        <button className="store-button w-full" disabled={form.processing}>Sign In</button>
                    </form>
                </div>
            </div>
        </StoreLayout>
    );
}
