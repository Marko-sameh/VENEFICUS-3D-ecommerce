/**
 * Security utilities for VENEFICUS services
 */

// CSRF token management
// Get CSRF token from environment or meta tag (has side effects - not pure)
export const getCsrfToken = () => {
  if (typeof window !== "undefined") {
    return (
      document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content") || ""
    );
  }
  return process.env.CSRF_TOKEN || "";
};

// Pure version for testing
export const getCsrfTokenPure = (metaContent, envToken) => {
  return metaContent || envToken || "";
};

// Input validation utilities
export const validateId = (id) => {
  if (!id || typeof id !== "string") return false;
  // Prevent code injection - only allow safe characters
  return (
    /^[a-zA-Z0-9-_]{1,50}$/.test(id) &&
    !/<script|javascript:|data:|vbscript:/i.test(id)
  );
};

export const validateEmail = (email) => {
  if (!email || typeof email !== "string" || email.length > 254) return false;
  // Prevent XSS in email
  if (/<script|javascript:|data:|vbscript:/i.test(email)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const sanitizeUrl = (url) => {
  try {
    if (url.startsWith('/')) {
      return url;
    }
    
    const parsed = new URL(url);
    const allowedHosts = [
      "veneficus.asbackend.com",
      "haywood-convective-lina.ngrok-free.dev",
      "api.veneficus.com",
      "localhost",
    ];
    
    if (process.env.NODE_ENV === "development") {
      return url;
    }
    
    return allowedHosts.includes(parsed.hostname) ? url : null;
  } catch {
    return null;
  }
};

export const validateUrl = (url) => {
  return sanitizeUrl(url) !== null;
};

// Retry with exponential backoff
export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

// Generate unique ID (pure function)
export const generateUniqueId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate CSRF token (pure function)
export const generateCSRFToken = () => {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }
  return generateUniqueId();
};

// Sanitize input to prevent code injection
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
};

// Create secure fetch options
export const createSecureFetchOptions = (options = {}) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("veneficus_auth_token")
      : null;

  return {
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": getCsrfToken(),
      "X-Request-ID": generateUniqueId(),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    signal: AbortSignal.timeout(5000),
    ...options,
  };
};

// Normalize API errors
export const createNormalizedError = (status, message, code) => {
  // Validate inputs to prevent code injection
  const safeStatus = typeof status === "number" ? status : 500;
  const safeMessage =
    typeof message === "string" ? sanitizeInput(message) : "Request failed";

  // Safely handle code parameter with strict validation
  let safeCode = `HTTP_${safeStatus}`;
  if (typeof code === "string" && code.length > 0 && code.length <= 50) {
    // Only allow alphanumeric, underscore, and hyphen characters
    const cleanCode = code.match(/^[a-zA-Z0-9_-]+$/);
    if (cleanCode) {
      safeCode = cleanCode[0];
    }
  }

  return {
    code: safeCode,
    message: safeMessage,
    status: safeStatus,
    timestamp: new Date().toISOString(),
  };
};
