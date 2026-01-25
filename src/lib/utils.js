import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility functions for VENEFICUS
 * Pure helper functions with no side effects
 */

/**
 * Combine class names using clsx and tailwind-merge
 * @param {...any} inputs - Class name inputs
 * @returns {string} Combined class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize image path to full URL
 * @param {string} imagePath - Image path to normalize
 * @returns {string|null} Normalized image URL
 */
export function normalizeImagePath(imagePath) {
  if (!imagePath) return null;

  // Remove leading slashes and normalize
  const cleanPath = imagePath.replace(/^\/+/, "");

  // Handle absolute URLs (already complete)
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Build full URL using NEXT_PUBLIC_API_URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export function toTitleCase(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Generate a slug from a string
 * @param {string} str - String to slugify
 * @returns {string} URL-safe slug
 */
export function slugify(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export function truncateText(text, length = 100, suffix = '...') {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + suffix;
}

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
}

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {any} value - Value to check
 * @returns {boolean} True if empty
 */
export function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Format bytes to human readable format
 * @param {number} bytes - Bytes to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted bytes
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
export function generateRandomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Parse query string to object
 * @param {string} queryString - Query string to parse
 * @returns {Object} Parsed query object
 */
export function parseQueryString(queryString) {
  if (!queryString || typeof queryString !== 'string') return {};
  
  const encodeHtml = (str) => {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };
  
  const params = {};
  const pairs = queryString.split('&');
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key) {
      try {
        const decodedKey = decodeURIComponent(key);
        const decodedValue = decodeURIComponent(value || '');
        
        // Validate key contains only safe characters
        if (/^[a-zA-Z0-9_-]+$/.test(decodedKey) && decodedKey.length < 100) {
          params[decodedKey] = encodeHtml(decodedValue.substring(0, 1000));
        }
      } catch (error) {
        // Skip invalid encoded values
      }
    }
  });
  return params;
}

/**
 * Convert object to query string
 * @param {Object} obj - Object to convert
 * @returns {string} Query string
 */
export function objectToQueryString(obj) {
  if (!obj || typeof obj !== 'object') return '';
  
  return Object.keys(obj)
    .filter(key => {
      const value = obj[key];
      return value !== null && value !== undefined && typeof key === 'string';
    })
    .map(key => {
      const safeKey = String(key).replace(/[<>"'&]/g, '').substring(0, 100);
      const safeValue = String(obj[key]).replace(/[<>"'&]/g, '').substring(0, 1000);
      return `${encodeURIComponent(safeKey)}=${encodeURIComponent(safeValue)}`;
    })
    .join('&');
}
