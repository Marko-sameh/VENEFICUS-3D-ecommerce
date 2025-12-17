'use client';

import { useCallback, useMemo, createContext, useContext } from 'react';
import { useUnifiedCartStore } from '@/store/unifiedCartStore';

/**
 * Optimized cart hook with selectors and centralized logic
 */
export function useCart() {
  const items = useUnifiedCartStore(state => state.items);
  const total = useUnifiedCartStore(state => state.total);
  const itemCount = useUnifiedCartStore(state => state.itemCount);
  const isLoading = useUnifiedCartStore(state => state.isLoading);
  const error = useUnifiedCartStore(state => state.error);
  const isDrawerOpen = useUnifiedCartStore(state => state.isDrawerOpen);
  
  const getItems = useUnifiedCartStore(state => state.getItems);
  const getItemsWithKeys = useCallback(() => {
    if (!items) return [];
    return items.map(item => ({
      ...item,
      key: `${item.id}-${JSON.stringify(item.options || {})}`
    }));
  }, [items]);
  
  const addItem = useUnifiedCartStore(state => state.addItem);
  const updateItemQuantity = useUnifiedCartStore(state => state.updateItemQuantity);
  const removeItem = useUnifiedCartStore(state => state.removeItem);
  const toggleItem = useUnifiedCartStore(state => state.toggleItem);
  const clearCart = useUnifiedCartStore(state => state.clearCart);
  const init = useUnifiedCartStore(state => state.init);
  const openDrawer = useUnifiedCartStore(state => state.openDrawer);
  const closeDrawer = useUnifiedCartStore(state => state.closeDrawer);
  const toggleDrawer = useUnifiedCartStore(state => state.toggleDrawer);
  
  const isInCart = useUnifiedCartStore(state => state.isInCart);
  const getItemQuantity = useUnifiedCartStore(state => state.getItemQuantity);
  const getItem = useUnifiedCartStore(state => state.getItem);
  const isItemUpdating = useUnifiedCartStore(state => state.isItemUpdating);

  const handleRemove = useUnifiedCartStore(state => state.handleRemove);
  const getItemTotals = useUnifiedCartStore(state => state.getItemTotals);
  const getCartCalculations = useUnifiedCartStore(state => state.getCartCalculations);
  const handleCheckout = useUnifiedCartStore(state => state.handleCheckout);
  const appliedCoupon = useUnifiedCartStore(state => state.appliedCoupon);
  const shippingCost = useUnifiedCartStore(state => state.shippingCost);
  const isProcessing = useUnifiedCartStore(state => state.isProcessing);
  const setAppliedCoupon = useUnifiedCartStore(state => state.setAppliedCoupon);
  const setShippingCost = useUnifiedCartStore(state => state.setShippingCost);
  const couponCode = useUnifiedCartStore(state => state.couponCode);
  const couponStatus = useUnifiedCartStore(state => state.couponStatus);
  const couponError = useUnifiedCartStore(state => state.couponError);
  const applyCouponCode = useUnifiedCartStore(state => state.applyCouponCode);
  const removeCoupon = useUnifiedCartStore(state => state.removeCoupon);
  const setCouponCode = useUnifiedCartStore(state => state.setCouponCode);
  const shippingExpanded = useUnifiedCartStore(state => state.shippingExpanded);
  const shippingCountry = useUnifiedCartStore(state => state.shippingCountry);
  const shippingState = useUnifiedCartStore(state => state.shippingState);
  const shippingLoading = useUnifiedCartStore(state => state.shippingLoading);
  const shippingError = useUnifiedCartStore(state => state.shippingError);
  const calculateShipping = useUnifiedCartStore(state => state.calculateShipping);
  const setShippingExpanded = useUnifiedCartStore(state => state.setShippingExpanded);
  const setShippingCountry = useUnifiedCartStore(state => state.setShippingCountry);
  const setShippingState = useUnifiedCartStore(state => state.setShippingState);

  const isEmpty = useMemo(() => !items || items.length === 0, [items]);
  const hasItems = useMemo(() => items && items.length > 0, [items]);

  const handleToggle = useCallback((product, quantity = 1, options = {}) => {
    try {
      toggleItem(product, quantity, options);
    } catch (err) {
      
      throw new Error('Failed to toggle item.');
    }
  }, [toggleItem]);

  return {
    items,
    total,
    itemCount,
    isLoading,
    error,
    isDrawerOpen,
    isEmpty,
    hasItems,
    getItems,
    getItemsWithKeys,
    isInCart,
    getItemQuantity,
    getItem,
    isItemUpdating,
    getItemTotals,
    getCartCalculations,
    handleCheckout,
    appliedCoupon,
    shippingCost,
    isProcessing,
    setAppliedCoupon,
    setShippingCost,
    couponCode,
    couponStatus,
    couponError,
    applyCouponCode,
    removeCoupon,
    setCouponCode,
    shippingExpanded,
    shippingCountry,
    shippingState,
    shippingLoading,
    shippingError,
    calculateShipping,
    setShippingExpanded,
    setShippingCountry,
    setShippingState,

    handleRemove,
    handleToggle,
    addItem,
    addToCart: addItem,
    updateItemQuantity,
    updateQuantity: updateItemQuantity,
    removeItem,
    removeFromCart: removeItem,
    toggleItem,
    clearCart,
    init,
    openDrawer,
    closeDrawer,
    toggleDrawer
  };
}

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
  return useMemo(() => {
    if (!items) return [];
    return items.map(item => ({
      ...item,
      key: `${item.id}-${JSON.stringify(item.options || {})}`
    }));
  }, [items]);
}

// Context for legacy support
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const cartHook = useCart();
  return (
    <CartContext.Provider value={cartHook}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}