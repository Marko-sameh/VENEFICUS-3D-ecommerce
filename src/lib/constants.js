// /**
//  * Application constants for VENEFICUS
//  * Centralized location for all app-wide constants
//  */

// // Authentication constants
// export const AUTH_TOKEN_KEY = "veneficus_auth_token";
// export const REFRESH_TOKEN_KEY = "veneficus_refresh_token";
// export const USER_DATA_KEY = "veneficus_user_data";

// // API constants
// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
// export const API_TIMEOUT = 10000; // 10 seconds

// // Validation constants
// export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// export const PASSWORD_REGEX =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=[\]{}|\\,./?]{8,}$/;

// // Cart constants
// export const CART_UPDATE_DEBOUNCE = 300; // ms
// export const MAX_CART_ITEMS = 50;
// export const MIN_CART_QUANTITY = 1;
// export const MAX_CART_QUANTITY = 99;

// // Product constants
// export const PRODUCTS_PER_PAGE = 12;
// export const RELATED_PRODUCTS_COUNT = 4;
// export const RECENTLY_VIEWED_COUNT = 8;

// // UI constants
// export const TOAST_DURATION = 5000; // ms
// export const MODAL_TRANSITION_DURATION = 300; // ms
// export const SCROLL_TO_TOP_THRESHOLD = 300; // px
// export const MOBILE_BREAKPOINT = 768; // px

// // SEO constants
// export const DEFAULT_META_TITLE = "VENEFICUS - Modern web development toolkit";
// export const DEFAULT_META_DESCRIPTION =
//   "VENEFICUS Website - Modern web development toolkit";
// export const DEFAULT_KEYWORDS = "VENEFICUS, web development, toolkit, modern";
// export const DEFAULT_IMAGE = "/images/og-image.jpg";

// // Payment constants
// export const SUPPORTED_PAYMENT_METHODS = [
//   "credit_card",
//   "paypal",
//   "apple_pay",
//   "google_pay",
// ];
// export const CREDIT_CARD_TYPES = ["visa", "mastercard", "amex", "discover"];
// export const MINIMUM_ORDER_AMOUNT = 10; // USD

// // Internationalization constants
// export const DEFAULT_LOCALE = "en-US";
// export const SUPPORTED_LOCALES = ["en-US", "es-ES", "fr-FR", "de-DE"];
// export const DEFAULT_CURRENCY = "USD";
// export const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP", "CAD"];

// // Analytics constants
// export const ANALYTICS_DEBOUNCE = 500; // ms
// export const PAGE_VIEW_TIMEOUT = 5000; // ms

// // Local storage keys
// export const RECENTLY_VIEWED_KEY = "veneficus_recently_viewed";
// export const WISHLIST_KEY = "veneficus_wishlist";
// export const CART_KEY = "veneficus_cart";
// export const PREFERRED_CURRENCY_KEY = "veneficus_preferred_currency";
// export const PREFERRED_LOCALE_KEY = "veneficus_preferred_locale";

// // Theme constants
// export const THEME_STORAGE_KEY = "veneficus_theme";
// export const DEFAULT_THEME = "light";

// // Cookie constants
// export const COOKIE_CONSENT_KEY = "veneficus_cookie_consent";
// export const COOKIE_EXPIRATION_DAYS = 365;

// // Error codes
// export const ERROR_CODES = {
//   INVALID_CREDENTIALS: "invalid_credentials",
//   ACCOUNT_NOT_VERIFIED: "account_not_verified",
//   PASSWORD_MISMATCH: "password_mismatch",
//   INSUFFICIENT_STOCK: "insufficient_stock",
//   INVALID_COUPON: "invalid_coupon",
//   EXPIRED_COUPON: "expired_coupon",
//   MAX_USES_REACHED: "max_uses_reached",
//   PAYMENT_FAILED: "payment_failed",
//   ORDER_NOT_FOUND: "order_not_found",
// };

// // Success messages
// export const SUCCESS_MESSAGES = {
//   LOGIN_SUCCESS: "Successfully logged in",
//   REGISTER_SUCCESS: "Account created successfully",
//   PASSWORD_RESET: "Password reset instructions sent to your email",
//   PASSWORD_UPDATED: "Password updated successfully",
//   ADDRESS_ADDED: "Address added successfully",
//   ADDRESS_UPDATED: "Address updated successfully",
//   ADDRESS_REMOVED: "Address removed successfully",
//   ITEM_ADDED_TO_CART: "Item added to cart",
//   ITEM_REMOVED_FROM_CART: "Item removed from cart",
//   CART_UPDATED: "Cart updated successfully",
//   ORDER_PLACED: "Order placed successfully",
//   REVIEW_SUBMITTED: "Review submitted successfully",
//   WISHLIST_UPDATED: "Wishlist updated successfully",
// };

/**
 * Application constants for VENEFICUS
 * Centralized location for all app-wide constants
 */

// Authentication constants (Google OAuth only)
export const GOOGLE_OAUTH_SCOPES = "openid email profile";
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
export const USER_DATA_KEY = "veneficus_user_data";
export const AUTH_TOKEN_KEY = "veneficus_auth_token";
export const REFRESH_TOKEN_KEY = "veneficus_refresh_token";

