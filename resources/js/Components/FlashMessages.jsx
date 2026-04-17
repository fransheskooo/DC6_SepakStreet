import { usePage } from '@inertiajs/react';

export default function FlashMessages() {
    const { flash, errors } = usePage().props;
    const error = flash?.error || Object.values(errors || {})[0];
    const success = flash?.success;

    if (!error && !success) {
        return null;
    }

    return (
        <div className="mb-6 space-y-3">
            {success ? <div className="store-card px-4 py-3 text-sm text-[var(--color-store-green)]">{success}</div> : null}
            {error ? <div className="store-card px-4 py-3 text-sm text-[#b42318]">{error}</div> : null}
        </div>
    );
}
