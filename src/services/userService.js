import { apiClient } from "@/lib/api-client";
import {
  getAuthToken,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from "@/lib/storage";
import {
  USER_DATA_KEY,
  EMAIL_REGEX,
  SUCCESS_MESSAGES,
  ERROR_CODES,
  US_STATES,
} from "@/lib/constants";
import {
  getCsrfToken,
  retryWithBackoff,
  validateId,
  validateEmail,
  sanitizeInput,
  createSecureFetchOptions,
  createNormalizedError,
  validateUrl,
} from "@/lib/security";

/**
 * User service for handling user-related API calls
 */
export const userService = {
  /**
   * Gets the current user's profile
   * @returns {Promise<Object>} User profile data
   */
  getUserProfile: async () => {
    try {
      // First check if we have real user data from Google login
      const savedUserData = localStorage.getItem("veneficus_user_data");
      if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        setLocalStorage(USER_DATA_KEY, userData);
        return userData;
      }

      // Try to fetch from API
      const response = await apiClient.get("/api/user/profile");
      const userData = {
        id: response.id || response.user_id,
        name: response.name || response.full_name,
        email: response.email,
        phone: response.phone,
        avatar: response.avatar || response.profile_picture || null,
        role: response.role || "customer",
        createdAt: response.created_at || response.createdAt,
        updatedAt: response.updated_at || response.updatedAt,
      };
      setLocalStorage(USER_DATA_KEY, userData);
      return userData;
    } catch (error) {
      
      throw new Error("Failed to load user profile");
    }
  },

  /**
   * Updates the user's profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (profileData) => {
    // Validate and sanitize profile data
    const sanitizedData = {};
    if (profileData.name) {
      sanitizedData.name = sanitizeInput(profileData.name).substring(0, 100);
    }
    if (profileData.email) {
      if (!validateEmail(profileData.email)) {
        throw createNormalizedError(400, "Invalid email format");
      }
      sanitizedData.email = profileData.email.toLowerCase();
    }
    if (profileData.phone) {
      sanitizedData.phone = sanitizeInput(profileData.phone).replace(
        /[^0-9+\-\s()]/g,
        ""
      );
    }

    try {
      const formData = new FormData();
      Object.entries(sanitizedData).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value);
      });

      const response = await apiClient.post("/api/user/update", formData);
      const userData = {
        id: response.id || response.user_id || "user-1",
        name: response.name || response.full_name,
        email: response.email,
        phone: response.phone,
        avatar: response.avatar || response.profile_picture,
        role: response.role || "customer",
      };
      setLocalStorage(USER_DATA_KEY, userData);
      return userData;
    } catch (error) {
      
      throw createNormalizedError(500, "Failed to update profile");
    }
  },

  /**
   * Gets the user's saved addresses
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User addresses
   */
  getUserAddresses: async (userId) => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    try {
      const response = await apiClient.get("/api/all_address");
      return response.data || response.addresses || response || [];
    } catch (error) {
      
      return [];
    }
  },

  /**
   * Adds a new address
   * @param {Object} addressData - Address data
   * @returns {Promise<Object>} Added address
   */
  addAddress: async (addressData) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");

    // Validate required fields
    if (!addressData.street || !addressData.city) {
      throw createNormalizedError(400, "Street and city are required");
    }

    // Sanitize address data
    const sanitizedAddress = {
      street: sanitizeInput(addressData.street).substring(0, 200),
      city: sanitizeInput(addressData.city).substring(0, 100),
      state: addressData.state
        ? sanitizeInput(addressData.state).substring(0, 50)
        : undefined,
      zipCode: addressData.zipCode
        ? sanitizeInput(addressData.zipCode).replace(/[^0-9A-Za-z\s-]/g, "")
        : undefined,
      country: addressData.country
        ? sanitizeInput(addressData.country).substring(0, 50)
        : "US",
      type: ["shipping", "billing"].includes(addressData.type)
        ? addressData.type
        : "shipping",
    };

    return retryWithBackoff(async () => {
      const response = await fetch(
        API_ENDPOINTS.USERS.ADDRESSES,
        createSecureFetchOptions({
          method: "POST",
          body: JSON.stringify(sanitizedAddress),
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
   * Updates an address
   * @param {string} addressId - Address ID
   * @param {Object} addressData - Updated address data
   * @returns {Promise<Object>} Updated address
   */
  updateAddress: async (addressId, addressData) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");
    if (!validateId(addressId))
      throw createNormalizedError(400, "Invalid address ID");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    const endpoint = API_ENDPOINTS.USERS.ADDRESS(addressId);

    return retryWithBackoff(async () => {
      const response = await fetch(
        endpoint,
        createSecureFetchOptions({
          method: "PUT",
          body: JSON.stringify(addressData),
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
   * Deletes an address
   * @param {string} addressId - Address ID
   * @returns {Promise<void>}
   */
  deleteAddress: async (addressId) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");
    if (!validateId(addressId))
      throw createNormalizedError(400, "Invalid address ID");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    const endpoint = API_ENDPOINTS.USERS.ADDRESS(addressId);

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
   * Gets the user's payment methods
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Payment methods
   */
  getUserPaymentMethods: async (userId) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    return retryWithBackoff(async () => {
      const response = await fetch(
        API_ENDPOINTS.USERS.PAYMENT_METHODS,
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

    const endpoint = API_ENDPOINTS.USERS.PAYMENT_METHOD(paymentMethodId);

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

    const endpoint = API_ENDPOINTS.USERS.PAYMENT_METHOD(paymentMethodId);

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
   * Updates user notification preferences
   * @param {Object} preferences - Notification preferences
   * @returns {Promise<Object>} Updated preferences
   */
  updateNotificationPreferences: async (preferences) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    const url = `${baseUrl}/api/users/notification-preferences`;
    if (!validateUrl(url)) throw createNormalizedError(400, "Invalid URL");

    return retryWithBackoff(async () => {
      const response = await fetch(
        url,
        createSecureFetchOptions({
          method: "PUT",
          body: JSON.stringify(preferences),
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
   * Updates user account settings
   * @param {Object} settings - Account settings
   * @returns {Promise<Object>} Updated settings
   */
  updateAccountSettings: async (settings) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    const url = `${baseUrl}/api/users/account-settings`;
    if (!validateUrl(url)) throw createNormalizedError(400, "Invalid URL");

    return retryWithBackoff(async () => {
      const response = await fetch(
        url,
        createSecureFetchOptions({
          method: "PUT",
          body: JSON.stringify(settings),
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
   * Changes user password
   * @param {Object} passwordData - Password data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<void>}
   */
  changePassword: async (passwordData) => {
    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      throw createNormalizedError(400, "Current and new password required");
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    return retryWithBackoff(async () => {
      const response = await fetch(
        API_ENDPOINTS.USERS.CHANGE_PASSWORD,
        createSecureFetchOptions({
          method: "PUT",
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        })
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }
      return response.json();
    });
  },

  // Merged from addressService
  setDefaultAddress: async (addressId) => {
    if (!validateId(addressId))
      throw createNormalizedError(400, "Invalid address ID");

    const token = getAuthToken();
    if (!token) throw createNormalizedError(401, "Authentication required");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw createNormalizedError(500, "API URL not configured");

    return retryWithBackoff(async () => {
      const response = await fetch(
        API_ENDPOINTS.USERS.ADDRESS(addressId),
        createSecureFetchOptions({
          method: "PUT",
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
   * Gets user orders
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User orders
   */
  getUserOrders: async (user) => {
    const token = user.token;
    
    if (!token) throw createNormalizedError(401, "Authentication required");

    try {
      const response = await apiClient.get("/api/user/orders");
      return response.data || response.orders || response || [];
    } catch (error) {
      
      return [];
    }
  },
};
