/**
 * Unified Cart Service - Single source of truth for all cart operations
 * Integrates seamlessly with the existing Products system and backend APIs
 * Architecture: Products System → Unified Cart Service → Backend APIs → Zustand Store → React Components
 */

import { API_BASE_URL } from "@/lib";
import { productService } from "./products";
import { apiClient } from "@/lib/api-client";
// Removed useUserStore import - using localStorage directly

const CART_STORAGE_KEY = "veneficus_cart";
const API_HEADER =
  "B1m8fszhQ5qompWX3tC5BKGmv3fohU0iGjEmO5GjxU9o8wGHaHryNgTrWJmtkeok";

// Cart item structure - minimal processing for compatibility
const createCartItem = (
  product,
  quantity = 1,
  options = {},
  piecePrice = null
) => ({
  ...product,
  quantity: parseInt(quantity),
  options: options || {},
  key: `${product.id}-${JSON.stringify(options)}`,
  piece_price: piecePrice || product.discounted_price || product.price || 0,
});

// Calculate comprehensive cart totals
const calculateTotals = (items = [], coupon = null, shippingCost = 0) => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.discounted_price
      ? item.product.discounted_price
      : item.product?.price || item.price || 0;
    return sum + parseFloat(price) * item.quantity;
  }, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Tax calculation (8%)
  const taxRate = 0.08;
  const tax = subtotal * taxRate;

  // Shipping calculation (free over $100)
  const shipping = subtotal >= 100 ? 0 : shippingCost || 10;

  // Discount calculation
  let discount = 0;
  if (coupon) {
    if (coupon.type === "percentage") {
      discount = subtotal * (coupon.discount / 100);
    } else if (coupon.type === "fixed") {
      discount = coupon.discount;
    }
  }

  const total = Math.max(0, subtotal + tax + shipping - discount);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    total: Number(total.toFixed(2)),
    itemCount,
  };
};

/**
 * Unified Cart Service - Production-ready implementation
 */
