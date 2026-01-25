'use client';

import { useMemo } from 'react';

// Sanitize structured data to prevent XSS
function sanitizeStructuredData(obj) {
  if (obj === null || typeof obj !== 'object') {
    return typeof obj === 'string' ? obj.replace(/[<>"'&]/g, '') : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeStructuredData(item));
  }
  
  const sanitized = {};
  Object.keys(obj).forEach(key => {
    const safeKey = typeof key === 'string' ? key.replace(/[<>"'&]/g, '') : key;
    sanitized[safeKey] = sanitizeStructuredData(obj[key]);
  });
  
  return sanitized;
}

export function JsonLd({ data, item, type }) {
  const jsonLdScript = useMemo(() => {
    const inputData = data || item;
    if (!inputData || typeof inputData !== 'object') return null;

    try {
      // Sanitize data to prevent XSS
      const sanitizedData = sanitizeStructuredData(inputData);
      
      const structuredData = {
        '@context': 'https://schema.org',
        ...sanitizedData
      };
      
      return JSON.stringify(structuredData);
    } catch (error) {
      
      return null;
    }
  }, [data, item]);

  if (!jsonLdScript) return null;

  const safeType = typeof type === 'string' ? type.replace(/[<>"'&]/g, '') : '';

  return (
    <script
      type="application/ld+json"
      data-schema-type={safeType}
      dangerouslySetInnerHTML={{ __html: jsonLdScript }}
      suppressHydrationWarning
    />
  );
}