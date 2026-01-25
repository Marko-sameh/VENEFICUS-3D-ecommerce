/**
 * Formatting functions for VENEFICUS
 * Contains functions for formatting various data types
 */

import { DEFAULT_CURRENCY, SUPPORTED_CURRENCIES } from "./constants";
import { capitalize, toTitleCase } from "./utils";

/**
 * Format a price with currency symbol
 * @param {number} price - Price to format
 * @param {string} currency - Currency code (e.g., 'USD')
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted price
 */
export const formatPrice = (
  price,
  currency = DEFAULT_CURRENCY,
  locale = "en-US"
) => {
  if (typeof price !== "number") {
    return "";
  }

  // Validate currency code
  if (!SUPPORTED_CURRENCIES.includes(currency)) {
    currency = DEFAULT_CURRENCY;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  } catch (error) {
    
    // Fallback formatting
    return `${currency} ${price.toFixed(2)}`;
  }
};

/**
 * Format a price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @param {string} currency - Currency code
 * @param {string} locale - Locale
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (
  minPrice,
  maxPrice,
  currency = DEFAULT_CURRENCY,
  locale = "en-US"
) => {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice, currency, locale);
  }
  return `${formatPrice(minPrice, currency, locale)} - ${formatPrice(
    maxPrice,
    currency,
    locale
  )}`;
};

/**
 * Format a percentage
 * @param {number} value - Percentage value (0-100)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 0) => {
  if (typeof value !== "number") {
    return "";
  }

  return `${value.toFixed(decimals)}%`;
};

/**
 * Format a product name
 * @param {string} name - Product name
 * @returns {string} Formatted product name
 */
export const formatProductName = (name) => {
  if (!name) return "";

  // Capitalize each word
  return toTitleCase(name.toLowerCase());
};

/**
 * Format a product description
 * @param {string} description - Product description
 * @param {number} maxLength - Maximum length
 * @returns {string} Formatted description
 */
export const formatProductDescription = (description, maxLength = 160) => {
  if (!description) return "";

  // Remove HTML tags
  const plainText = description.replace(/<[^>]*>/g, "");

  // Truncate if necessary
  if (plainText.length > maxLength) {
    return plainText.substring(0, maxLength) + "...";
  }

  return plainText;
};

/**
 * Format a date string to a readable format
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('short', 'medium', 'long')
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = "medium") => {
  if (!date) return "";

  const options = {};

  switch (format) {
    case "short":
      options.year = "numeric";
      options.month = "2-digit";
      options.day = "2-digit";
      break;
    case "medium":
      options.year = "numeric";
      options.month = "short";
      options.day = "numeric";
      break;
    case "long":
      options.year = "numeric";
      options.month = "long";
      options.day = "numeric";
      break;
    default:
      return date.toString();
  }

  return new Date(date).toLocaleDateString("en-US", options);
};

/**
 * Format an order status
 * @param {string} status - Order status
 * @returns {string} Formatted status
 */
export const formatOrderStatus = (status) => {
  if (!status) return "";

  const statusMap = {
    pending: "Processing",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
    failed: "Failed",
  };

  return statusMap[status.toLowerCase()] || capitalize(status);
};

/**
 * Format a shipping method
 * @param {string} method - Shipping method code
 * @returns {string} Formatted shipping method
 */
export const formatShippingMethod = (method) => {
  if (!method) return "";

  const methodMap = {
    standard: "Standard Shipping",
    express: "Express Shipping",
    overnight: "Overnight Shipping",
    pickup: "Store Pickup",
  };

  return (
    methodMap[method.toLowerCase()] || toTitleCase(method.replace(/_/g, " "))
  );
};

/**
 * Format a payment method
 * @param {string} method - Payment method code
 * @returns {string} Formatted payment method
 */
export const formatPaymentMethod = (method) => {
  if (!method) return "";

  const methodMap = {
    credit_card: "Credit Card",
    paypal: "PayPal",
    apple_pay: "Apple Pay",
    google_pay: "Google Pay",
    bank_transfer: "Bank Transfer",
  };

  return (
    methodMap[method.toLowerCase()] || toTitleCase(method.replace(/_/g, " "))
  );
};

/**
 * Format a product variant option
 * @param {string} option - Option name
 * @param {string} value - Option value
 * @returns {string} Formatted variant
 */
export const formatVariant = (option, value) => {
  if (!option || !value) return "";

  const optionMap = {
    size: "Size",
    color: "Color",
    material: "Material",
  };

  const formattedOption = optionMap[option.toLowerCase()] || capitalize(option);
  return `${formattedOption}: ${capitalize(value)}`;
};

/**
 * Format a review rating
 * @param {number} rating - Rating value (0-5)
 * @param {number} maxRating - Maximum rating (default: 5)
 * @returns {string} Formatted rating
 */
export const formatRating = (rating, maxRating = 5) => {
  if (typeof rating !== "number") {
    return "0.0";
  }

  return rating.toFixed(1);
};

/**
 * Format a review count
 * @param {number} count - Review count
 * @returns {string} Formatted review count
 */
export const formatReviewCount = (count) => {
  if (typeof count !== "number" || count < 0) {
    return "0 reviews";
  }

  if (count === 1) {
    return "1 review";
  }

  return `${count} reviews`;
};

/**
 * Format a product availability
 * @param {number} stock - Stock quantity
 * @returns {string} Formatted availability
 */
export const formatAvailability = (stock) => {
  if (typeof stock !== "number") {
    return "Unknown";
  }

  if (stock <= 0) {
    return "Out of stock";
  }

  if (stock < 5) {
    return "Low stock";
  }

  return "In stock";
};

/**
 * Format a discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} salePrice - Sale price
 * @returns {string} Formatted discount percentage
 */
export const formatDiscountPercentage = (originalPrice, salePrice) => {
  if (
    typeof originalPrice !== "number" ||
    typeof salePrice !== "number" ||
    originalPrice <= 0 ||
    salePrice >= originalPrice
  ) {
    return "";
  }

  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return `-${Math.round(discount)}%`;
};

/**
 * Format a product tag
 * @param {string} tag - Product tag
 * @returns {string} Formatted tag
 */
export const formatProductTag = (tag) => {
  if (!tag) return "";

  const tagMap = {
    new: "New",
    sale: "Sale",
    featured: "Featured",
    bestseller: "Best Seller",
    limited_edition: "Limited Edition",
  };

  return tagMap[tag.toLowerCase()] || capitalize(tag);
};

/**
 * Format an address object to a readable string
 * @param {Object} address - Address object with address fields
 * @returns {string} Formatted address string
 */
export function formatAddress(address) {
  if (!address) return "";

  const parts = [];

  // Add name if available
  if (address.firstName || address.lastName) {
    parts.push(`${address.firstName || ""} ${address.lastName || ""}`.trim());
  }

  // Add company if available
  if (address.company) {
    parts.push(address.company);
  }

  // Add address lines
  if (address.address1) parts.push(address.address1);
  if (address.address2) parts.push(address.address2);

  // Add city, state, and zip
  const cityStateZip = [];
  if (address.city) cityStateZip.push(address.city);
  if (address.state) cityStateZip.push(address.state);
  if (address.postalCode) cityStateZip.push(address.postalCode);

  if (cityStateZip.length > 0) {
    parts.push(cityStateZip.join(", "));
  }

  // Add country
  if (address.country) {
    parts.push(address.country);
  }

  // Add phone
  if (address.phone) {
    parts.push(address.phone);
  }

  return parts.filter((part) => part && part.trim() !== "").join("\n");
}