// API constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_TIMEOUT = 10000; // 10 seconds

// Validation constants
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=[\]{}|\\,./?]{8,}$/;

// Cart constants
export const CART_UPDATE_DEBOUNCE = 300; // ms
export const MAX_CART_ITEMS = 50;
export const MIN_CART_QUANTITY = 1;
export const MAX_CART_QUANTITY = 99;

// Product constants
export const PRODUCTS_PER_PAGE = 12;
export const RELATED_PRODUCTS_COUNT = 10;
export const RECENTLY_VIEWED_COUNT = 8;

// UI constants
export const TOAST_DURATION = 5000; // ms
export const MODAL_TRANSITION_DURATION = 300; // ms
export const SCROLL_TO_TOP_THRESHOLD = 300; // px
export const MOBILE_BREAKPOINT = 768; // px

// SEO constants
export const DEFAULT_META_TITLE = "VENEFICUS - Modern web development toolkit";
export const DEFAULT_META_DESCRIPTION =
  "VENEFICUS Website - Modern web development toolkit";
export const DEFAULT_KEYWORDS = "VENEFICUS, web development, toolkit, modern";
export const DEFAULT_IMAGE = "/images/og-image.jpg";

// Payment constants
export const SUPPORTED_PAYMENT_METHODS = [
  "credit_card",
  "paypal",
  "apple_pay",
  "google_pay",
];
export const CREDIT_CARD_TYPES = ["visa", "mastercard", "amex", "discover"];
export const MINIMUM_ORDER_AMOUNT = 10; // USD

// Internationalization constants
export const DEFAULT_LOCALE = "en-US";
export const SUPPORTED_LOCALES = ["en-US", "es-ES", "fr-FR", "de-DE"];
export const DEFAULT_CURRENCY = "USD";
export const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP", "CAD"];

// Analytics constants
export const ANALYTICS_DEBOUNCE = 500; // ms
export const PAGE_VIEW_TIMEOUT = 5000; // ms

// Local storage keys
export const RECENTLY_VIEWED_KEY = "veneficus_recently_viewed";
export const WISHLIST_KEY = "veneficus_wishlist";
export const CART_KEY = "veneficus_cart";
export const PREFERRED_CURRENCY_KEY = "veneficus_preferred_currency";
export const PREFERRED_LOCALE_KEY = "veneficus_preferred_locale";

// Theme constants
export const THEME_STORAGE_KEY = "veneficus_theme";
export const DEFAULT_THEME = "light";

// Cookie constants
export const COOKIE_CONSENT_KEY = "veneficus_cookie_consent";
export const COOKIE_EXPIRATION_DAYS = 365;

// Error codes
export const ERROR_CODES = {
  INVALID_CREDENTIALS: "invalid_credentials",
  ACCOUNT_NOT_VERIFIED: "account_not_verified",
  PASSWORD_MISMATCH: "password_mismatch",
  INSUFFICIENT_STOCK: "insufficient_stock",
  INVALID_COUPON: "invalid_coupon",
  EXPIRED_COUPON: "expired_coupon",
  MAX_USES_REACHED: "max_uses_reached",
  PAYMENT_FAILED: "payment_failed",
  ORDER_NOT_FOUND: "order_not_found",
};

// Success message keys for i18n
export const SUCCESS_MESSAGE_KEYS = {
  LOGIN_SUCCESS: "messages.success.loginSuccess",
  REGISTER_SUCCESS: "messages.success.registerSuccess",
  PASSWORD_RESET: "messages.success.passwordReset",
  PASSWORD_UPDATED: "messages.success.passwordUpdated",
  ADDRESS_ADDED: "messages.success.addressAdded",
  ADDRESS_UPDATED: "messages.success.addressUpdated",
  ADDRESS_REMOVED: "messages.success.addressRemoved",
  ITEM_ADDED_TO_CART: "messages.success.itemAddedToCart",
  ITEM_REMOVED_FROM_CART: "messages.success.itemRemovedFromCart",
  CART_UPDATED: "messages.success.cartUpdated",
  ORDER_PLACED: "messages.success.orderPlaced",
  REVIEW_SUBMITTED: "messages.success.reviewSubmitted",
  WISHLIST_UPDATED: "messages.success.wishlistUpdated",
};

// Error message keys for i18n
export const ERROR_MESSAGE_KEYS = {
  INVALID_CREDENTIALS: "messages.error.invalidCredentials",
  ACCOUNT_NOT_VERIFIED: "messages.error.accountNotVerified",
  PASSWORD_MISMATCH: "messages.error.passwordMismatch",
  INSUFFICIENT_STOCK: "messages.error.insufficientStock",
  INVALID_COUPON: "messages.error.invalidCoupon",
  EXPIRED_COUPON: "messages.error.expiredCoupon",
  MAX_USES_REACHED: "messages.error.maxUsesReached",
  PAYMENT_FAILED: "messages.error.paymentFailed",
  ORDER_NOT_FOUND: "messages.error.orderNotFound",
  NETWORK_ERROR: "messages.error.networkError",
  VALIDATION_ERROR: "messages.error.validationError",
};

// US States for address form
export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];
