/**
 * Debounce utility for API calls
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Debounce with promise support
 */
export const debounceAsync = (func, wait) => {
  let timeout;
  let lastPromise;
  
  return function executedFunction(...args) {
    return new Promise((resolve, reject) => {
      const later = async () => {
        try {
          const result = await func(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    });
  };
};
