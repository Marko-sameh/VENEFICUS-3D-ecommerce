/**
 * Unified Cart Hook - Single hook for all cart operations
 * Integrates with unified cart store and provides optimized selectors
 * Architecture: React Components → Unified Cart Hook → Unified Cart Store → Unified Cart Service
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useUnifiedCartStore } from '@/store/unifiedCartStore';

/**
 * Optimized cart hook with selectors and centralized logic
 */
export function useUnifiedCart() {
  // Selective subscriptions for optimal performance
  const items = useUnifiedCartStore(state => state.items);
  const subtotal = useUnifiedCartStore(state => state.subtotal);
  const tax = useUnifiedCartStore(state => state.tax);
  const shipping = useUnifiedCartStore(state => state.shipping);
  const discount = useUnifiedCartStore(state => state.discount);
  const total = useUnifiedCartStore(state => state.total);
  const itemCount = useUnifiedCartStore(state => state.itemCount);
  const isLoading = useUnifiedCartStore(state => state.isLoading);
  const error = useUnifiedCartStore(state => state.error);
  const isDrawerOpen = useUnifiedCartStore(state => state.isDrawerOpen);

  // Coupon state
  const appliedCoupon = useUnifiedCartStore(state => state.appliedCoupon);
  const couponCode = useUnifiedCartStore(state => state.couponCode);
  const couponStatus = useUnifiedCartStore(state => state.couponStatus);
  const couponError = useUnifiedCartStore(state => state.couponError);

  // Shipping state
  const shippingMethod = useUnifiedCartStore(state => state.shippingMethod);
  const shippingCost = useUnifiedCartStore(state => state.shippingCost);
  const shippingExpanded = useUnifiedCartStore(state => state.shippingExpanded);
  const shippingCountry = useUnifiedCartStore(state => state.shippingCountry);
  const shippingState = useUnifiedCartStore(state => state.shippingState);
  const shippingLoading = useUnifiedCartStore(state => state.shippingLoading);
  const shippingError = useUnifiedCartStore(state => state.shippingError);

  // Processing state
  const isProcessing = useUnifiedCartStore(state => state.isProcessing);

  // Actions
  const init = useUnifiedCartStore(state => state.init);
  const addItem = useUnifiedCartStore(state => state.addItem);
  const updateItemQuantity = useUnifiedCartStore(state => state.updateItemQuantity);
  const removeItem = useUnifiedCartStore(state => state.removeItem);
  const toggleItem = useUnifiedCartStore(state => state.toggleItem);
  const clearCart = useUnifiedCartStore(state => state.clearCart);

  // UI actions
  const openDrawer = useUnifiedCartStore(state => state.openDrawer);
  const closeDrawer = useUnifiedCartStore(state => state.closeDrawer);
  const toggleDrawer = useUnifiedCartStore(state => state.toggleDrawer);

  // Utility functions
  const isInCart = useUnifiedCartStore(state => state.isInCart);
  const getItemQuantity = useUnifiedCartStore(state => state.getItemQuantity);
  const getItem = useUnifiedCartStore(state => state.getItem);
  const isItemUpdating = useUnifiedCartStore(state => state.isItemUpdating);
  const getItemTotals = useUnifiedCartStore(state => state.getItemTotals);
  const getCartCalculations = useUnifiedCartStore(state => state.getCartCalculations);

  // Handlers
  const handleQuantityChange = useUnifiedCartStore(state => state.handleQuantityChange);
  const handleRemove = useUnifiedCartStore(state => state.handleRemove);
  const handleCheckout = useUnifiedCartStore(state => state.handleCheckout);

  // Coupon actions
  const applyCouponCode = useUnifiedCartStore(state => state.applyCouponCode);
  const removeCoupon = useUnifiedCartStore(state => state.removeCoupon);
  const setCouponCode = useUnifiedCartStore(state => state.setCouponCode);

  // Shipping actions
  const calculateShipping = useUnifiedCartStore(state => state.calculateShipping);
  const setShippingExpanded = useUnifiedCartStore(state => state.setShippingExpanded);
  const setShippingCountry = useUnifiedCartStore(state => state.setShippingCountry);
  const setShippingState = useUnifiedCartStore(state => state.setShippingState);
  const setShippingMethod = useUnifiedCartStore(state => state.setShippingMethod);

  // Checkout actions
  const validateForCheckout = useUnifiedCartStore(state => state.validateForCheckout);
  const getCheckoutSummary = useUnifiedCartStore(state => state.getCheckoutSummary);

  // Error handling
  const clearError = useUnifiedCartStore(state => state.clearError);

  // Computed values with memoization
  const isEmpty = useMemo(() => !items || items.length === 0, [items?.length]);
  const hasItems = useMemo(() => items && items.length > 0, [items?.length]);

  // Items with keys for React rendering
  const itemsWithKeys = useMemo(() =>
    items?.map(item => ({
      ...item,
      key: item.key || `${item.id}-${JSON.stringify(item.options || {})}`,
    })) || [],
    [items]
  );

  // Optimized handlers with error management
  const handleToggle = useCallback(async (product, quantity = 1, options = {}) => {
    try {
      return await toggleItem(product, quantity, options);
    } catch (err) {
      
      throw new Error('Failed to toggle item.');
    }
  }, [toggleItem]);

  const handleAddToCart = useCallback(async (product, quantity = 1, options = {}) => {
    try {
      return await addItem(product, quantity, options);
    } catch (err) {
      
      throw new Error('Failed to add item to cart.');
    }
  }, [addItem]);

  return {
    // State
    items,
    itemsWithKeys,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    itemCount,
    isLoading,
    error,
    isDrawerOpen,
    isEmpty,
    hasItems,

    // Coupon state
    appliedCoupon,
    couponCode,
    couponStatus,
    couponError,

    // Shipping state
    shippingMethod,
    shippingCost,
    shippingExpanded,
    shippingCountry,
    shippingState,
    shippingLoading,
    shippingError,

    // Processing state
    isProcessing,

    // Core actions
    init,
    addItem: handleAddToCart,
    addToCart: handleAddToCart, // Alias for compatibility
    updateItemQuantity,
    updateQuantity: updateItemQuantity, // Alias for compatibility
    removeItem,
    removeFromCart: removeItem, // Alias for compatibility
    toggleItem: handleToggle,
    clearCart,

    // UI actions
    openDrawer,
    closeDrawer,
    toggleDrawer,

    // Utility functions
    isInCart,
    getItemQuantity,
    getItem,
    isItemUpdating,
    getItemTotals,
    getCartCalculations,

    // Handlers
    handleQuantityChange,
    handleRemove,
    handleCheckout,

    // Coupon actions
    applyCouponCode,
    removeCoupon,
    setCouponCode,

    // Shipping actions
    calculateShipping,
    setShippingExpanded,
    setShippingCountry,
    setShippingState,
    setShippingMethod,

    // Checkout actions
    validateForCheckout,
    getCheckoutSummary,

    // Error handling
    clearError,
  };
}

