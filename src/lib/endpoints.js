// /**
//  * API endpoints constants for VENEFICUS
//  * Centralized location for all API endpoint definitions
//  */

// import { API_BASE_URL } from "./constants";

// // Authentication endpoints
// export const AUTH_ENDPOINTS = {
//   LOGIN: "/api/auth/login",
//   REGISTER: "/api/auth/register",
//   LOGOUT: "/api/auth/logout",
//   FORGOT_PASSWORD: "/api/auth/forgot-password",
//   RESET_PASSWORD: "/api/auth/reset-password",
//   VERIFY_EMAIL: "/api/auth/verify-email",
//   REFRESH_TOKEN: "/api/auth/refresh",
//   ME: "/api/auth/me",
// };

// // Product endpoints
// export const PRODUCT_ENDPOINTS = {
//   ALL: "/api/products",
//   BY_SLUG: "/api/products/slug/{slug}",
//   BY_CATEGORY: "/api/products/category/{categoryId}",
//   RELATED: "/api/products/{id}/related",
//   SEARCH: "/api/products/search",
//   REVIEWS: "/api/products/{id}/reviews",
// };

// // Category endpoints
// export const CATEGORY_ENDPOINTS = {
//   ALL: "/api/categories",
//   BY_SLUG: "/api/categories/slug/{slug}",
//   CHILDREN: "/api/categories/{id}/children",
// };

// // Cart endpoints
// export const CART_ENDPOINTS = {
//   GET: "/api/cart",
//   ADD_ITEM: "/api/cart/items",
//   UPDATE_ITEM: "/api/cart/items/{itemId}",
//   REMOVE_ITEM: "/api/cart/items/{itemId}",
//   CLEAR: "/api/cart/clear",
//   APPLY_COUPON: "/api/cart/coupon",
// };

// // Checkout endpoints
// export const CHECKOUT_ENDPOINTS = {
//   CREATE_ORDER: "/api/checkout",
//   PAYMENT_INTENT: "/api/checkout/payment-intent",
//   ORDER_CONFIRMATION: "/api/checkout/confirmation/{orderId}",
// };

// // User endpoints
// export const USER_ENDPOINTS = {
//   PROFILE: "/api/user/profile",
//   ORDERS: "/api/user/orders",
//   ORDER_BY_ID: "/api/user/orders/{orderId}",
//   ADDRESSES: "/api/user/addresses",
//   WISHLIST: "/api/user/wishlist",
//   ADD_TO_WISHLIST: "/api/user/wishlist",
//   REMOVE_FROM_WISHLIST: "/api/user/wishlist/{productId}",
// };

// // Search endpoints
// export const SEARCH_ENDPOINTS = {
//   ALL: "/api/search",
//   SUGGESTIONS: "/api/search/suggestions",
// };

// // General utility endpoints
// export const UTILITY_ENDPOINTS = {
//   CITIES_BY_STATE: "/api/utility/cities/{state}",
//   COUNTRIES: "/api/utility/countries",
//   STATES: "/api/utility/states",
//   SETTINGS: "/api/utility/settings",
// };

// /**
//  * Replace path parameters in endpoint URL
//  * @param {string} endpoint - Endpoint template
//  * @param {Object} params - Parameters to replace
//  * @returns {string} Final URL
//  */
// export const buildEndpoint = (endpoint, params = {}) => {
//   return Object.keys(params).reduce((url, key) => {
//     return url.replace(`{${key}}`, params[key]);
//   }, endpoint);
// };

// /**
//  * Get full API URL
//  * @param {string} endpoint - Endpoint path
//  * @returns {string} Full URL
//  */
// export const getApiUrl = (endpoint) => {
//   return `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${endpoint}`;
// };

/**
 * API endpoints constants for VENEFICUS
 * Centralized location for all API endpoint definitions
 * Uses nested structure for easy access (e.g., API_ENDPOINTS.CART.GET)
 */

import { API_BASE_URL } from "./constants";

export const API_ENDPOINTS = {
  // API_BASE_URL
  /**
   * Authentication endpoints
   */
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    VERIFY_EMAIL: "/api/auth/verify-email",
    REFRESH_TOKEN: "/api/auth/refresh",
    ME: "/api/auth/me",
    SESSION: "/api/auth/session",
  },

  /**
   * Product endpoints
   */
  PRODUCT: {
    ALL: "/api/products",
    BY_SLUG: "/api/products/slug/{slug}",
    BY_CATEGORY: "/api/products/category/{categoryId}",
    BY_COLLECTION: "/api/products/collection/{collectionId}",
    FEATURED: "/api/products/featured",
    BEST_SELLING: "/api/products/best-selling",
    NEW_ARRIVALS: "/api/products/new-arrivals",
    RELATED: "/api/products/{id}/related",
    SEARCH: "/api/products/search",
    REVIEWS: "/api/products/{id}/reviews",
  },

  /**
   * Category endpoints
   */
  CATEGORY: {
    ALL: "/api/all_category",
    BY_SLUG: "/api/categories/slug/{slug}",
    CHILDREN: "/api/categories/{id}/children",
  },

  /**
   * Cart endpoints
   */
  CART: {
    GET: "/api/cart",
    ADD_ITEM: "/api/cart/items",
    UPDATE_ITEM: "/api/cart/items/{itemId}",
    REMOVE_ITEM: "/api/cart/items/{itemId}",
    CLEAR: "/api/cart/clear",
    APPLY_COUPON: "/api/cart/coupon",
  },

  /**
   * Checkout endpoints
   */
  CHECKOUT: {
    CREATE_ORDER: "/api/checkout",
    PAYMENT_INTENT: "/api/checkout/payment-intent",
    ORDER_CONFIRMATION: "/api/checkout/confirmation/{orderId}",
  },

  /**
   * User endpoints
   */
  USERS: {
    PROFILE: "/api/users/profile",
    ORDERS: "/api/users/orders",
    ORDER_BY_ID: "/api/users/orders/{orderId}",
    ADDRESSES: "/api/users/addresses",
    ADDRESS: (id) => `/api/users/addresses/${id}`,
    CHANGE_PASSWORD: "/api/users/change-password",
    SET_DEFAULT_SHIPPING: "/api/users/default-shipping",
    SET_DEFAULT_BILLING: "/api/users/default-billing",
    PAYMENT_METHODS: "/api/users/payment-methods",
    PAYMENT_METHOD: (id) => `/api/users/payment-methods/${id}`,
    SET_DEFAULT_PAYMENT: "/api/users/default-payment",
    WISHLIST: "/api/users/wishlist",
    ADD_TO_WISHLIST: "/api/users/wishlist",
    REMOVE_FROM_WISHLIST: "/api/users/wishlist/{productId}",
  },

  /**
   * Search endpoints
   */
  SEARCH: {
    ALL: "/api/search",
    SUGGESTIONS: "/api/search/suggestions",
  },

  /**
   * General utility endpoints
   */
  UTILITY: {
    CITIES_BY_STATE: "/api/utility/cities/{state}",
    COUNTRIES: "/api/utility/countries",
    STATES: "/api/utility/states",
    SETTINGS: "/api/utility/settings",
  },
};

/**
 * Replace path parameters in endpoint URL
 * @param {string} endpoint - Endpoint template
 * @param {Object} params - Parameters to replace
 * @returns {string} Final URL
 */
export const buildEndpoint = (endpoint, params = {}) => {
  return Object.keys(params).reduce((url, key) => {
    return url.replace(`{${key}}`, params[key]);
  }, endpoint);
};

/**
 * Get full API URL
 * @param {string} endpoint - Endpoint path
 * @returns {string} Full URL
 */
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
