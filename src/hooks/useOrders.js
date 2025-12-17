"use client";

import { useEffect } from 'react';
import { useOrdersStore } from '@/store/ordersStore';
import { orderService } from '@/services/orderService';
import { useAuth } from './useAuth';
import { useCart } from './useCart';
import { useToast } from '@/components/ui/use-toast';

export const useOrders = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { clearCart } = useCart();
  
  const { 
    orders, 
    setOrders, 
    isLoading, 
    error,
    fetchOrders: storeFetchOrders,
    fetchOrderById,
    updateOrderStatus,
    clearError,
    currentOrder,
    setCurrentOrder,
    setLoading,
    setError,
    currentPage,
    setCurrentPage,
    getPaginatedOrders,
    getOrderTracking,
    orderSummary,
    setOrderSummaryField,
    calculateOrderTotals,
    applyCoupon,
    calculateShipping,
    resetOrderSummary,
    processPayment
  } = useOrdersStore();

  useEffect(() => {
    if (isAuthenticated) {
      storeFetchOrders();
    }
  }, [isAuthenticated, storeFetchOrders]);

  const fetchOrders = async () => {
    if (!isAuthenticated) return;
    
    try {
      return await storeFetchOrders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    }
  };

  const fetchOrder = async (orderId) => {
    try {
      const order = await fetchOrderById(orderId);
      setCurrentOrder(order);
      return order;
    } catch (error) {
      toast({
        title: "Order Error",
        description: error.message || "Failed to load order details",
        variant: "destructive",
      });
      return null;
    }
  };

  const useOrder = (orderId) => {
    useEffect(() => {
      if (orderId) {
        fetchOrderById(orderId);
      }
    }, [orderId]); // fetchOrderById is from store and doesn't need to be in deps

    return { order: currentOrder, loading: isLoading, error };
  };

  const createOrder = async (orderData) => {
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to place an order");
    }

    setLoading(true);
    setError(null);
    
    try {
      const order = await orderService.createOrder(orderData);
      clearCart();
      setCurrentOrder(order);
      setOrders([order, ...orders]);
      setLoading(false);
      
      toast({
        title: "Order Placed",
        description: `Your order #${order.id} has been placed successfully.`,
      });
      return order;
    } catch (error) {
      setError(error.message || "Failed to create order");
      setLoading(false);
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const cancelOrder = async (orderId) => {
    if (!isAuthenticated) return;
    
    try {
      await orderService.cancelOrder(orderId);
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      );
      setOrders(updatedOrders);
      
      toast({
        title: "Order Cancelled",
        description: `Order #${orderId} has been cancelled successfully.`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel order. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const trackOrder = async (orderId) => {
    if (!isAuthenticated) return;
    
    try {
      return await orderService.trackOrder(orderId);
    } catch (error) {
      toast({
        title: "Tracking Error",
        description: error.message || "Failed to track order",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleApplyCoupon = (code, subtotal) => {
    const result = applyCoupon(code, subtotal);
    
    toast({
      title: result.success ? "Coupon Applied" : "Invalid Coupon",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
    
    return result.success;
  };

  const handleCalculateShipping = (cost) => {
    const calculatedCost = calculateShipping(cost);
    
    toast({
      title: "Shipping Calculated",
      description: `Shipping cost: ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(calculatedCost)}`,
    });
    
    return calculatedCost;
  };

  const handleProcessPayment = async (paymentData) => {
    try {
      const result = await processPayment(paymentData);
      toast({
        title: "Payment Successful",
        description: "Your order has been placed successfully!"
      });
      return result;
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    orders,
    setOrders,
    currentOrder,
    isLoading,
    error,
    fetchOrders,
    fetchOrder,
    createOrder,
    cancelOrder,
    trackOrder,
    updateOrderStatus,
    clearError,
    hasOrders: orders.length > 0,
    useOrder,
    currentPage,
    setCurrentPage,
    getPaginatedOrders,
    getOrderTracking,
    orderSummary,
    calculateOrderTotals,
    handleApplyCoupon,
    handleCalculateShipping,
    resetOrderSummary,
    handleProcessPayment,
    isProcessingPayment: isLoading
  };
};