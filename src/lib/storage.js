// // // SEO: Cookie utilities with proper SameSite and Secure attributes
// // export function setCookie(name, value, days) {
// //   if (typeof document === "undefined") return;

// //   const expires = new Date();
// //   expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

// //   // SEO: Use SameSite=Lax for cross-page functionality without security risks
// //   const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax${
// //     process.env.NODE_ENV === "production" ? ";Secure" : ""
// //   }`;

// //   document.cookie = cookieString;
// // }

// // export function getCookie(name) {
// //   if (typeof document === "undefined") return undefined;

// //   const value = `; ${document.cookie}`;
// //   const parts = value.split(`; ${name}=`);
// //   if (parts.length === 2) return parts.pop()?.split(";").shift();
// //   return undefined;
// // }
// /**
//  * Storage utilities for VENEFICUS
//  * Handles localStorage, sessionStorage, and cookies
//  */

// import { CART_KEY, WISHLIST_KEY, RECENTLY_VIEWED_KEY } from "./constants";

// /**
//  * Set a value in localStorage
//  * @param {string} key - Storage key
//  * @param {any} value - Value to store
//  */
// export const setLocalStorage = (key, value) => {
//   try {
//     const serializedValue = JSON.stringify(value);
//     localStorage.setItem(key, serializedValue);
//   } catch (error) {
//     
//   }
// };

// /**
//  * Get a value from localStorage
//  * @param {string} key - Storage key
//  * @returns {any} Stored value or null
//  */
// export const getLocalStorage = (key) => {
//   try {
//     const serializedValue = localStorage.getItem(key);
//     return serializedValue ? JSON.parse(serializedValue) : null;
//   } catch (error) {
//     
//     return null;
//   }
// };

// /**
//  * Remove a value from localStorage
//  * @param {string} key - Storage key
//  */
// export const removeLocalStorage = (key) => {
//   try {
//     localStorage.removeItem(key);
//   } catch (error) {
//     
//   }
// };

// /**
//  * Set a value in sessionStorage
//  * @param {string} key - Storage key
//  * @param {any} value - Value to store
//  */
// export const setSessionStorage = (key, value) => {
//   try {
//     const serializedValue = JSON.stringify(value);
//     sessionStorage.setItem(key, serializedValue);
//   } catch (error) {
//     
//   }
// };

// /**
//  * Get a value from sessionStorage
//  * @param {string} key - Storage key
//  * @returns {any} Stored value or null
//  */
// export const getSessionStorage = (key) => {
//   try {
//     const serializedValue = sessionStorage.getItem(key);
//     return serializedValue ? JSON.parse(serializedValue) : null;
//   } catch (error) {
//     
//     return null;
//   }
// };

// /**
//  * Remove a value from sessionStorage
//  * @param {string} key - Storage key
//  */
// export const removeSessionStorage = (key) => {
//   try {
//     sessionStorage.removeItem(key);
//   } catch (error) {
//     
//   }
// };

// /**
//  * Set a cookie
//  * @param {string} name - Cookie name
//  * @param {string} value - Cookie value
//  * @param {number} days - Number of days until expiration
//  */
// export const setCookie = (name, value, days = 30) => {
//   try {
//     const expires = new Date();
//     expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
//     const expiresStr = `expires=${expires.toUTCString()}`;
//     const path = "path=/";

//     document.cookie = `${name}=${encodeURIComponent(
//       value
//     )}; ${expiresStr}; ${path}; SameSite=Lax; ${
//       process.env.NODE_ENV === "production" ? "Secure;" : ""
//     }`;
//   } catch (error) {
//     
//   }
// };

// /**
//  * Get a cookie value
//  * @param {string} name - Cookie name
//  * @returns {string|null} Cookie value or null
//  */
// export const getCookie = (name) => {
//   try {
//     const nameEQ = `${name}=`;
//     const cookies = document.cookie.split(";");

//     for (let i = 0; i < cookies.length; i++) {
//       let cookie = cookies[i].trim();
//       if (cookie.indexOf(nameEQ) === 0) {
//         return decodeURIComponent(
//           cookie.substring(nameEQ.length, cookie.length)
//         );
//       }
//     }

//     return null;
//   } catch (error) {
//     
//     return null;
//   }
// };

// /**
//  * Remove a cookie
//  * @param {string} name - Cookie name
//  */
// export const removeCookie = (name) => {
//   try {
//     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
//   } catch (error) {
//     
//   }
// };

