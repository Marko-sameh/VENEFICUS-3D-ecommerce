/**
 * Unified Cart Store - Single source of truth for cart state
 * Integrates with unified cart service and product system
 * Architecture: Products System → Unified Cart Service → Zustand Store → React Components
 */

import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { unifiedCartService } from '@/services/unified-cart';
import apiClient from '@/lib/api-client';
import { useUserStore } from './userStore';

let addToCartListenerAdded = false;
let addToCartHandler = null;

const setupAddToCartListener = (get) => {
    if (typeof window !== 'undefined' && !addToCartListenerAdded) {
        addToCartHandler = (event) => {
            const { product, quantity, options } = event.detail;
            get().addItem(product, quantity, options);
        };
        window.addEventListener('addToCart', addToCartHandler);
        addToCartListenerAdded = true;
    }
};

const cleanupAddToCartListener = () => {
    if (typeof window !== 'undefined' && addToCartHandler) {
        window.removeEventListener('addToCart', addToCartHandler);
        addToCartListenerAdded = false;
        addToCartHandler = null;
    }
};

export const useUnifiedCartStore = create(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                // Core cart state
                items: [],
                subtotal: 0,
                tax: 0,
                shipping: 0,
                discount: 0,
                total: 0,
                itemCount: 0,

                // UI state
                isLoading: false,
                error: null,
                isVisible: false,
                isDrawerOpen: false,
                isUpdating: {},

                // Coupon state
                appliedCoupon: null,
                couponCode: '',
                couponStatus: null,
                couponError: '',

                // Shipping state
                shippingMethod: null,
                shippingCost: 0,
                shippingExpanded: false,
                shippingCountry: 'US',
                shippingState: '',
                shippingLoading: false,
                shippingError: '',

                // Checkout state
                isProcessing: false,

                // Initialize cart from unified service
                init: async () => {
                    set({ isLoading: true });
                    try {
                        const cartData = await unifiedCartService.getCart();

                        set({
                            items: cartData.items || [],
                            subtotal: cartData.subtotal || 0,
                            tax: cartData.tax || 0,
                            shipping: cartData.shipping || 0,
                            discount: cartData.discount || 0,
                            total: cartData.total || 0,
                            itemCount: cartData.itemCount || 0,
                            isLoading: false,
                            error: null
                        });

                        setTimeout(() => set({ isVisible: true }), 300);
                        setupAddToCartListener(get);
                    } catch (error) {
                        set({ error: 'Failed to load cart', isLoading: false });
                    }
                },

                // Cleanup listener
                cleanup: () => {
                    cleanupAddToCartListener();
                },

                // UI Controls
                setVisible: (visible) => set({ isVisible: visible }),
                openDrawer: async () => {
                    set({ isDrawerOpen: true });
                    await get().init();
                },
                closeDrawer: () => set({ isDrawerOpen: false }),
                toggleDrawer: async () => {
                    const { isDrawerOpen } = get();
                    if (!isDrawerOpen) {
                        await get().init();
                    }
                    set({ isDrawerOpen: !isDrawerOpen });
                },

                // Selectors
                getItems: () => get().items,
                isEmpty: () => get().items.length === 0,
                hasItems: () => get().items.length > 0,

                // Unified cart logic using service
                isInCart: (productId, options = {}) => {
                    return unifiedCartService.isInCart(productId, options);
                },

                getItemQuantity: (productId, options = {}) => {
                    return unifiedCartService.getItemQuantity(productId, options);
                },

                getItem: (productId, options = {}) => {
                    const { items } = get();
                    const itemKey = `${productId}-${JSON.stringify(options)}`;
                    return items.find(item => item.key === itemKey);
                },

                setItemUpdating: (cartItemId, options, isUpdating) => {
                    const itemKey = `cart-${cartItemId}`;
                    set(state => ({
                        isUpdating: {
                            ...state.isUpdating,
                            [itemKey]: isUpdating
                        }
                    }));
                },

                isItemUpdating: (cartItemId, options = {}) => {
                    const { isUpdating } = get();
                    const itemKey = `cart-${cartItemId}`;
                    return isUpdating[itemKey] || false;
                },

                // Calculate item totals
                getItemTotals: (item) => {
                    const price = item?.product?.discounted_price ? item.product.discounted_price : (item?.product?.price || item?.price || 0);
                    const quantity = item?.quantity ?? 1;
                    return {
                        price: parseFloat(price),
                        quantity,
                        totalPrice: (parseFloat(price) * quantity).toFixed(2)
                    };
                },

                // Cart summary calculations
                getCartCalculations: () => {
                    const { items = [], appliedCoupon, shippingCost } = get();
                    const taxRate = useUserStore.getState().getTax() / 100;
                    const subtotal = items.reduce((sum, item) => {
                        const price = item.product?.discounted_price ? item.product.discounted_price : (item.product?.price || item.piece_price || 0);
                        return sum + (parseFloat(price) * parseInt(item.quantity || 0));
                    }, 0);
                    const tax = subtotal * taxRate;
                    const discount = appliedCoupon?.discount || 0;
                    const finalTotal = subtotal + tax + shippingCost - discount;

                    return {
                        subtotal: Number(subtotal.toFixed(2)),
                        tax: Number(tax.toFixed(2)),
                        discount: Number(discount.toFixed(2)),
                        finalTotal: Number(finalTotal.toFixed(2))
                    };
                },

                handleRemove: async (cartItemId, options = {}) => {
                    try {
                        set({ isLoading: true, error: null });
                        await apiClient.delete(`/api/delete_cart_item/${cartItemId}`);
                        await get().init();
                    } catch (err) {
                        set({ error: 'Failed to remove item', isLoading: false });
                        throw new Error('Failed to remove item.');
                    }
                },

                // Add item to cart with optimistic updates
                addItem: async (product, quantity = 1, options = {}) => {
                    if (!product?.id) {
                        set({ error: 'Invalid product' });
                        return { success: false, error: 'Invalid product' };
                    }

                    set({ isLoading: true, error: null });

                    try {
                        const userData = localStorage.getItem('veneficus_user_data');
                        const user = userData ? JSON.parse(userData) : null;

                        if (!user?.id) {
                            set({ error: 'Please sign in to add items to cart', isLoading: false });
                            return { success: false, error: 'Please sign in to add items to cart' };
                        }

                        if (!options.colorId || !options.sizeId) {
                            set({ error: 'Please select color and size', isLoading: false });
                            return { success: false, error: 'Please select color and size' };
                        }

                        const data = {
                            user_id: user.id,
                            product_id: product.id,
                            color_id: options.colorId,
                            size_id: options.sizeId,
                            quantity: parseInt(quantity),
                        };

                        const result = await apiClient.post('/api/add_cart', data);

                        if (result.error) {
                            throw new Error(result.error);
                        }

                        await get().init();
                        return { success: true };
                    } catch (error) {
                        set({ error: error.message, isLoading: false });
                        return { success: false, error: error.message };
                    }
                },

                // Update item quantity using unified service
                updateItemQuantity: async (itemId, quantity, options = {}) => {
                    if (!itemId || typeof quantity !== 'number') {
                        set({ error: 'Invalid item ID or quantity' });
                        return;
                    }

                    if (quantity <= 0) {
                        return get().removeItem(itemId, options);
                    }

                    const { setItemUpdating } = get();
                    setItemUpdating(itemId, options, true);

                    try {
                        const itemKey = `${itemId}-${JSON.stringify(options)}`;
                        const cartData = unifiedCartService.updateQuantity(itemKey, quantity);

                        set({
                            items: cartData.items,
                            subtotal: cartData.subtotal,
                            tax: cartData.tax,
                            shipping: cartData.shipping,
                            discount: cartData.discount,
                            total: cartData.total,
                            itemCount: cartData.itemCount,
                            error: null
                        });
                    } catch (error) {
                        set({ error: 'Failed to update quantity' });
                        throw error;
                    } finally {
                        setItemUpdating(itemId, options, false);
                    }
                },

                // Remove item from cart using unified service
                removeItem: (itemId, options = {}) => {
                    try {
                        const itemKey = `${itemId}-${JSON.stringify(options)}`;
                        const cartData = unifiedCartService.removeItem(itemKey);

                        set({
                            items: cartData.items,
                            subtotal: cartData.subtotal,
                            tax: cartData.tax,
                            shipping: cartData.shipping,
                            discount: cartData.discount,
                            total: cartData.total,
                            itemCount: cartData.itemCount,
                            error: null
                        });
                    } catch (error) {
                        set({ error: 'Failed to remove item' });
                        throw error;
                    }
                },

                // Toggle item in cart (add if not present, remove if present)
                toggleItem: async (product, quantity = 1, options = {}) => {
                    const { isInCart, addItem, removeItem } = get();
                    if (isInCart(product.id, options)) {
                        removeItem(product.id, options);
                        return false;
                    } else {
                        return await addItem(product, quantity, options);
                    }
                },

                // Clear cart using unified service
                clearCart: () => {
                    try {
                        const cartData = unifiedCartService.clearCart();
                        set({
                            items: cartData.items,
                            subtotal: cartData.subtotal,
                            tax: cartData.tax,
                            shipping: cartData.shipping,
                            discount: cartData.discount,
                            total: cartData.total,
                            itemCount: cartData.itemCount,
                            appliedCoupon: null,
                            shippingMethod: null,
                            error: null
                        });
                    } catch (error) {
                        set({ error: 'Failed to clear cart' });
                    }
                },

                // Apply coupon using unified service
                applyCouponCode: async (code) => {
                    const { items } = get();
                    set({ couponStatus: 'loading', couponError: '' });

                    try {
                        const result = unifiedCartService.applyCoupon(code, items);
                        set({
                            appliedCoupon: {
                                code: result.code,
                                discount: result.discount,
                                type: result.type,
                                message: result.message
                            },
                            couponStatus: 'success',
                            couponCode: result.code,
                            discount: result.totals.discount,
                            total: result.totals.total,
                            error: null
                        });
                        return true;
                    } catch (error) {
                        set({
                            couponError: error.message,
                            couponStatus: 'error'
                        });
                        return false;
                    }
                },

                removeCoupon: () => {
                    set({
                        appliedCoupon: null,
                        couponCode: '',
                        couponStatus: null,
                        couponError: '',
                        discount: 0
                    });

                    const { items, shippingCost } = get();
                    const cartData = unifiedCartService.getCheckoutSummary(items, null, shippingCost);
                    set({
                        subtotal: cartData.subtotal,
                        tax: cartData.tax,
                        shipping: cartData.shipping,
                        total: cartData.total
                    });
                },

                setCouponCode: (code) => set({ couponCode: code }),

                // Calculate shipping using unified service
                calculateShipping: async () => {
                    const { shippingCountry, shippingState, items } = get();

                    set({ shippingLoading: true, shippingError: '' });

                    try {
                        await new Promise(resolve => setTimeout(resolve, 800));

                        const result = unifiedCartService.calculateShipping(shippingCountry, shippingState, items);

                        set({
                            shippingCost: result.cost,
                            shippingMethod: {
                                name: result.method,
                                cost: result.cost,
                                estimatedDays: result.estimatedDays
                            },
                            shippingLoading: false,
                            shippingError: ''
                        });

                        const { appliedCoupon } = get();
                        const cartData = unifiedCartService.getCheckoutSummary(items, appliedCoupon, result.cost);
                        set({
                            subtotal: cartData.subtotal,
                            tax: cartData.tax,
                            shipping: cartData.shipping,
                            discount: cartData.discount,
                            total: cartData.total
                        });
                    } catch (error) {
                        set({
                            shippingError: 'Failed to calculate shipping',
                            shippingLoading: false
                        });
                    }
                },

                setShippingExpanded: (expanded) => set({ shippingExpanded: expanded }),
                setShippingCountry: (country) => set({ shippingCountry: country }),
                setShippingState: (state) => set({ shippingState: state }),

                // Set shipping method
                setShippingMethod: (method) => {
                    if (!method || typeof method.cost !== 'number') {
                        set({ error: 'Invalid shipping method' });
                        return;
                    }

                    set({
                        shippingMethod: method,
                        shippingCost: method.cost,
                        error: null
                    });

                    const { items, appliedCoupon } = get();
                    const cartData = unifiedCartService.getCheckoutSummary(items, appliedCoupon, method.cost);
                    set({
                        subtotal: cartData.subtotal,
                        tax: cartData.tax,
                        shipping: cartData.shipping,
                        discount: cartData.discount,
                        total: cartData.total
                    });
                },

                // Validate and prepare for checkout
                validateForCheckout: async () => {
                    const { items } = get();
                    set({ isLoading: true });

                    try {
                        const validation = await unifiedCartService.validateCart(items);
                        set({ isLoading: false });

                        if (!validation.isValid) {
                            set({ error: validation.errors.join(', ') });
                            return false;
                        }

                        return true;
                    } catch (error) {
                        set({ error: 'Failed to validate cart', isLoading: false });
                        return false;
                    }
                },

                // Get checkout summary
                getCheckoutSummary: () => {
                    const { items, appliedCoupon, shippingCost } = get();
                    return unifiedCartService.getCheckoutSummary(items, appliedCoupon, shippingCost);
                },

                // Checkout handler
                handleCheckout: () => {
                    const { items, setIsProcessing } = get();
                    if (items.length === 0) return false;

                    setIsProcessing(true);
                    setTimeout(() => {
                        window.location.href = '/checkout';
                    }, 500);
                    return true;
                },

                setIsProcessing: (processing) => set({ isProcessing: processing }),
                setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
                setShippingCost: (cost) => set({ shippingCost: cost }),

                // Reset error state
                clearError: () => set({ error: null }),

                // Reset visibility
                resetVisibility: () => set({ isVisible: false }),
            }),
            {
                name: 'unified-cart-storage',
                partialize: (state) => ({
                    appliedCoupon: state.appliedCoupon,
                    shippingMethod: state.shippingMethod,
                    shippingCountry: state.shippingCountry,
                    shippingState: state.shippingState
                }),
            }
        )
    )
);
