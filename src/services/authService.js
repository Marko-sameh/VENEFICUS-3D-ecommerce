import apiClient from "@/lib/api-client";
import {
  getAuthToken,
  saveAuthToken,
  clearAuthToken,
  isAuthenticated,
} from "@/lib/auth";

/**
 * Google OAuth authentication service for VENEFICUS
 * Simplified service using only @react-oauth/google
 */
export const authService = {
  /**
   * Authenticates with Google credential via backend
   * @param {string} credential - Google credential token
   */
  loginWithGoogle: async (credential) => {
    try {
      const data = await apiClient.post('/api/socialite/login', {
        token: credential,
      });

      if (data.token) {
        saveAuthToken(data.token);
      }

      if (data.user) {
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || null,
          avatar: data.user.avatar || null,
          role: data.user.role || 'customer'
        };
        localStorage.setItem('veneficus_user_data', JSON.stringify(userData));
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logs out user
   */
  logout: () => {
    clearAuthToken();
    localStorage.removeItem('veneficus_user_data');
  },

  /**
   * Checks if user is authenticated
   */
  isAuthenticated,

  /**
   * Gets current JWT token
   */
  getToken: getAuthToken,
};