// /**
//  * Save cart to storage
//  * @param {Object} cart - Cart data
//  */
// export const saveCart = (cart) => {
//   setLocalStorage(CART_KEY, cart);
// };

// /**
//  * Get cart from storage
//  * @returns {Object|null} Cart data or null
//  */
// export const getCartFromStorage = () => {
//   return getLocalStorage(CART_KEY);
// };

// /**
//  * Clear cart from storage
//  */
// export const clearCart = () => {
//   removeLocalStorage(CART_KEY);
// };

// /**
//  * Save wishlist to storage
//  * @param {Array} wishlist - Wishlist items
//  */
// export const saveWishlist = (wishlist) => {
//   setLocalStorage(WISHLIST_KEY, wishlist);
// };

// /**
//  * Get wishlist from storage
//  * @returns {Array|null} Wishlist items or null
//  */
// export const getWishlist = () => {
//   return getLocalStorage(WISHLIST_KEY) || [];
// };

// /**
//  * Add product to wishlist
//  * @param {Object} product - Product to add
//  */
// export const addToWishlist = (product) => {
//   const wishlist = getWishlist();
//   if (!wishlist.some((item) => item.id === product.id)) {
//     saveWishlist([...wishlist, product]);
//   }
// };

// /**
//  * Remove product from wishlist
//  * @param {string} productId - Product ID to remove
//  */
// export const removeFromWishlist = (productId) => {
//   const wishlist = getWishlist().filter((item) => item.id !== productId);
//   saveWishlist(wishlist);
// };

// /**
//  * Check if product is in wishlist
//  * @param {string} productId - Product ID to check
//  * @returns {boolean} True if in wishlist, false otherwise
//  */
// export const isInWishlist = (productId) => {
//   const wishlist = getWishlist();
//   return wishlist.some((item) => item.id === productId);
// };

// /**
//  * Save recently viewed products
//  * @param {Object} product - Product to add to recently viewed
//  */
// export const saveRecentlyViewed = (product) => {
//   try {
//     let recentlyViewed = getLocalStorage(RECENTLY_VIEWED_KEY) || [];

//     // Remove if already exists
//     recentlyViewed = recentlyViewed.filter((p) => p.id !== product.id);

//     // Add to beginning
//     recentlyViewed.unshift(product);

//     // Limit to 8 items
//     if (recentlyViewed.length > 8) {
//       recentlyViewed.pop();
//     }

//     setLocalStorage(RECENTLY_VIEWED_KEY, recentlyViewed);
//   } catch (error) {
//     
//   }
// };

// /**
//  * Get recently viewed products
//  * @returns {Array} Recently viewed products
//  */
// export const getRecentlyViewed = () => {
//   return getLocalStorage(RECENTLY_VIEWED_KEY) || [];
// };

