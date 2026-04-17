import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Pagination from '../../Components/Pagination';
import { badgeClass, peso } from '../../lib/format';
import AdminLayout from '../../Layouts/AdminLayout';

const emptyForm = {
    id: '',
    name: '',
    category_id: '',
    price: '',
    stock: '',
    low_stock_threshold: 10,
    description: '',
    image: null,
    is_featured: false,
    is_active: true,
};

export default function Products({ products, categories, filters }) {
    const form = useForm(emptyForm);
    const formRef = useRef(null);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        form.clearErrors();
    }, []);

    const editProduct = (product) => {
        form.clearErrors();
        form.setData(() => ({
            id: String(product.id),
            name: product.name,
            category_id: String(product.category_id),
            price: String(product.price),
            stock: String(product.stock),
            low_stock_threshold: String(product.low_stock_threshold),
            description: product.description,
            image: null,
            is_featured: product.is_featured,
            is_active: product.is_active,
        }));

        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const submit = (e) => {
        e.preventDefault();
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => form.setData(emptyForm),
        };

        if (form.data.id) {
            form.transform((data) => ({ ...data, _method: 'PATCH' }));
            form.post(`/admin/products/${form.data.id}`, options);
            return;
        }

        form.transform((data) => data);
        form.post('/admin/products', options);
    };

    const updateFilter = (key, value) => router.get('/admin/products', { ...filters, [key]: value }, { preserveState: true, preserveScroll: true });

    const confirmDelete = () => {
        if (!productToDelete) {
            return;
        }

        router.delete(`/admin/products/${productToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setProductToDelete(null),
        });
    };

    return (
        <AdminLayout>
            <Head title="Admin Products" />
            <div className="store-card p-4">
                <div className="grid gap-3 md:grid-cols-[2fr,1.3fr,1.3fr,180px]">
                    <input className="store-input" placeholder="Search product" defaultValue={filters.search || ''} onBlur={(e) => updateFilter('search', e.target.value)} />
                    <select className="store-input" value={String(filters.category || '')} onChange={(e) => updateFilter('category', e.target.value)}>
                        <option value="">Category</option>
                        {categories.map((category) => <option key={category.id} value={String(category.id)}>{category.name}</option>)}
                    </select>
                    <select className="store-input" value={String(filters.status || '')} onChange={(e) => updateFilter('status', e.target.value)}>
                        <option value="">Status</option>
                        <option value="available">Available</option>
                        <option value="low">Low</option>
                        <option value="out">Out</option>
                    </select>
                    <button
                        type="button"
                        onClick={() => {
                            form.clearErrors();
                            form.setData(() => emptyForm);
                            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="store-button"
                    >
                        Add Product
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {products.data.map((product) => (
                    <div key={product.id} className="store-card grid items-center gap-3 p-4 md:grid-cols-[2fr,1fr,1fr,1fr,160px]">
                        <div>
                            <div className="text-xl font-bold">{product.name}</div>
                            <div className="text-sm text-slate-500">SKU: {product.sku}</div>
                        </div>
                        <div className="font-semibold">{peso(product.price)}</div>
                        <div>{product.stock}</div>
                        <div><span className={`store-badge ${badgeClass(product.status_label)}`}>{product.status_label}</span></div>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => editProduct(product)} className="store-button-secondary">Edit</button>
                            <button type="button" onClick={() => setProductToDelete(product)} className="store-button-secondary">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
                <form ref={formRef} onSubmit={submit} className="store-card space-y-4 p-6">
                    <h2 className="text-3xl font-black">{form.data.id ? 'Edit Product' : 'Add / Edit Product'}</h2>
                    <input className="store-input" placeholder="Product Name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                    <div className="grid gap-3 sm:grid-cols-2">
                        <input className="store-input" type="number" placeholder="Price" value={String(form.data.price ?? '')} onChange={(e) => form.setData('price', e.target.value)} />
                        <input className="store-input" type="number" placeholder="Stock" value={String(form.data.stock ?? '')} onChange={(e) => form.setData('stock', e.target.value)} />
                    </div>
                    <textarea className="store-input min-h-28" placeholder="Description" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                    <div className="grid gap-3 sm:grid-cols-2">
                        <select className="store-input" value={String(form.data.category_id ?? '')} onChange={(e) => form.setData('category_id', e.target.value)}>
                            <option value="">Category</option>
                            {categories.map((category) => <option key={category.id} value={String(category.id)}>{category.name}</option>)}
                        </select>
                        <input className="store-input" type="file" onChange={(e) => form.setData('image', e.target.files[0])} />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <input className="store-input" type="number" placeholder="Low stock threshold" value={String(form.data.low_stock_threshold ?? '')} onChange={(e) => form.setData('low_stock_threshold', e.target.value)} />
                        <label className="store-card flex items-center justify-between px-4 py-3">
                            <span>Toggle Availability</span>
                            <input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
                        </label>
                    </div>
                    <label className="store-card flex items-center justify-between px-4 py-3">
                        <span>Featured Product</span>
                        <input type="checkbox" checked={form.data.is_featured} onChange={(e) => form.setData('is_featured', e.target.checked)} />
                    </label>
                    <button className="store-button w-full" disabled={form.processing}>Save Product</button>
                </form>

                <div className="store-card p-6">
                    <h2 className="text-3xl font-black">Validation</h2>
                    <div className="mt-6 space-y-3">
                        {Object.keys(form.errors).length ? Object.values(form.errors).map((error) => (
                            <div key={error} className="rounded-full bg-[var(--color-store-green-soft)] px-5 py-4 text-sm font-semibold text-[var(--color-store-green)]">{error}</div>
                        )) : <div className="text-slate-500">Validation messages will appear here when a field fails.</div>}
                    </div>
                </div>
            </div>

            <Pagination meta={products.meta} url="/admin/products" query={filters} />

            {productToDelete ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4">
                    <div className="store-card w-full max-w-md p-6">
                        <h2 className="text-2xl font-black">Delete Product?</h2>
                        <p className="mt-3 text-slate-500">
                            You are about to delete <span className="font-semibold text-slate-900">{productToDelete.name}</span>.
                            This action cannot be undone.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button type="button" onClick={() => setProductToDelete(null)} className="store-button-secondary flex-1">Cancel</button>
                            <button type="button" onClick={confirmDelete} className="flex-1 rounded-2xl bg-[#d92d20] px-5 py-3 text-sm font-semibold text-white">
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </AdminLayout>
    );
}
