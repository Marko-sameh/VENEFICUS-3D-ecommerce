/**
 * Application configuration
 * Centralized environment-based configuration
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
    host: process.env.NEXT_PUBLIC_API_HOST || "localhost",
  },

  // Security Configuration
  security: {
    csrfToken: process.env.CSRF_TOKEN || "",
    allowedHosts: [
      process.env.NEXT_PUBLIC_API_HOST || "localhost",
      "api.veneficus.com",
      "localhost",
    ],
  },

  // Development Configuration
  development: {
    useMockData:
      process.env.NODE_ENV === "development" && !process.env.FORCE_API_CALLS,
    enableDebugLogs: process.env.NODE_ENV === "development",
  },

  // Cache Configuration
  cache: {
    products: 300, // 5 minutes
    categories: 600, // 10 minutes
    user: 300, // 5 minutes
    orders: 120, // 2 minutes
  },

  // Validation Limits
  limits: {
    maxCartItems: 50,
    maxCartQuantity: 99,
    maxCommentLength: 1000,
    maxAddressLength: 200,
    maxNameLength: 100,
  },
};

export const replaceImageUrl = (url) => {
  if (!url) return url;
  const newUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!newUrl) return url;
  return url.replace(/https:\/\/veneficus\.asbackend\.com/g, newUrl);
};

export default config;
