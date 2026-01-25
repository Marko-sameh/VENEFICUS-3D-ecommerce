// /**
//  * Authentication utilities for VENEFICUS
//  * Handles token management and authentication state
//  */

// import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./constants";
// import { setCookie, getCookie, removeCookie } from "./storage";

// /**
//  * Save authentication tokens to secure storage
//  * @param {string} accessToken - JWT access token
//  * @param {string} refreshToken - JWT refresh token
//  * @param {number} expiresIn - Token expiration in seconds
//  */
// export const saveAuthTokens = (accessToken, refreshToken, expiresIn) => {
//   // Set in HTTP-only cookies for security (handled by backend)
//   // For frontend, we'll also store expiration for client-side checks
//   const expirationDate = new Date();
//   expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);

//   // Store expiration timestamp in localStorage for quick access
//   localStorage.setItem("auth_expires", expirationDate.getTime());

//   // For development/testing, we can store tokens in localStorage
//   // In production, tokens should be stored in HTTP-only cookies
//   if (process.env.NODE_ENV !== "production") {
//     localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
//     localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
//   }
// };

// /**
//  * Get the current authentication token
//  * @returns {string|null} Access token if valid, null otherwise
//  */
// export const getAuthToken = () => {
//   // Check if token is expired
//   const expires = localStorage.getItem("auth_expires");
//   if (expires && Date.now() > parseInt(expires)) {
//     return null;
//   }

//   // For development/testing
//   if (process.env.NODE_ENV !== "production") {
//     return localStorage.getItem(AUTH_TOKEN_KEY);
//   }

//   // In production, token is in HTTP-only cookie (handled by backend)
//   return getCookie(AUTH_TOKEN_KEY);
// };

// /**
//  * Check if user is authenticated
//  * @returns {boolean} True if authenticated, false otherwise
//  */
// export const isAuthenticated = () => {
//   const token = getAuthToken();
//   return !!token;
// };

// /**
//  * Clear authentication tokens
//  */
// export const clearAuthTokens = () => {
//   localStorage.removeItem("auth_expires");
//   localStorage.removeItem(AUTH_TOKEN_KEY);
//   localStorage.removeItem(REFRESH_TOKEN_KEY);

//   if (process.env.NODE_ENV === "production") {
//     removeCookie(AUTH_TOKEN_KEY);
//     removeCookie(REFRESH_TOKEN_KEY);
//   }
// };

// /**
//  * Refresh authentication token
//  * @returns {Promise} Resolves with new tokens
//  */
// export const refreshAuthToken = async () => {
//   try {
//     const refreshToken =
//       process.env.NODE_ENV !== "production"
//         ? localStorage.getItem(REFRESH_TOKEN_KEY)
//         : getCookie(REFRESH_TOKEN_KEY);

//     if (!refreshToken) {
//       throw new Error("No refresh token available");
//     }

//     const response = await fetch("/api/auth/refresh", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ refreshToken }),
//       credentials: "include",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to refresh token");
//     }

//     const { accessToken, expiresIn } = await response.json();
//     saveAuthTokens(accessToken, refreshToken, expiresIn);
//     return accessToken;
//   } catch (error) {
//     clearAuthTokens();
//     throw error;
//   }
// };

// import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./constants";
// import { setCookie, getCookie, removeCookie } from "./storage";

// /**
//  * Helper: Check if we are in browser
//  */
// const isBrowser = () => typeof window !== "undefined";

// /**
//  * Save authentication tokens
//  */
// export const saveAuthTokens = (accessToken, refreshToken, expiresIn) => {
//   const expirationDate = new Date();
//   expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);

//   if (process.env.NODE_ENV !== "production") {
//     // Development → localStorage
//     if (isBrowser()) {
//       localStorage.setItem("auth_expires", expirationDate.getTime());
//       localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
//       localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
//     }
//   } else {
//     // Production → Cookies
//     setCookie(AUTH_TOKEN_KEY, accessToken, { expires: expirationDate });
//     setCookie(REFRESH_TOKEN_KEY, refreshToken, { expires: expirationDate });
//   }
// };

// /**
//  * Get authentication token
//  */
// export const getAuthToken = () => {
//   if (process.env.NODE_ENV !== "production") {
//     if (!isBrowser()) return null; // SSR safeguard

//     const expires = localStorage.getItem("auth_expires");
//     if (expires && Date.now() > parseInt(expires)) {
//       return null;
//     }
//     return localStorage.getItem(AUTH_TOKEN_KEY);
//   } else {
//     return getCookie(AUTH_TOKEN_KEY);
//   }
// };

// /**
//  * Is authenticated
//  */
// export const isAuthenticated = () => {
//   const token = getAuthToken();
//   return !!token;
// };

// /**
//  * Clear authentication tokens
//  */
// export const clearAuthTokens = () => {
//   if (process.env.NODE_ENV !== "production") {
//     if (isBrowser()) {
//       localStorage.removeItem("auth_expires");
//       localStorage.removeItem(AUTH_TOKEN_KEY);
//       localStorage.removeItem(REFRESH_TOKEN_KEY);
//     }
//   } else {
//     removeCookie(AUTH_TOKEN_KEY);
//     removeCookie(REFRESH_TOKEN_KEY);
//   }
// };

// /**
//  * Refresh authentication token
//  */
// export const refreshAuthToken = async () => {
//   try {
//     let refreshToken;

//     if (process.env.NODE_ENV !== "production") {
//       if (isBrowser()) {
//         refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
//       }
//     } else {
//       refreshToken = getCookie(REFRESH_TOKEN_KEY);
//     }

//     if (!refreshToken) throw new Error("No refresh token available");

//     const response = await fetch("/api/auth/refresh", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ refreshToken }),
//       credentials: "include",
//     });

//     if (!response.ok) throw new Error("Failed to refresh token");

//     const { accessToken, expiresIn } = await response.json();
//     saveAuthTokens(accessToken, refreshToken, expiresIn);

//     return accessToken;
//   } catch (error) {
//     clearAuthTokens();
//     throw error;
//   }
// };

/**
 * Google OAuth authentication utilities for VENEFICUS
 * Simplified authentication using only @react-oauth/google
 */

const AUTH_TOKEN_KEY = 'veneficus_token';

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Get authentication token
 */
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Save authentication token
 */
export const saveAuthToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  // Also set as cookie for server-side access
  document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
};

/**
 * Clear authentication token
 */
export const clearAuthToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  // Also remove cookie
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

/**
 * Logout user
 */
export const logout = () => {
  clearAuthToken();
  window.location.href = '/auth/login';
};
