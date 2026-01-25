/**
 * Abort Controller Utilities
 * Manages request timeouts and cleanup to prevent memory leaks
 */

/**
 * Create an AbortController with automatic timeout
 * @param {number} timeoutMs - Timeout in milliseconds (default: 5000)
 * @returns {Object} - { controller, timeoutId }
 */
export const createAbortController = (timeoutMs = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
};

/**
 * Clean up abort controller timeout
 * @param {number} timeoutId - Timeout ID to clear
 */
export const cleanupAbortController = (timeoutId) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
};
