/**
 * VENEFICUS Library Index
 * Centralized exports for all helper functions and utilities
 */

// Core utilities
export * from "./utils";
export * from "./helpers";
export * from "./messages";

// Configuration and constants
export * from "./config";
export * from "./constants";
export * from "./endpoints";

// Data handling
export * from "./formatters";
export * from "./validations";
// export * from "./cache";

// Security and authentication
export * from "./security";
export * from "./storage";

// SEO and structured data
export * from "./seo";
export * from "./tructured-data";

// Internationalization
// Note: Import i18n files directly as needed
// Note: server-translations must be imported directly in server components

// API clients
export { default as apiClient } from "./api-client";

// Sanitization
export * from "./sanitize";

// Server-side utilities
export * from "./server-data";

// Translation utilities
export * from "./apiTranslations";

// Re-export commonly used functions with aliases for convenience
export {
  cn as classNames,
  formatPrice as price,
  formatDate as date,
  generateSlug as slug,
  calculateCartTotals as cartTotals,
  validateProduct as validateProd,
  isValidEmail as validEmail,
  isValidPhone as validPhone,
} from "./helpers";

// Server-only exports (don't include in main index)
// Import these directly: import { getServerTranslations } from '@/lib/server-translations'

// Default configuration object
export const VENEFICUS_CONFIG = {
  version: "1.0.0",
  name: "VENEFICUS",
  description: "Modern e-commerce platform",
  features: {
    i18n: true,
    seo: true,
    security: true,
    caching: true,
    validation: true,
  },
};
