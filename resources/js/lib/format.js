export const peso = (value) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

export const badgeClass = (status) => {
    const normalized = String(status).toLowerCase();

    if (['available', 'paid', 'in stock - 20 available'].includes(normalized)) {
        return 'bg-[var(--color-store-green-soft)] text-[var(--color-store-green)]';
    }

    if (['low', 'pending', 'current'].includes(normalized)) {
        return 'bg-[var(--color-store-yellow)] text-[#9a6200]';
    }

    if (['shipped'].includes(normalized)) {
        return 'bg-[var(--color-store-blue)] text-[#2563eb]';
    }

    if (['simulation'].includes(normalized)) {
        return 'bg-[var(--color-store-orange)] text-[#9a4f00]';
    }

    return 'bg-slate-100 text-slate-600';
};
