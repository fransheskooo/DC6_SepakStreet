import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '../../Layouts/StoreLayout';

export default function Register() {
    const form = useForm({ name: '', email: '', password: '', password_confirmation: '' });

    return (
        <StoreLayout>
            <Head title="Register" />
            <div className="mx-auto max-w-4xl">
                <div className="store-card grid gap-6 p-6 lg:grid-cols-[1.05fr,1fr]">
                    <form onSubmit={(e) => { e.preventDefault(); form.post('/register'); }} className="space-y-5 self-center">
                        <input
                            className="store-input"
                            placeholder="Full Name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                        />
                        <input
                            className="store-input"
                            placeholder="Email Address"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <input
                                className="store-input"
                                placeholder="Password"
                                type="password"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                            />
                            <input
                                className="store-input"
                                placeholder="Confirm Password"
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(e) => form.setData('password_confirmation', e.target.value)}
                            />
                        </div>
                        <button className="store-button w-full" disabled={form.processing}>Create Account</button>
                    </form>
                    <div className="rounded-3xl bg-slate-50 p-8">
                        <span className="store-badge bg-[var(--color-store-green-soft)] text-[var(--color-store-green)]">Register</span>
                        <h1 className="mt-8 text-5xl font-black">Join Sepak Street</h1>
                        <p className="mt-4 text-lg text-slate-500">Create an account for faster checkout and order tracking.</p>
                        <div className="mt-8 rounded-3xl border border-[var(--color-store-border)] bg-white p-5 text-sm text-slate-500">
                            Already have an account? <Link href="/login" className="font-semibold text-[var(--color-store-green)]">Sign in</Link>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
