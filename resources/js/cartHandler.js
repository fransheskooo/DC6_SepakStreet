import { router } from '@inertiajs/react';

export function handlePendingCartItem() {
    const pendingCartItem = sessionStorage.getItem('pending_cart_item');
    
    if (pendingCartItem) {
        try {
            const cartItem = JSON.parse(pendingCartItem);
            
            // Add the item to cart via POST request
            router.post('/cart/items', {
                product_id: cartItem.product_id,
                quantity: cartItem.quantity
            }, {
                onSuccess: () => {
                    // Clear the pending cart item after successful addition
                    sessionStorage.removeItem('pending_cart_item');
                    console.log(`Added ${cartItem.quantity} × ${cartItem.product_name} to cart`);
                },
                onError: (errors) => {
                    console.error('Failed to add pending cart item:', errors);
                    // Still remove the pending item to avoid infinite loops
                    sessionStorage.removeItem('pending_cart_item');
                }
            });
        } catch (error) {
            console.error('Error parsing pending cart item:', error);
            sessionStorage.removeItem('pending_cart_item');
        }
    }
}

// Auto-check for pending cart items on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure Inertia is ready
    setTimeout(() => {
        handlePendingCartItem();
    }, 100);
});
