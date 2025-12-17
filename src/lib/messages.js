/**
 * Message helper functions for VENEFICUS
 * Handles success and error messages with i18n support
 */

import { ERROR_MESSAGE_KEYS, SUCCESS_MESSAGE_KEYS } from './constants';

/**
 * Create success message object
 * @param {string} type - Success type
 * @param {Object} data - Additional data
 * @param {Function} t - Translation function
 * @returns {Object} Success message object
 */
export const createSuccessMessage = (type, data = {}, t = (key) => key) => {
  const messageKey = SUCCESS_MESSAGE_KEYS[type];
  if (!messageKey) {
    
    return {
      type: 'success',
      message: t('messages.success.generic'),
      data
    };
  }
  
  return {
    type: 'success',
    message: t(messageKey, data),
    data,
    timestamp: new Date().toISOString()
  };
};

/**
 * Create error message object
 * @param {string} type - Error type
 * @param {Object} data - Additional data
 * @param {Function} t - Translation function
 * @returns {Object} Error message object
 */
export const createErrorMessage = (type, data = {}, t = (key) => key) => {
  const messageKey = ERROR_MESSAGE_KEYS[type];
  if (!messageKey) {
    
    return {
      type: 'error',
      message: t('messages.error.generic'),
      data
    };
  }
  
  return {
    type: 'error',
    message: t(messageKey, data),
    data,
    timestamp: new Date().toISOString()
  };
};

/**
 * Format API error for display
 * @param {Error|Object} error - Error object
 * @param {Function} t - Translation function
 * @returns {Object} Formatted error message
 */
export const formatApiError = (error, t = (key) => key) => {
  if (!error) {
    return createErrorMessage('NETWORK_ERROR', {}, t);
  }
  
  // Handle different error formats
  if (error.code && ERROR_MESSAGE_KEYS[error.code]) {
    return createErrorMessage(error.code, error.data || {}, t);
  }
  
  if (error.response?.data?.code) {
    return createErrorMessage(error.response.data.code, error.response.data, t);
  }
  
  if (error.message) {
    return {
      type: 'error',
      message: error.message,
      data: error.data || {},
      timestamp: new Date().toISOString()
    };
  }
  
  return createErrorMessage('NETWORK_ERROR', {}, t);
};

/**
 * Format validation errors
 * @param {Object} errors - Validation errors object
 * @param {Function} t - Translation function
 * @returns {Array} Array of formatted error messages
 */
export const formatValidationErrors = (errors, t = (key) => key) => {
  if (!errors || typeof errors !== 'object') {
    return [];
  }
  
  return Object.entries(errors).map(([field, messages]) => {
    const fieldMessages = Array.isArray(messages) ? messages : [messages];
    return {
      field,
      messages: fieldMessages.map(msg => 
        typeof msg === 'string' ? msg : t(msg.key || 'messages.error.validationError', msg.data)
      )
    };
  });
};

/**
 * Get message severity level
 * @param {string} type - Message type
 * @returns {string} Severity level
 */
export const getMessageSeverity = (type) => {
  const severityMap = {
    'success': 'success',
    'error': 'error',
    'warning': 'warning',
    'info': 'info'
  };
  
  return severityMap[type] || 'info';
};

/**
 * Check if message should auto-dismiss
 * @param {string} type - Message type
 * @returns {boolean} Should auto-dismiss
 */
export const shouldAutoDismiss = (type) => {
  return type === 'success' || type === 'info';
};

/**
 * Get auto-dismiss timeout
 * @param {string} type - Message type
 * @returns {number} Timeout in milliseconds
 */
export const getAutoDismissTimeout = (type) => {
  const timeouts = {
    'success': 5000,
    'info': 5000,
    'warning': 8000,
    'error': 0 // Don't auto-dismiss errors
  };
  
  return timeouts[type] || 5000;
};

// DEMO EXAMPLES - Remove in production
export const DEMO_MESSAGE_EXAMPLES = {
  // Success message example
  demoSuccessMessage: (t) => {
    return createSuccessMessage('LOGIN_SUCCESS', { username: 'john_doe' }, t);
  },
  
  // Error message example
  demoErrorMessage: (t) => {
    return createErrorMessage('INVALID_CREDENTIALS', {}, t);
  },
  
  // API error formatting example
  demoApiError: (t) => {
    const mockError = {
      response: {
        data: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          errors: {
            email: ['Email is required', 'Email format is invalid'],
            password: ['Password is too short']
          }
        }
      }
    };
    return formatApiError(mockError, t);
  },
  
  // Validation errors example
  demoValidationErrors: (t) => {
    const mockErrors = {
      email: ['Email is required'],
      password: ['Password must be at least 8 characters']
    };
    return formatValidationErrors(mockErrors, t);
  }
};