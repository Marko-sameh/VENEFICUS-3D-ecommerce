/**
 * Pure helper functions for VENEFICUS
 * All functions are stateless and have no side effects
 */

import { ERROR_MESSAGE_KEYS, SUCCESS_MESSAGE_KEYS } from './constants';

/**
 * Get message key for error code
 * @param {string} errorCode - Error code
 * @returns {string} i18n message key
 */
export const getErrorMessageKey = (errorCode) => {
  return ERROR_MESSAGE_KEYS[errorCode] || ERROR_MESSAGE_KEYS.NETWORK_ERROR;
};

/**
 * Get message key for success code
 * @param {string} successCode - Success code
 * @returns {string} i18n message key
 */
export const getSuccessMessageKey = (successCode) => {
  return SUCCESS_MESSAGE_KEYS[successCode] || '';
};

/**
 * Calculate cart totals
 * @param {Array} items - Cart items
 * @returns {Object} Cart totals
 */
export const calculateCartTotals = (items = []) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;
  
  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    total: Number(total.toFixed(2)),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
  };
};

/**
 * Calculate discount amount
 * @param {number} originalPrice - Original price
 * @param {number} discountPercent - Discount percentage
 * @returns {Object} Discount calculation
 */
export const calculateDiscount = (originalPrice, discountPercent) => {
  if (!originalPrice || !discountPercent) {
    return { discountAmount: 0, finalPrice: originalPrice || 0 };
  }
  
  const discountAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - discountAmount;
  
  return {
    discountAmount: Number(discountAmount.toFixed(2)),
    finalPrice: Number(finalPrice.toFixed(2))
  };
};

/**
 * Validate product data
 * @param {Object} product - Product object
 * @returns {Object} Validation result
 */
export const validateProduct = (product) => {
  const errors = [];
  
  if (!product) {
    errors.push('Product is required');
    return { isValid: false, errors };
  }
  
  if (!product.name || product.name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters');
  }
  
  if (!product.price || product.price <= 0) {
    errors.push('Product price must be greater than 0');
  }
  
  if (!product.sku || product.sku.trim().length < 3) {
    errors.push('Product SKU must be at least 3 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate breadcrumb items from pathname
 * @param {string} pathname - Current pathname
 * @param {Object} translations - Translation function
 * @returns {Array} Breadcrumb items
 */
export const generateBreadcrumbs = (pathname, t = (key) => key) => {
  if (!pathname || pathname === '/') {
    return [{ label: t('navigation.home'), href: '/' }];
  }
  
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: t('navigation.home'), href: '/' }];
  
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Convert segment to readable label
    let label = segment.charAt(0).toUpperCase() + segment.slice(1);
    label = label.replace(/-/g, ' ');
    
    // Try to get translation
    const translationKey = `navigation.${segment}`;
    const translatedLabel = t(translationKey);
    
    // Use translation if available, otherwise use formatted segment
    breadcrumbs.push({
      label: translatedLabel !== translationKey ? translatedLabel : label,
      href: currentPath
    });
  });
  
  return breadcrumbs;
};

/**
 * Filter products by criteria
 * @param {Array} products - Products array
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered products
 */
export const filterProducts = (products = [], filters = {}) => {
  return products.filter(product => {
    // Price range filter
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    
    // Category filter
    if (filters.category && product.category !== filters.category) return false;
    
    // Size filter
    if (filters.size && !product.sizes?.includes(filters.size)) return false;
    
    // Color filter
    if (filters.color && !product.colors?.includes(filters.color)) return false;
    
    // In stock filter
    if (filters.inStock && product.stock <= 0) return false;
    
    // Search query filter
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchableText = `${product.name} ${product.description}`.toLowerCase();
      if (!searchableText.includes(query)) return false;
    }
    
    return true;
  });
};

/**
 * Sort products by criteria
 * @param {Array} products - Products array
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted products
 */
export const sortProducts = (products = [], sortBy = 'newest') => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'newest':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }
};

/**
 * Calculate pagination info
 * @param {number} totalItems - Total number of items
 * @param {number} currentPage - Current page number
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} Pagination info
 */
export const calculatePagination = (totalItems, currentPage = 1, itemsPerPage = 12) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  return {
    totalItems,
    totalPages,
    currentPage: Math.max(1, Math.min(currentPage, totalPages)),
    itemsPerPage,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages
  };
};

/**
 * Generate SEO-friendly URL slug
 * @param {string} title - Title to convert
 * @returns {string} URL slug
 */
export const generateSlug = (title) => {
  if (!title || typeof title !== 'string') return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Check if user has permission
 * @param {Object} user - User object
 * @param {string} permission - Permission to check
 * @returns {boolean} Has permission
 */
export const hasPermission = (user, permission) => {
  if (!user || !permission) return false;
  
  // Admin has all permissions
  if (user.role === 'admin') return true;
  
  // Check specific permissions
  const permissions = user.permissions || [];
  return permissions.includes(permission);
};

/**
 * Format error for display
 * @param {Error|string} error - Error object or message
 * @param {Function} t - Translation function
 * @returns {string} Formatted error message
 */
export const formatError = (error, t = (key) => key) => {
  if (!error) return t('messages.error.unknown');
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.code) {
    const messageKey = getErrorMessageKey(error.code);
    return t(messageKey);
  }
  
  return error.message || t('messages.error.unknown');
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Check if date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean} Is past date
 */
export const isPastDate = (date) => {
  if (!date) return false;
  const checkDate = new Date(date);
  return checkDate < new Date();
};

/**
 * Get relative time string
 * @param {Date|string} date - Date to format
 * @param {Function} t - Translation function
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date, t = (key) => key) => {
  if (!date) return '';
  
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);
  
  if (diffInSeconds < 60) return t('time.justNow');
  if (diffInSeconds < 3600) return t('time.minutesAgo', { minutes: Math.floor(diffInSeconds / 60) });
  if (diffInSeconds < 86400) return t('time.hoursAgo', { hours: Math.floor(diffInSeconds / 3600) });
  if (diffInSeconds < 2592000) return t('time.daysAgo', { days: Math.floor(diffInSeconds / 86400) });
  
  return targetDate.toLocaleDateString();
};

// DEMO EXAMPLES - Remove in production
export const DEMO_EXAMPLES = {
  // Example cart calculation
  demoCartCalculation: () => {
    const demoItems = [
      { id: 1, name: 'Jeans', price: 89.99, quantity: 2 },
      { id: 2, name: 'T-Shirt', price: 29.99, quantity: 1 }
    ];
    return calculateCartTotals(demoItems);
  },
  
  // Example product filtering
  demoProductFiltering: () => {
    const demoProducts = [
      { id: 1, name: 'Blue Jeans', price: 89.99, category: 'jeans', stock: 10 },
      { id: 2, name: 'Red T-Shirt', price: 29.99, category: 'shirts', stock: 0 }
    ];
    const filters = { minPrice: 50, inStock: true };
    return filterProducts(demoProducts, filters);
  },
  
  // Example breadcrumb generation
  demoBreadcrumbs: () => {
    return generateBreadcrumbs('/products/jeans/slim-fit');
  }
};