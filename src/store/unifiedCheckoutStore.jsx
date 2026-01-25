/**
 * Unified Checkout Store - Manages checkout flow and state
 * Integrates with unified cart store for seamless checkout experience
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUnifiedCheckoutStore = create(
  persist(
    (set, get) => ({
      // Checkout flow state
      currentStep: 1,
      isProcessing: false,
      error: null,
      
      // Customer information
      customer: {
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        isGuest: true
      },
      
      // Addresses
      shippingAddress: null,
      billingAddress: null,
      sameAsShipping: true,
      
      // Shipping
      shippingMethod: null,
      shippingOptions: [],
      shippingLoading: false,
      
      // Payment
      paymentMethod: null,
      paymentOptions: [],
      
      // Order summary
      orderSummary: null,
      
      // Steps configuration
      steps: [
        { id: 'information', name: 'Information', status: 'current' },
        { id: 'shipping', name: 'Shipping', status: 'upcoming' },
        { id: 'payment', name: 'Payment', status: 'upcoming' },
        { id: 'review', name: 'Review', status: 'upcoming' }
      ],

      // Initialize checkout
      initCheckout: (cartSummary, user = null) => {
        set({
          orderSummary: cartSummary,
          customer: user ? {
            email: user.email || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phone: user.phone || '',
            isGuest: false
          } : get().customer,
          currentStep: 1,
          error: null
        });
      },

      // Step navigation
      goToStep: (stepIndex) => {
        const steps = get().steps.map((step, index) => ({
          ...step,
          status: index < stepIndex ? 'complete' : 
                 index === stepIndex ? 'current' : 'upcoming'
        }));
        
        set({ currentStep: stepIndex + 1, steps });
      },

      nextStep: () => {
        const { currentStep, steps } = get();
        if (currentStep < steps.length) {
          const newStep = currentStep + 1;
          const updatedSteps = steps.map((step, index) => ({
            ...step,
            status: index < newStep - 1 ? 'complete' : 
                   index === newStep - 1 ? 'current' : 'upcoming'
          }));
          
          set({ currentStep: newStep, steps: updatedSteps });
        }
      },

      prevStep: () => {
        const { currentStep, steps } = get();
        if (currentStep > 1) {
          const newStep = currentStep - 1;
          const updatedSteps = steps.map((step, index) => ({
            ...step,
            status: index < newStep - 1 ? 'complete' : 
                   index === newStep - 1 ? 'current' : 'upcoming'
          }));
          
          set({ currentStep: newStep, steps: updatedSteps });
        }
      },

      // Customer information
      setCustomerInfo: (customerInfo) => {
        set(state => ({
          customer: { ...state.customer, ...customerInfo }
        }));
      },

      setGuestMode: (isGuest) => {
        set(state => ({
          customer: { ...state.customer, isGuest }
        }));
      },

      // Address management
      setShippingAddress: (address) => {
        set({ shippingAddress: address });
        
        // If same as shipping is enabled, update billing address too
        if (get().sameAsShipping) {
          set({ billingAddress: address });
        }
      },

      setBillingAddress: (address) => {
        set({ billingAddress: address, sameAsShipping: false });
      },

      setSameAsShipping: (same) => {
        set({ sameAsShipping: same });
        
        if (same) {
          const { shippingAddress } = get();
          set({ billingAddress: shippingAddress });
        }
      },

      // Shipping methods
      setShippingOptions: (options) => {
        set({ shippingOptions: options });
      },

      setShippingMethod: (method) => {
        set({ shippingMethod: method });
      },

      calculateShipping: async (address) => {
        set({ shippingLoading: true });
        
        try {
          // Mock shipping calculation - replace with real API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const options = [
            {
              id: 'standard',
              name: 'Standard Shipping',
              description: '5-7 business days',
              price: address?.country === 'US' ? 5.99 : 12.99,
              estimatedDays: '5-7'
            },
            {
              id: 'express',
              name: 'Express Shipping',
              description: '2-3 business days',
              price: address?.country === 'US' ? 12.99 : 24.99,
              estimatedDays: '2-3'
            },
            {
              id: 'overnight',
              name: 'Overnight Shipping',
              description: 'Next business day',
              price: address?.country === 'US' ? 24.99 : 49.99,
              estimatedDays: '1'
            }
          ];
          
          set({ 
            shippingOptions: options,
            shippingMethod: options[0], // Auto-select first option
            shippingLoading: false 
          });
          
          return options;
        } catch (error) {
          set({ 
            error: 'Failed to calculate shipping rates',
            shippingLoading: false 
          });
          throw error;
        }
      },

      // Payment methods
      setPaymentOptions: (options) => {
        set({ paymentOptions: options });
      },

      setPaymentMethod: (method) => {
        set({ paymentMethod: method });
      },

      // Validation
      validateStep: (stepIndex) => {
        const { customer, shippingAddress, shippingMethod, paymentMethod } = get();
        
        switch (stepIndex) {
          case 1: // Information
            if (customer.isGuest) {
              return customer.email && customer.firstName && customer.lastName;
            }
            return true;
            
          case 2: // Shipping
            return shippingAddress && shippingAddress.address1 && 
                   shippingAddress.city && shippingAddress.zipCode;
                   
          case 3: // Payment
            return shippingMethod && paymentMethod;
            
          case 4: // Review
            return true;
            
          default:
            return false;
        }
      },

      canProceedToNext: () => {
        const { currentStep } = get();
        return get().validateStep(currentStep);
      },

      // Order processing
      processOrder: async (orderData) => {
        set({ isProcessing: true, error: null });
        
        try {
          // Simulate order processing
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const order = {
            id: `ORDER-${Date.now()}`,
            status: 'confirmed',
            ...orderData,
            createdAt: new Date().toISOString()
          };
          
          set({ isProcessing: false });
          return order;
        } catch (error) {
          set({ 
            error: 'Failed to process order. Please try again.',
            isProcessing: false 
          });
          throw error;
        }
      },

      // Set processing state
      setProcessing: (processing) => set({ isProcessing: processing }),

      // Reset checkout
      resetCheckout: () => {
        set({
          currentStep: 1,
          isProcessing: false,
          error: null,
          customer: {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            isGuest: true
          },
          shippingAddress: null,
          billingAddress: null,
          sameAsShipping: true,
          shippingMethod: null,
          shippingOptions: [],
          paymentMethod: null,
          paymentOptions: [],
          orderSummary: null,
          steps: [
            { id: 'information', name: 'Information', status: 'current' },
            { id: 'shipping', name: 'Shipping', status: 'upcoming' },
            { id: 'payment', name: 'Payment', status: 'upcoming' },
            { id: 'review', name: 'Review', status: 'upcoming' }
          ]
        });
      },

      // Error handling
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Get checkout summary for final review
      getCheckoutSummary: () => {
        const state = get();
        return {
          customer: state.customer,
          shippingAddress: state.shippingAddress,
          billingAddress: state.billingAddress,
          shippingMethod: state.shippingMethod,
          paymentMethod: state.paymentMethod,
          orderSummary: state.orderSummary,
          total: state.orderSummary?.total || 0
        };
      }
    }),
    {
      name: 'unified-checkout-storage',
      partialize: (state) => ({
        // Persist customer info and addresses for better UX
        customer: state.customer,
        shippingAddress: state.shippingAddress,
        billingAddress: state.billingAddress,
        sameAsShipping: state.sameAsShipping
      })
    }
  )
);