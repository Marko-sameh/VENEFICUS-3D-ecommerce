import { create } from "zustand";
import { useUserStore } from "./userStore";
import { calculateCartTotals } from "@/lib";

let isFetching = false;

export const useOrdersStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  currentPage: 1,
  isLoading: false,
  error: null,
  orderSummary: {
    shippingCost: 0,
    isShippingCalculated: false,
    discount: 0,
    taxRate: 0.08,
  },

  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  getPaginatedOrders: (limit = 10) => {
    const { orders, currentPage } = get();
    const totalPages = Math.ceil(orders.length / limit);
    const paginatedOrders = orders.slice(
      (currentPage - 1) * limit,
      currentPage * limit
    );
    return { paginatedOrders, totalPages, currentPage };
  },

  getOrderTracking: (order) => {
    if (!order) return { trackingStages: [], progress: 0 };

    const trackingStages = [
      {
        id: "processing",
        label: "Processing",
        date: order.date || order.createdAt,
      },
      { id: "shipped", label: "Shipped", date: order.shippedDate },
      { id: "in-transit", label: "In Transit", date: order.inTransitDate },
      {
        id: "out-for-delivery",
        label: "Out for Delivery",
        date: order.outForDeliveryDate,
      },
      { id: "delivered", label: "Delivered", date: order.deliveryDate },
    ];

    const now = new Date();
    const completedStages = trackingStages.filter((stage) => {
      if (!stage.date) return false;
      try {
        const stageDate = new Date(stage.date);
        return !isNaN(stageDate.getTime()) && stageDate <= now;
      } catch {
        return false;
      }
    }).length;

    const totalStages = trackingStages.length;
    const progress =
      totalStages > 1
        ? Math.min(
            100,
            Math.max(0, (completedStages / (totalStages - 1)) * 100)
          )
        : completedStages > 0
        ? 100
        : 0;

    return { trackingStages, progress, completedStages };
  },

  fetchOrders: async (page = 1, limit = 10) => {
    if (isFetching) return get().orders;
    isFetching = true;
    // set({ isLoading: true, error: null });
    try {
      const userStore = useUserStore.getState();
      if (!userStore.isAuthenticated || !userStore.user?.id) {
        set({ orders: [], isLoading: false, error: "User not authenticated" });
        isFetching = false;
        return [];
      }

      const { orderService } = await import("@/services/orderService");
      const orders = await orderService.getUserOrders(userStore.user.id);

      set({ orders: orders || [], isLoading: false, error: null });
      isFetching = false;
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({
        error: error?.message || "Failed to fetch orders",
        isLoading: false,
        orders: [],
      });
      isFetching = false;
      return [];
    }
  },

  fetchOrderById: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const userStore = useUserStore.getState();
      if (!userStore.isAuthenticated || !userStore.user?.id) {
        throw new Error("User not authenticated");
      }

      const { orderService } = await import("@/services/orderService");
      const order = await orderService.getOrderById(userStore.user.id, orderId);
      set({ currentOrder: order, isLoading: false });
      return order;
    } catch (error) {
      set({
        error: error?.message || "Failed to fetch order",
        isLoading: false,
      });
      throw error;
    }
  },

  updateOrderStatus: (orderId, status) => {
    const orders = get().orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    set({ orders });
  },

  clearOrders: () => set({ orders: [], error: null, currentOrder: null }),

  setOrderSummaryField: (field, value) => {
    const { orderSummary } = get();
    set({ orderSummary: { ...orderSummary, [field]: value } });
  },

  calculateOrderTotals: (items) => {
    const { orderSummary } = get();
    const cartTotals = calculateCartTotals(items);
    const total =
      cartTotals.subtotal +
      orderSummary.shippingCost +
      cartTotals.tax -
      orderSummary.discount;

    return {
      subtotal: cartTotals.subtotal,
      tax: cartTotals.tax,
      total: Number(total.toFixed(2)),
    };
  },

  applyCoupon: (code, subtotal) => {
    const upperCode = code.toUpperCase();

    if (upperCode === "WELCOME10") {
      const discountAmount = subtotal * 0.1;
      set((state) => ({
        orderSummary: { ...state.orderSummary, discount: discountAmount },
      }));
      return {
        success: true,
        discount: discountAmount,
        message: "10% discount has been applied to your order.",
      };
    }

    return { success: false, message: "The coupon code entered is not valid." };
  },

  calculateShipping: (cost) => {
    set((state) => ({
      orderSummary: {
        ...state.orderSummary,
        shippingCost: cost,
        isShippingCalculated: true,
      },
    }));
    return cost;
  },

  resetOrderSummary: () => {
    set((state) => ({
      orderSummary: {
        ...state.orderSummary,
        shippingCost: 0,
        isShippingCalculated: false,
        discount: 0,
      },
    }));
  },

  processPayment: async (paymentData) => {
    set({ isLoading: true, error: null });
    try {
      const { paymentService } = await import("@/services/paymentService");
      const result = await paymentService.processPayment(paymentData);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ error: error?.message || "Payment failed", isLoading: false });
      throw error;
    }
  },

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const userStore = useUserStore.getState();
      if (!userStore.isAuthenticated || !userStore.user?.id) {
        throw new Error("User not authenticated");
      }

      const completeOrderData = {
        ...orderData,
        user_id: userStore.user.id,
      };

      const { orderService } = await import("@/services/orderService");
      const order = await orderService.createOrder(completeOrderData);

      const { orders } = get();
      set({
        orders: [order, ...orders],
        currentOrder: order,
        isLoading: false,
      });

      return order;
    } catch (error) {
      set({
        error: error?.message || "Failed to create order",
        isLoading: false,
      });
      throw error;
    }
  },
}));
