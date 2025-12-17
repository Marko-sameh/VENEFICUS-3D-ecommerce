/**
 * Enhanced API client for VENEFICUS with CORS proxy fallback
 */

import { getAuthToken } from "./storage";
import {
  getCsrfToken,
  retryWithBackoff,
  sanitizeUrl,
  createNormalizedError,
} from "./security";
import config from "./config";

const createAbortController = (timeoutMs = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
};

const cleanupAbortController = (timeoutId) => {
  if (timeoutId) clearTimeout(timeoutId);
};

const API_BASE_URL = config.api.baseUrl;
const CORS_PROXY = "https://corsproxy.io/?url=";

const withCorsProxy = (url) => {
  return CORS_PROXY + encodeURIComponent(url);
};

const createFetchOptions = (options = {}) => {
  const token = getAuthToken();
  const apiCode = process.env.NEXT_PUBLIC_API_CODE || "";

  if (!apiCode) {
    console.warn(
      "API_CODE not configured. Set NEXT_PUBLIC_API_CODE environment variable."
    );
  }

  return {
    headers: {
      "Content-Type": "application/json",
      ...(apiCode && { "Api-Code": apiCode }),
      "X-CSRF-Token": getCsrfToken(),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
};

const fetchWithCorsProxy = async (url, fetchOptions) => {
  try {
    const response = await fetch(url, fetchOptions);
    return response;
  } catch (error) {
    if (error.message.includes("CORS") || error.message.includes("Failed to fetch")) {
      const proxyUrl = withCorsProxy(url);
      return fetch(proxyUrl, fetchOptions);
    }
    throw error;
  }
};

export const apiClient = {
  get: async (endpoint, params = {}, options = {}) => {
    const url = new URL(endpoint, API_BASE_URL);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const sanitizedUrl = sanitizeUrl(url.toString());
    if (!sanitizedUrl) throw new Error("Invalid URL");

    const { controller, timeoutId } = createAbortController(10000);

    return retryWithBackoff(async () => {
      try {
        const response = await fetchWithCorsProxy(
          sanitizedUrl,
          createFetchOptions({
            method: "GET",
            signal: controller.signal,
            next: { revalidate: 300 },
            ...options,
          })
        );

        cleanupAbortController(timeoutId);
        if (!response.ok) {
          throw createNormalizedError(response.status, response.statusText);
        }

        return response.json();
      } catch (error) {
        cleanupAbortController(timeoutId);
        if (error.name === "AbortError") {
          throw createNormalizedError(408, "Request timeout");
        }
        throw error;
      }
    });
  },

  post: async (endpoint, data = {}, options = {}) => {
    const url = new URL(endpoint, API_BASE_URL);
    const sanitizedUrl = sanitizeUrl(url.toString());
    if (!sanitizedUrl) throw new Error("Invalid URL");

    const { controller, timeoutId } = createAbortController(10000);
    const isFormData = data instanceof FormData;
    const fetchOptions = createFetchOptions({
      method: "POST",
      signal: controller.signal,
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });

    if (isFormData) {
      delete fetchOptions.headers["Content-Type"];
    }

    return retryWithBackoff(async () => {
      try {
        const response = await fetchWithCorsProxy(sanitizedUrl, fetchOptions);

        cleanupAbortController(timeoutId);
        if (!response.ok) {
          throw createNormalizedError(response.status, response.statusText);
        }

        return response.json();
      } catch (error) {
        cleanupAbortController(timeoutId);
        if (error.name === "AbortError") {
          throw createNormalizedError(408, "Request timeout");
        }
        throw error;
      }
    });
  },

  put: async (endpoint, data = {}, options = {}) => {
    const url = new URL(endpoint, API_BASE_URL);
    const sanitizedUrl = sanitizeUrl(url.toString());
    if (!sanitizedUrl) throw new Error("Invalid URL");

    const { controller, timeoutId } = createAbortController(10000);

    return retryWithBackoff(async () => {
      try {
        const response = await fetchWithCorsProxy(
          sanitizedUrl,
          createFetchOptions({
            method: "PUT",
            signal: controller.signal,
            body: JSON.stringify(data),
            ...options,
          })
        );

        cleanupAbortController(timeoutId);
        if (!response.ok) {
          throw createNormalizedError(response.status, response.statusText);
        }

        return response.json();
      } catch (error) {
        cleanupAbortController(timeoutId);
        if (error.name === "AbortError") {
          throw createNormalizedError(408, "Request timeout");
        }
        throw error;
      }
    });
  },

  patch: async (endpoint, data = {}, options = {}) => {
    const url = new URL(endpoint, API_BASE_URL);
    const sanitizedUrl = sanitizeUrl(url.toString());
    if (!sanitizedUrl) throw new Error("Invalid URL");

    const { controller, timeoutId } = createAbortController(10000);

    return retryWithBackoff(async () => {
      try {
        const response = await fetchWithCorsProxy(
          sanitizedUrl,
          createFetchOptions({
            method: "PATCH",
            signal: controller.signal,
            body: JSON.stringify(data),
            ...options,
          })
        );

        cleanupAbortController(timeoutId);
        if (!response.ok) {
          throw createNormalizedError(response.status, response.statusText);
        }

        return response.json();
      } catch (error) {
        cleanupAbortController(timeoutId);
        if (error.name === "AbortError") {
          throw createNormalizedError(408, "Request timeout");
        }
        throw error;
      }
    });
  },

  delete: async (endpoint, options = {}) => {
    const url = new URL(endpoint, API_BASE_URL);
    const sanitizedUrl = sanitizeUrl(url.toString());
    if (!sanitizedUrl) throw new Error("Invalid URL");

    const { controller, timeoutId } = createAbortController(10000);

    return retryWithBackoff(async () => {
      try {
        const response = await fetchWithCorsProxy(
          sanitizedUrl,
          createFetchOptions({
            method: "DELETE",
            signal: controller.signal,
            ...options,
          })
        );

        cleanupAbortController(timeoutId);
        if (!response.ok) {
          throw createNormalizedError(response.status, response.statusText);
        }

        return response.json();
      } catch (error) {
        cleanupAbortController(timeoutId);
        if (error.name === "AbortError") {
          throw createNormalizedError(408, "Request timeout");
        }
        throw error;
      }
    });
  },

  products: {
    getAll: async () => {
      return apiClient.get("/api/all_product");
    },
  },

  cart: {
    add: async (cartData) => {
      const formData = new FormData();
      formData.append("user_id", cartData.user_id);
      formData.append("product_id", cartData.product_id);
      formData.append("color_id", cartData.color_id);
      formData.append("size_id", cartData.size_id);
      formData.append("quantity", cartData.quantity);
      return apiClient.post("/api/add_cart", formData);
    },
    getAll: async (userId) => {
      const formData = new FormData();
      formData.append("user_id", userId);
      return apiClient.post("/api/all_cart", formData);
    },
    deleteItem: async (itemId) => {
      return apiClient.delete(`/api/delete_cart_item/${itemId}`);
    },
  },

  orders: {
    create: async (orderData) => {
      const formData = new FormData();
      formData.append("user_id", orderData.user_id);
      formData.append("address_id", orderData.address_id);
      formData.append("total_amount", orderData.total_amount);

      return apiClient.post("/api/add_order", formData);
    },
  },
};

export default apiClient;
