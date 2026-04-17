import { router } from '@inertiajs/react';

export default function Pagination({ meta, url, query = {} }) {
    if (!meta || meta.last_page <= 1) {
        return null;
    }

    const go = (page) => router.get(url, { ...query, page }, { preserveScroll: true, preserveState: true });

    return (
        <div className="flex items-center justify-center gap-2">
            {Array.from({ length: meta.last_page }, (_, index) => index + 1).map((page) => (
                <button
                    key={page}
                    type="button"
                    onClick={() => go(page)}
                    className={`h-10 min-w-10 rounded-2xl border text-sm ${page === meta.current_page ? 'border-[var(--color-store-green)] bg-[var(--color-store-green)] text-white' : 'border-[var(--color-store-border)] bg-white text-slate-700'}`}
                >
                    {page}
                </button>
            ))}
        </div>
    );
}