// Specialized hooks for specific use cases
export function useCartCount() {
  return useUnifiedCartStore(state => state.itemCount);
}

export function useCartTotal() {
  return useUnifiedCartStore(state => state.total);
}

export function useCartDrawer() {
  const isOpen = useUnifiedCartStore(state => state.isDrawerOpen);
  const open = useUnifiedCartStore(state => state.openDrawer);
  const close = useUnifiedCartStore(state => state.closeDrawer);
  const toggle = useUnifiedCartStore(state => state.toggleDrawer);

  return { isOpen, open, close, toggle };
}

export function useCartItems() {
  const items = useUnifiedCartStore(state => state.items);
  return useMemo(() =>
    items?.map(item => ({
      ...item,
      key: item.key || `${item.id}-${JSON.stringify(item.options || {})}`
    })) || [], [items]
  );
}

export function useCartSummary() {
  const subtotal = useUnifiedCartStore(state => state.subtotal);
  const tax = useUnifiedCartStore(state => state.tax);
  const shipping = useUnifiedCartStore(state => state.shipping);
  const discount = useUnifiedCartStore(state => state.discount);
  const total = useUnifiedCartStore(state => state.total);
  const appliedCoupon = useUnifiedCartStore(state => state.appliedCoupon);
  const shippingMethod = useUnifiedCartStore(state => state.shippingMethod);

  return {
    subtotal,
    tax,
    shipping,
    discount,
    total,
    appliedCoupon,
    shippingMethod
  };
}

// Backward compatibility - export as default for existing imports
export { useUnifiedCart as useCart };
export default useUnifiedCart;