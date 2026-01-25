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
import {
  SUPPORTED_PAYMENT_METHODS,
  CREDIT_CARD_TYPES,
  SUPPORTED_CURRENCIES,
  DEFAULT_CURRENCY,
  SUCCESS_MESSAGES,
  ERROR_CODES,
} from "@/lib/constants";

// SAMPLE DATA - Remove in production
const MOCK_PAYMENT_METHODS = [
  {
    id: "pm-001",
    type: "card",
    brand: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
];

const MOCK_PAYMENT_HISTORY = [
  {
    id: "pay-001",
    amount: 323.98,
    currency: "USD",
    status: "succeeded",
    createdAt: "2024-01-15T10:30:00Z",
    orderId: "order-001",
  },
];

/**
 * Payment service for handling payment-related API calls
 */
export const paymentService = {
  /**
   * Processes a payment
   * @param {Object} paymentData - Payment data
   * @param {string} paymentData.amount - Amount to charge
   * @param {string} paymentData.currency - Currency code
   * @param {Object} paymentData.paymentMethod - Payment method details
   * @param {Object} [paymentData.metadata] - Additional metadata
   * @returns {Promise<Object>} Payment result
   */
  processPayment: async (paymentData) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");

    // Validate payment data
    if (!paymentData.amount || !paymentData.currency) {
      throw createNormalizedError(400, "Amount and currency required");
    }

    const amount = parseFloat(paymentData.amount);
    if (amount <= 0 || amount > 999999) {
      throw createNormalizedError(400, "Invalid payment amount");
    }

    // Sanitize payment data
    const sanitizedPayment = {
      amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
      currency: SUPPORTED_CURRENCIES.includes(paymentData.currency)
        ? paymentData.currency
        : DEFAULT_CURRENCY,
      paymentMethodId: validateId(paymentData.paymentMethodId)
        ? paymentData.paymentMethodId
        : undefined,
      description: paymentData.description
        ? sanitizeInput(paymentData.description).substring(0, 200)
        : undefined,
    };

    return retryWithBackoff(async () => {
      const response = await fetch(
        API_ENDPOINTS.CHECKOUT.PAYMENT_INTENT,
        createSecureFetchOptions({
          method: "POST",
          body: JSON.stringify(sanitizedPayment),
        })
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }
      return response.json();
    });
  },

  /**
   * Creates a payment intent
   * @param {Object} intentData - Intent data
   * @param {number} intentData.amount - Amount to charge
   * @param {string} intentData.currency - Currency code
   * @param {string} [intentData.description] - Description
   * @returns {Promise<Object>} Payment intent
   */
  createPaymentIntent: async (intentData) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");
    if (!intentData.amount || !intentData.currency) {
      throw createNormalizedError(400, "Amount and currency required");
    }

    // Sanitize intent data to prevent code injection
    const sanitizedIntent = {
      amount: Math.round(parseFloat(intentData.amount) * 100) / 100,
      currency: SUPPORTED_CURRENCIES.includes(intentData.currency)
        ? intentData.currency
        : DEFAULT_CURRENCY,
      description: intentData.description
        ? sanitizeInput(intentData.description).substring(0, 200)
        : undefined,
    };

    return retryWithBackoff(async () => {
      const response = await fetch(
        API_ENDPOINTS.CHECKOUT.PAYMENT_INTENT,
        createSecureFetchOptions({
          method: "POST",
          body: JSON.stringify(sanitizedIntent),
        })
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }
      return response.json();
    });
  },

  /**
   * Gets payment methods for the current user
   * @returns {Promise<Array>} Payment methods
   */
  getPaymentMethods: async () => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    // SAMPLE DATA - Use mock data for testing
    if (process.env.NODE_ENV === "development") {
      return MOCK_PAYMENT_METHODS;
    }

    return retryWithBackoff(async () => {
      const response = await fetch(API_ENDPOINTS.USERS.PAYMENT_METHODS, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken(),
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    });
  },

  /**
   * Adds a new payment method
   * @param {Object} paymentMethodData - Payment method data
   * @returns {Promise<Object>} Added payment method
   */
  addPaymentMethod: async (paymentMethodData) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    return retryWithBackoff(async () => {
      const response = await fetch(
        API_ENDPOINTS.USERS.PAYMENT_METHODS,
        createSecureFetchOptions({
          method: "POST",
          body: JSON.stringify(paymentMethodData),
        })
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }
      return response.json();
    });
  },

  /**
   * Sets a payment method as default
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<Object>} Updated payment method
   */
  setDefaultPaymentMethod: async (paymentMethodId) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");
    if (!validateId(paymentMethodId))
      throw createNormalizedError(400, "Invalid payment method ID");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    const endpoint = API_ENDPOINTS.USERS.PAYMENT_METHOD(
      sanitizeInput(paymentMethodId)
    );
    if (!validateUrl(endpoint))
      throw createNormalizedError(400, "Invalid endpoint URL");

    return retryWithBackoff(async () => {
      const response = await fetch(
        endpoint,
        createSecureFetchOptions({
          method: "PUT",
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

  /**
   * Removes a payment method
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<void>}
   */
  removePaymentMethod: async (paymentMethodId) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");
    if (!validateId(paymentMethodId))
      throw createNormalizedError(400, "Invalid payment method ID");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    const endpoint = API_ENDPOINTS.USERS.PAYMENT_METHOD(
      sanitizeInput(paymentMethodId)
    );
    if (!validateUrl(endpoint))
      throw createNormalizedError(400, "Invalid endpoint URL");

    return retryWithBackoff(async () => {
      const response = await fetch(
        endpoint,
        createSecureFetchOptions({
          method: "DELETE",
        })
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }
      return response.json();
    });
  },

  /**
   * Gets payment history for the user
   * @param {Object} [params] - Query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Items per page
   * @returns {Promise<Object>} Payment history with pagination info
   */
  getPaymentHistory: async (params = {}) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    // Validate base URL to prevent SSRF
    if (!validateUrl(baseUrl))
      throw createNormalizedError(400, "Invalid API URL");

    const url = new URL("/api/payments/history", baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value && typeof key === "string" && key.length < 50) {
        const sanitizedValue = sanitizeInput(String(value)).substring(0, 100);
        url.searchParams.append(key, sanitizedValue);
      }
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

  /**
   * Gets payment status for a specific payment
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Payment status
   */
  getPaymentStatus: async (paymentId) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");
    if (!validateId(paymentId))
      throw createNormalizedError(400, "Invalid payment ID");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    // Validate base URL to prevent SSRF
    if (!validateUrl(baseUrl))
      throw createNormalizedError(400, "Invalid API URL");

    const url = `${baseUrl}/api/payments/${encodeURIComponent(
      paymentId
    )}/status`;
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

  /**
   * Refunds a payment
   * @param {string} paymentId - Payment ID
   * @param {Object} [refundData] - Refund data
   * @param {number} [refundData.amount] - Amount to refund
   * @param {string} [refundData.reason] - Reason for refund
   * @returns {Promise<Object>} Refund details
   */
  refundPayment: async (paymentId, refundData = {}) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");
    if (!validateId(paymentId))
      throw createNormalizedError(400, "Invalid payment ID");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    // Validate base URL to prevent SSRF
    if (!validateUrl(baseUrl))
      throw createNormalizedError(400, "Invalid API URL");

    const url = `${baseUrl}/api/payments/${encodeURIComponent(
      paymentId
    )}/refund`;
    if (!validateUrl(url)) throw createNormalizedError(400, "Invalid URL");

    return retryWithBackoff(async () => {
      const response = await fetch(
        url,
        createSecureFetchOptions({
          method: "POST",
          body: JSON.stringify(refundData),
        })
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }
      return response.json();
    });
  },
};
