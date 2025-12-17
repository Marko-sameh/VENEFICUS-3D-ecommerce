/**
 * Unified Checkout Hook - Manages checkout flow and integrates with cart
 * Provides a clean interface for checkout operations
 */

'use client';

import { useCallback, useEffect } from 'react';
import { useUnifiedCheckoutStore } from '@/store/unifiedCheckoutStore';
import { useUnifiedCart } from './useUnifiedCart.jsx';

export function useUnifiedCheckout() {
  // Checkout state
  const currentStep = useUnifiedCheckoutStore(state => state.currentStep);
  const steps = useUnifiedCheckoutStore(state => state.steps);
  const isProcessing = useUnifiedCheckoutStore(state => state.isProcessing);
  const error = useUnifiedCheckoutStore(state => state.error);
  
  // Customer state
  const customer = useUnifiedCheckoutStore(state => state.customer);
  const shippingAddress = useUnifiedCheckoutStore(state => state.shippingAddress);
  const billingAddress = useUnifiedCheckoutStore(state => state.billingAddress);
  const sameAsShipping = useUnifiedCheckoutStore(state => state.sameAsShipping);
  
  // Shipping state
  const shippingMethod = useUnifiedCheckoutStore(state => state.shippingMethod);
  const shippingOptions = useUnifiedCheckoutStore(state => state.shippingOptions);
  const shippingLoading = useUnifiedCheckoutStore(state => state.shippingLoading);
  
  // Payment state
  const paymentMethod = useUnifiedCheckoutStore(state => state.paymentMethod);
  const paymentOptions = useUnifiedCheckoutStore(state => state.paymentOptions);
  
  // Order summary
  const orderSummary = useUnifiedCheckoutStore(state => state.orderSummary);
  
  // Actions
  const initCheckout = useUnifiedCheckoutStore(state => state.initCheckout);
  const goToStep = useUnifiedCheckoutStore(state => state.goToStep);
  const nextStep = useUnifiedCheckoutStore(state => state.nextStep);
  const prevStep = useUnifiedCheckoutStore(state => state.prevStep);
  const setCustomerInfo = useUnifiedCheckoutStore(state => state.setCustomerInfo);
  const setGuestMode = useUnifiedCheckoutStore(state => state.setGuestMode);
  const setShippingAddress = useUnifiedCheckoutStore(state => state.setShippingAddress);
  const setBillingAddress = useUnifiedCheckoutStore(state => state.setBillingAddress);
  const setSameAsShipping = useUnifiedCheckoutStore(state => state.setSameAsShipping);
  const setShippingMethod = useUnifiedCheckoutStore(state => state.setShippingMethod);
  const setPaymentMethod = useUnifiedCheckoutStore(state => state.setPaymentMethod);
  const calculateShipping = useUnifiedCheckoutStore(state => state.calculateShipping);
  const validateStep = useUnifiedCheckoutStore(state => state.validateStep);
  const canProceedToNext = useUnifiedCheckoutStore(state => state.canProceedToNext);
  const processOrder = useUnifiedCheckoutStore(state => state.processOrder);
  const resetCheckout = useUnifiedCheckoutStore(state => state.resetCheckout);
  const setError = useUnifiedCheckoutStore(state => state.setError);
  const clearError = useUnifiedCheckoutStore(state => state.clearError);
  const getCheckoutSummary = useUnifiedCheckoutStore(state => state.getCheckoutSummary);
  
  // Cart integration
  const { getCheckoutSummary: getCartSummary, clearCart, isEmpty } = useUnifiedCart();

  // Initialize checkout with cart data
  const initializeCheckout = useCallback((user = null) => {
    if (isEmpty) {
      setError('Cart is empty');
      return false;
    }
    
    const cartSummary = getCartSummary();
    initCheckout(cartSummary, user);
    return true;
  }, [isEmpty, getCartSummary, initCheckout, setError]);

  // Handle step navigation with validation
  const handleNextStep = useCallback(() => {
    if (!canProceedToNext()) {
      setError('Please complete all required fields');
      return false;
    }
    
    clearError();
    
    // Auto-calculate shipping when moving to shipping step
    if (currentStep === 1 && shippingAddress) {
      calculateShipping(shippingAddress);
    }
    
    nextStep();
    return true;
  }, [canProceedToNext, setError, clearError, currentStep, shippingAddress, calculateShipping, nextStep]);

  const handlePrevStep = useCallback(() => {
    clearError();
    prevStep();
  }, [clearError, prevStep]);

  const handleGoToStep = useCallback((stepIndex) => {
    clearError();
    goToStep(stepIndex);
  }, [clearError, goToStep]);

  // Handle address changes with shipping calculation
  const handleShippingAddressChange = useCallback(async (address) => {
    setShippingAddress(address);
    
    // Auto-calculate shipping if address is complete
    if (address && address.address1 && address.city && address.zipCode && address.country) {
      try {
        await calculateShipping(address);
      } catch (error) {
        
      }
    }
  }, [setShippingAddress, calculateShipping]);

  // Handle order placement
  const handlePlaceOrder = useCallback(async () => {
    try {
      clearError();
      
      // Basic validation
      if (!shippingAddress) {
        setError('Please select a shipping address');
        return false;
      }
      
      if (!paymentMethod) {
        setError('Please select a payment method');
        return false;
      }
      
      // Get cart data
      const cartSummary = getCartSummary();
      
      if (!cartSummary.items || cartSummary.items.length === 0) {
        setError('Your cart is empty');
        return false;
      }
      
      // Set processing state
      const { useUnifiedCheckoutStore } = await import('@/store/unifiedCheckoutStore');
      useUnifiedCheckoutStore.getState().setProcessing?.(true);
      
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create order
      const order = {
        id: `ORDER-${Date.now()}`,
        status: 'confirmed',
        total: cartSummary.total,
        items: cartSummary.items,
        shippingAddress,
        paymentMethod,
        createdAt: new Date().toISOString()
      };
      
      // Clear cart
      clearCart();
      
      // Reset processing state
      useUnifiedCheckoutStore.getState().setProcessing?.(false);
      
      // Redirect to orders page
      window.location.href = `/orders`;
      
      return order;
    } catch (error) {
      
      setError('Failed to place order. Please try again.');
      
      // Reset processing state
      const { useUnifiedCheckoutStore } = await import('@/store/unifiedCheckoutStore');
      useUnifiedCheckoutStore.getState().setProcessing?.(false);
      
      return false;
    }
  }, [
    clearError,
    setError,
    shippingAddress,
    paymentMethod,
    getCartSummary,
    clearCart
  ]);

  // Auto-initialize checkout when cart has items
  useEffect(() => {
    if (!isEmpty && !orderSummary) {
      initializeCheckout();
    }
  }, [isEmpty, orderSummary, initializeCheckout]);

  // Get current step info
  const getCurrentStepInfo = useCallback(() => {
    const step = steps[currentStep - 1];
    return {
      ...step,
      index: currentStep - 1,
      isFirst: currentStep === 1,
      isLast: currentStep === steps.length,
      canProceed: canProceedToNext()
    };
  }, [steps, currentStep, canProceedToNext]);

  // Get form validation errors
  const getValidationErrors = useCallback(() => {
    const errors = [];
    
    if (currentStep === 1) {
      if (!customer.email) errors.push('Email is required');
      if (!customer.firstName) errors.push('First name is required');
      if (!customer.lastName) errors.push('Last name is required');
    }
    
    if (currentStep === 2) {
      if (!shippingAddress?.address1) errors.push('Address is required');
      if (!shippingAddress?.city) errors.push('City is required');
      if (!shippingAddress?.zipCode) errors.push('ZIP code is required');
      if (!shippingAddress?.country) errors.push('Country is required');
    }
    
    if (currentStep === 3) {
      if (!shippingMethod) errors.push('Please select a shipping method');
      if (!paymentMethod) errors.push('Please select a payment method');
    }
    
    return errors;
  }, [currentStep, customer, shippingAddress, shippingMethod, paymentMethod]);

  return {
    // State
    currentStep,
    steps,
    isProcessing,
    error,
    
    // Customer
    customer,
    shippingAddress,
    billingAddress,
    sameAsShipping,
    
    // Shipping
    shippingMethod,
    shippingOptions,
    shippingLoading,
    
    // Payment
    paymentMethod,
    paymentOptions,
    
    // Order
    orderSummary,
    
    // Navigation
    handleNextStep,
    handlePrevStep,
    handleGoToStep,
    getCurrentStepInfo,
    
    // Customer actions
    setCustomerInfo,
    setGuestMode,
    
    // Address actions
    setShippingAddress: handleShippingAddressChange,
    setBillingAddress,
    setSameAsShipping,
    
    // Shipping actions
    setShippingMethod,
    calculateShipping,
    
    // Payment actions
    setPaymentMethod,
    
    // Order actions
    handlePlaceOrder,
    
    // Utilities
    initializeCheckout,
    resetCheckout,
    getCheckoutSummary,
    getValidationErrors,
    
    // Error handling
    setError,
    clearError,
    
    // Validation
    validateStep,
    canProceedToNext
  };
}