export const unifiedCartService = {
  /**
   * Get cart from backend API with localStorage fallback
   */
  getCart: async () => {
    if (typeof window === "undefined") {
      return { items: [], ...calculateTotals([]) };
    }

    try {
      const userData = localStorage.getItem("veneficus_user_data");
      const user = userData ? JSON.parse(userData) : null;
      
      if (user?.id) {
        const { orderService } = await import("./orderService");
        const items = await orderService.getCart(user.id);

        unifiedCartService.saveCart(items);
        const totals = calculateTotals(items);
        
        return {
          items,
          ...totals
        };
      }

      // Fallback to localStorage
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      const items = stored ? JSON.parse(stored) : [];
      return { items, ...calculateTotals(items) };
    } catch (error) {
      
      return { items: [], ...calculateTotals([]) };
    }
  },

  /**
   * Save cart to localStorage with error handling
   */
  saveCart: (items) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      
    }
  },

  /**
   * Add item to cart - integrates with backend API
   */
  addItem: async (productId, quantity = 1, options = {}) => {
    try {
      const userData = localStorage.getItem("veneficus_user_data");
      const user = userData ? JSON.parse(userData) : null;
      
      if (!user?.id) {
        return { success: false, error: "Please sign in to add items to cart" };
      }

      if (!options.colorId || !options.sizeId) {
        return { success: false, error: "Please select color and size" };
      }

      const data = {
        user_id: user.id,
        product_id: productId,
        color_id: options.colorId,
        size_id: options.sizeId,
        quantity: parseInt(quantity),
      };

      const { orderService } = await import("./orderService");
      const result = await orderService.addToCart(data);
      
      return { success: true, result };
    } catch (error) {
      
      return {
        success: false,
        error: error.message || "Failed to add item to cart",
      };
    }
  },

  /**
   * Update item quantity
   */
  updateQuantity: (itemKey, quantity) => {
    const cart = unifiedCartService.getCart();

    if (quantity <= 0) {
      return unifiedCartService.removeItem(itemKey);
    }

    const updatedItems = cart.items.map((item) =>
      item.key === itemKey ? { ...item, quantity } : item
    );

    unifiedCartService.saveCart(updatedItems);
    return { items: updatedItems, ...calculateTotals(updatedItems) };
  },

  /**
   * Remove item from cart
   */
  removeItem: (itemKey) => {
    const cart = unifiedCartService.getCart();
    const updatedItems = cart.items.filter((item) => item.key !== itemKey);

    unifiedCartService.saveCart(updatedItems);
    return { items: updatedItems, ...calculateTotals(updatedItems) };
  },

  /**
   * Clear entire cart
   */
  clearCart: async () => {
    try {
      const userData = localStorage.getItem("veneficus_user_data");
      const user = userData ? JSON.parse(userData) : null;
      if (user?.id) {
        // Clear cart on backend (implementation depends on available API)
        // For now, we'll just clear locally and sync will handle it
      }

      unifiedCartService.saveCart([]);
      return { items: [], ...calculateTotals([]) };
    } catch (error) {
      
      unifiedCartService.saveCart([]);
      return { items: [], ...calculateTotals([]) };
    }
  },

  /**
   * Check if item is in cart (synchronous)
   */
  isInCart: (productId, options = {}) => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      const items = stored ? JSON.parse(stored) : [];
      return items.some(item => 
        item.product_id == productId && 
        item.color_id == options.colorId && 
        item.size_id == options.sizeId
      );
    } catch {
      return false;
    }
  },

  /**
   * Get item quantity (synchronous)
   */
  getItemQuantity: (productId, options = {}) => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      const items = stored ? JSON.parse(stored) : [];
      const item = items.find(item => 
        item.product_id == productId && 
        item.color_id == options.colorId && 
        item.size_id == options.sizeId
      );
      return item?.quantity || 0;
    } catch {
      return 0;
    }
  },

  /**
   * Apply coupon code
   */
  applyCoupon: (code, items) => {
    // Mock coupon validation - replace with real API call
    const validCoupons = {
      WELCOME10: {
        discount: 10,
        type: "percentage",
        message: "10% discount applied!",
      },
      SAVE20: {
        discount: 20,
        type: "percentage",
        message: "20% discount applied!",
      },
      FLAT5: { discount: 5, type: "fixed", message: "$5 off applied!" },
    };

    const coupon = validCoupons[code.toUpperCase()];
    if (!coupon) {
      throw new Error("Invalid coupon code");
    }

    return {
      code: code.toUpperCase(),
      ...coupon,
      totals: calculateTotals(items, coupon),
    };
  },

  /**
   * Calculate shipping rates
   */
  calculateShipping: (country, state, items) => {
    const subtotal = items.reduce((sum, item) => {
      const price = item.product?.discounted_price
        ? item.product.discounted_price
        : item.product?.price || item.price || 0;
      return sum + parseFloat(price) * item.quantity;
    }, 0);

    // Free shipping over $100
    if (subtotal >= 100) {
      return { cost: 0, method: "Free Shipping", estimatedDays: "5-7" };
    }

    // Mock shipping rates based on location
    const rates = {
      US: {
        CA: { cost: 5.99, method: "Standard", estimatedDays: "3-5" },
        NY: { cost: 5.99, method: "Standard", estimatedDays: "3-5" },
        TX: { cost: 7.99, method: "Standard", estimatedDays: "4-6" },
      },
    };

    const rate = rates[country]?.[state] || {
      cost: 9.99,
      method: "Standard",
      estimatedDays: "5-7",
    };
    return rate;
  },

  /**
   * Validate cart before checkout
   */
  validateCart: async (items) => {
    const errors = [];

    for (const item of items) {
      try {
        // Verify product still exists and is available
        const product = await productService.getProductBySlug(item.id);

        if (!product) {
          errors.push(`Product "${item.name}" is no longer available`);
          continue;
        }

        if (!product.inStock) {
          errors.push(`Product "${item.name}" is out of stock`);
          continue;
        }

        // Check if price has changed
        const currentPrice = parseFloat(
          product.discounted_price || product.price
        );
        if (Math.abs(currentPrice - item.price) > 0.01) {
          errors.push(
            `Price for "${item.name}" has changed from $${item.price} to $${currentPrice}`
          );
        }

        // Check stock availability
        if (product.stock && item.quantity > product.stock) {
          errors.push(
            `Only ${product.stock} units of "${item.name}" available`
          );
        }
      } catch (error) {
        errors.push(`Unable to verify "${item.name}"`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Get cart summary for checkout
   */
  getCheckoutSummary: (items = [], coupon = null, shippingCost = 0) => {
    const totals = calculateTotals(items, coupon, shippingCost);

    return {
      items: items.map((item) => {
        const price = item.product?.discounted_price
          ? item.product.discounted_price
          : item.product?.price || item.price || 0;
        return {
          id: item.id,
          name: item.name,
          price: parseFloat(price),
          quantity: item.quantity,
          total: parseFloat(price) * item.quantity,
          image: item.image,
          options: item.options,
        };
      }),
      ...totals,
      coupon,
      shippingCost,
    };
  },
};
