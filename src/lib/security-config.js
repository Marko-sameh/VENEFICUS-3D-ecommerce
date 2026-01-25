/**
 * Security configuration for VENEFICUS
 * Centralized security settings and validation rules
 */

// Allowed domains for API requests (prevent SSRF)
export const ALLOWED_DOMAINS = [
  'api.veneficus.com',
  'localhost',
  '127.0.0.1',
  process.env.NEXT_PUBLIC_API_HOST
].filter(Boolean);

// Content Security Policy configuration
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'", 'https://api.stripe.com', process.env.NEXT_PUBLIC_API_URL].filter(Boolean),
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
};

// Input validation patterns
export const VALIDATION_PATTERNS = {
  ID: /^[a-zA-Z0-9-_]{1,50}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,20}$/,
  URL: /^https?:\/\/[^\s<>"']+$/,
  SLUG: /^[a-z0-9-]+$/,
  SAFE_STRING: /^[a-zA-Z0-9\s\-_.,!?()]{1,200}$/
};

// Rate limiting configuration
export const RATE_LIMITS = {
  API_REQUESTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // requests per window
  },
  LOGIN_ATTEMPTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // attempts per window
  },
  PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3 // attempts per window
  }
};

// Security headers configuration
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// Sanitization rules
export const SANITIZATION_RULES = {
  REMOVE_HTML: /<[^>]*>/g,
  REMOVE_SCRIPTS: /<script[^>]*>.*?<\/script>/gi,
  REMOVE_DANGEROUS_ATTRS: /on\w+\s*=/gi,
  REMOVE_DANGEROUS_PROTOCOLS: /javascript:|data:|vbscript:/gi,
  ALLOWED_CHARS: /[<>\"'&]/g
};

// File upload security
export const FILE_UPLOAD_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  SCAN_FOR_MALWARE: true
};

// Session security
export const SESSION_CONFIG = {
  COOKIE_NAME: 'veneficus_session',
  MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
  SECURE: process.env.NODE_ENV === 'production',
  HTTP_ONLY: true,
  SAME_SITE: 'strict'
};

// API security configuration
export const API_SECURITY = {
  REQUIRE_HTTPS: process.env.NODE_ENV === 'production',
  CORS_ORIGINS: [
    'https://veneficus.com',
    'https://www.veneficus.com',
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
  ],
  MAX_REQUEST_SIZE: '10mb',
  TIMEOUT: 30000 // 30 seconds
};

export default {
  ALLOWED_DOMAINS,
  CSP_CONFIG,
  VALIDATION_PATTERNS,
  RATE_LIMITS,
  SECURITY_HEADERS,
  SANITIZATION_RULES,
  FILE_UPLOAD_CONFIG,
  SESSION_CONFIG,
  API_SECURITY
};