// Specialized hooks for specific checkout steps
export function useCheckoutStep() {
  const currentStep = useUnifiedCheckoutStore(state => state.currentStep);
  const steps = useUnifiedCheckoutStore(state => state.steps);
  const canProceedToNext = useUnifiedCheckoutStore(state => state.canProceedToNext);
  
  return {
    currentStep,
    steps,
    canProceedToNext,
    currentStepInfo: steps[currentStep - 1]
  };
}

export function useCheckoutCustomer() {
  const customer = useUnifiedCheckoutStore(state => state.customer);
  const setCustomerInfo = useUnifiedCheckoutStore(state => state.setCustomerInfo);
  const setGuestMode = useUnifiedCheckoutStore(state => state.setGuestMode);
  
  return {
    customer,
    setCustomerInfo,
    setGuestMode,
    isGuest: customer.isGuest
  };
}

export function useCheckoutShipping() {
  const shippingAddress = useUnifiedCheckoutStore(state => state.shippingAddress);
  const shippingMethod = useUnifiedCheckoutStore(state => state.shippingMethod);
  const shippingOptions = useUnifiedCheckoutStore(state => state.shippingOptions);
  const shippingLoading = useUnifiedCheckoutStore(state => state.shippingLoading);
  const setShippingAddress = useUnifiedCheckoutStore(state => state.setShippingAddress);
  const setShippingMethod = useUnifiedCheckoutStore(state => state.setShippingMethod);
  const calculateShipping = useUnifiedCheckoutStore(state => state.calculateShipping);
  
  return {
    shippingAddress,
    shippingMethod,
    shippingOptions,
    shippingLoading,
    setShippingAddress,
    setShippingMethod,
    calculateShipping
  };
}