import { CART_KEY, WISHLIST_KEY, RECENTLY_VIEWED_KEY, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./constants";

export { CART_KEY, WISHLIST_KEY, RECENTLY_VIEWED_KEY, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY };

/**
 * Helper: Check if we are in browser
 */
export const isBrowser = () => typeof window !== "undefined";

/**
 * Set a value in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setLocalStorage = (key, value) => {
  if (!isBrowser()) return;

  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    
  }
};

/**
 * Get a value from localStorage
 * @param {string} key - Storage key
 * @returns {any} Stored value or null
 */
export const getLocalStorage = (key) => {
  if (!isBrowser()) return null;

  try {
    const serializedValue = localStorage.getItem(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    
    return null;
  }
};

/**
 * Remove a value from localStorage
 * @param {string} key - Storage key
 */
export const removeLocalStorage = (key) => {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    
  }
};

/**
 * Set a value in sessionStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setSessionStorage = (key, value) => {
  if (!isBrowser()) return;

  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    
  }
};

/**
 * Get a value from sessionStorage
 * @param {string} key - Storage key
 * @returns {any} Stored value or null
 */
export const getSessionStorage = (key) => {
  if (!isBrowser()) return null;

  try {
    const serializedValue = sessionStorage.getItem(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    
    return null;
  }
};

/**
 * Remove a value from sessionStorage
 * @param {string} key - Storage key
 */
export const removeSessionStorage = (key) => {
  if (!isBrowser()) return;

  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    
  }
};

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until expiration
 */
export const setCookie = (name, value, days = 30) => {
  if (!isBrowser()) return;

  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const expiresStr = `expires=${expires.toUTCString()}`;
    const path = "path=/";

    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; ${expiresStr}; ${path}; SameSite=Lax; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    }`;
  } catch (error) {
    
  }
};

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null
 */
export const getCookie = (name) => {
  if (!isBrowser()) return null;

  try {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(
          cookie.substring(nameEQ.length, cookie.length)
        );
      }
    }

    return null;
  } catch (error) {
    
    return null;
  }
};

/**
 * Remove a cookie
 * @param {string} name - Cookie name
 */
export const removeCookie = (name) => {
  if (!isBrowser()) return;

  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } catch (error) {
    
  }
};

/**
 * Save cart to storage
 * @param {Object} cart - Cart data
 */
export const saveCart = (cart) => {
  setLocalStorage(CART_KEY, cart);
};

/**
 * Get cart from storage
 * @returns {Object|null} Cart data or null
 */
export const getCartFromStorage = () => {
  return getLocalStorage(CART_KEY);
};

/**
 * Clear cart from storage
 */
export const clearCart = () => {
  removeLocalStorage(CART_KEY);
};

/**
 * Save wishlist to storage
 * @param {Array} wishlist - Wishlist items
 */
export const saveWishlist = (wishlist) => {
  setLocalStorage(WISHLIST_KEY, wishlist);
};

/**
 * Get wishlist from storage
 * @returns {Array|null} Wishlist items or null
 */
export const getWishlist = () => {
  return getLocalStorage(WISHLIST_KEY) || [];
};

/**
 * Add product to wishlist
 * @param {Object} product - Product to add
 */
export const addToWishlist = (product) => {
  const wishlist = getWishlist();
  if (!wishlist.some((item) => item.id === product.id)) {
    saveWishlist([...wishlist, product]);
  }
};

/**
 * Remove product from wishlist
 * @param {string} productId - Product ID to remove
 */
export const removeFromWishlist = (productId) => {
  const wishlist = getWishlist().filter((item) => item.id !== productId);
  saveWishlist(wishlist);
};

/**
 * Check if product is in wishlist
 * @param {string} productId - Product ID to check
 * @returns {boolean} True if in wishlist, false otherwise
 */
export const isInWishlist = (productId) => {
  const wishlist = getWishlist();
  return wishlist.some((item) => item.id === productId);
};

/**
 * Save recently viewed products
 * @param {Object} product - Product to add to recently viewed
 */
export const saveRecentlyViewed = (product) => {
  if (!isBrowser()) return;

  try {
    let recentlyViewed = getLocalStorage(RECENTLY_VIEWED_KEY) || [];

    // Remove if already exists
    recentlyViewed = recentlyViewed.filter((p) => p.id !== product.id);

    // Add to beginning
    recentlyViewed.unshift(product);

    // Limit to 8 items
    if (recentlyViewed.length > 8) {
      recentlyViewed.pop();
    }

    setLocalStorage(RECENTLY_VIEWED_KEY, recentlyViewed);
  } catch (error) {
    
  }
};

/**
 * Get recently viewed products
 * @returns {Array} Recently viewed products
 */
export const getRecentlyViewed = () => {
  return getLocalStorage(RECENTLY_VIEWED_KEY) || [];
};

/**
 * Save authentication tokens
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token
 * @param {number} expiresIn - Token expiration in seconds
 */
export const saveAuthTokens = (accessToken, refreshToken, expiresIn) => {
  if (!isBrowser()) return;

  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);

  if (process.env.NODE_ENV !== "production") {
    // Development → sessionStorage (more secure than localStorage)
    if (isBrowser()) {
      sessionStorage.setItem("auth_expires", expirationDate.getTime());
      sessionStorage.setItem(AUTH_TOKEN_KEY, accessToken);
      sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } else {
    // Production → Secure httpOnly cookies (server-side only)
    // Note: These should be set by server-side API endpoints, not client-side
    
  }
};

/**
 * Get authentication token
 * @returns {string|null} Authentication token or null
 */
export const getAuthToken = () => {
  if (!isBrowser()) return null;

  if (process.env.NODE_ENV !== "production") {
    const expires = sessionStorage.getItem("auth_expires");
    if (expires && Date.now() > parseInt(expires)) {
      return null;
    }
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  } else {
    return getCookie(AUTH_TOKEN_KEY);
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

/**
 * Clear authentication tokens
 */
export const clearAuthTokens = () => {
  if (!isBrowser()) return;

  if (process.env.NODE_ENV !== "production") {
    if (isBrowser()) {
      sessionStorage.removeItem("auth_expires");
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  } else {
    removeCookie(AUTH_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
  }
};
