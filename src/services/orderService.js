import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { getAuthToken } from "@/lib/storage";
import {
  getCsrfToken,
  retryWithBackoff,
  validateId,
  sanitizeInput,
  createSecureFetchOptions,
  createNormalizedError,
  validateUrl,
} from "@/lib/security";
import { SUCCESS_MESSAGES, ERROR_CODES } from "@/lib/constants";

export const orderService = {
  getUserOrders: async (userId) => {
    try {
      const data = await apiClient.get(`/api/all_order/${userId}`);
      if (data && Array.isArray(data)) {
        return data.map((order) => {
          const orderItems = order.order_items || order.items || [];
          return {
            ...order,
            items: orderItems.map((item) => ({
              id: item.id,
              product_id: item.product_id,
              quantity: item.quantity || 0,
              price: item.piece_price || item.price || 0,
              total_price: item.total_price || 0,
              size: item.size?.name || item.size_id || 'N/A',
              color: item.color?.hex_code || item.color_id || '#000000',
              image: item.product?.image || null,
              product_name: item.product?.name || 'Product',
            })),
          };
        });
      }
      return data || [];
    } catch (error) {
      console.error("getUserOrders error:", error);
      return [];
    }
  },

  getOrderById: async (userId, orderId) => {
    if (!validateId(orderId)) throw new Error("Invalid order ID");

    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    return retryWithBackoff(async () => {
      const response = await fetch(
        API_ENDPOINTS.USERS.ORDER_BY_ID.replace("{orderId}", orderId),
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": getCsrfToken(),
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    });
  },

  createOrder: async (orderData) => {
    if (!orderData.user_id)
      throw createNormalizedError(400, "User ID required");
    if (!orderData.address_id)
      throw createNormalizedError(400, "Address ID required");
    if (!orderData.total_amount)
      throw createNormalizedError(400, "Total amount required");

    try {
      return await apiClient.orders.create(orderData);
    } catch (error) {
      throw error;
    }
  },

  updateOrder: async (orderId, updates) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");
    if (!validateId(orderId))
      throw createNormalizedError(400, "Invalid order ID");

    const endpoint = API_ENDPOINTS.USERS.ORDER_BY_ID.replace(
      "{orderId}",
      orderId
    );

    return retryWithBackoff(async () => {
      const response = await fetch(
        endpoint,
        createSecureFetchOptions({
          method: "PUT",
          body: JSON.stringify(updates),
        })
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }
      return response.json();
    });
  },

  cancelOrder: async (orderId) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");
    if (!validateId(orderId))
      throw createNormalizedError(400, "Invalid order ID");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    const url = `${baseUrl}/api/orders/${encodeURIComponent(orderId)}/cancel`;
    if (!validateUrl(url)) throw createNormalizedError(400, "Invalid URL");

    return retryWithBackoff(async () => {
      const response = await fetch(
        url,
        createSecureFetchOptions({
          method: "POST",
          body: JSON.stringify({}),
        })
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }
      return response.json();
    });
  },

  getOrderTracking: async (orderId) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");
    if (!validateId(orderId))
      throw createNormalizedError(400, "Invalid order ID");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    const url = `${baseUrl}/api/orders/${encodeURIComponent(orderId)}/tracking`;
    if (!validateUrl(url)) throw createNormalizedError(400, "Invalid URL");

    return retryWithBackoff(async () => {
      const response = await fetch(
        url,
        createSecureFetchOptions({
          method: "GET",
        })
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }
      return response.json();
    });
  },

  getOrderInvoice: async (orderId) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");
    if (!validateId(orderId))
      throw createNormalizedError(400, "Invalid order ID");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    const url = `${baseUrl}/api/orders/${encodeURIComponent(orderId)}/invoice`;
    if (!validateUrl(url)) throw createNormalizedError(400, "Invalid URL");

    return retryWithBackoff(async () => {
      const response = await fetch(
        url,
        createSecureFetchOptions({
          method: "GET",
          headers: { Accept: "application/pdf" },
        })
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }
      return response.blob();
    });
  },

  getRecommendedProducts: async (params = {}) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    const url = new URL("/api/orders/recommendations", baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, sanitizeInput(String(value)));
    });

    if (!validateUrl(url.toString()))
      throw createNormalizedError(400, "Invalid URL");

    return retryWithBackoff(async () => {
      const response = await fetch(
        url.toString(),
        createSecureFetchOptions({
          method: "GET",
        })
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }
      return response.json();
    });
  },

  getCart: async (userId) => {
    const formData = new FormData();
    formData.append("user_id", userId);
    return apiClient.post(`/api/all_cart`, formData);
  },

  addToCart: async (data) => {
    const result = await apiClient.post(`/api/add_cart`, data);
    if (result.error) {
      throw new Error(result.error);
    }
    return result;
  },
};
