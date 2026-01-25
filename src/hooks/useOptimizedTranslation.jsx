"use client";

import { useMemo, useEffect } from 'react';
import { useTranslation } from './useTranslation';

// Cache for translations with size limit
const MAX_CACHE_SIZE = 1000;
const translationCache = new Map();

// Clear cache when it gets too large
const clearOldCache = () => {
  if (translationCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(translationCache.entries());
    const toDelete = entries.slice(0, Math.floor(MAX_CACHE_SIZE / 2));
    toDelete.forEach(([key]) => translationCache.delete(key));
  }
};

export function useOptimizedTranslation() {
  const { t, language } = useTranslation();
  
  // Clear cache when language changes
  useEffect(() => {
    translationCache.clear();
  }, [language]);
  
  return useMemo(() => {
    const cachedT = (key, fallback) => {
      const cacheKey = `${language}-${key}`;
      if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
      }
      const result = t(key, fallback);
      translationCache.set(cacheKey, result);
      clearOldCache();
      return result;
    };
    
    return { t: cachedT, language };
  }, [t, language]);
}