/**
 * Unified i18n implementation for VENEFICUS with Next.js routing support
 */

let translations = {};
let loadingPromises = {};

const loadTranslations = async (locale) => {
  if (translations[locale]) return translations[locale];
  
  // Prevent multiple simultaneous loads
  if (loadingPromises[locale]) {
    return await loadingPromises[locale];
  }
  
  loadingPromises[locale] = (async () => {
    try {
      // Client-side loading only
      const response = await fetch(`/locales/${locale}/common.json`);
      if (response.ok) {
        translations[locale] = await response.json();
      } else {
        
        translations[locale] = {};
      }
    } catch (error) {
      
      translations[locale] = {};
    } finally {
      delete loadingPromises[locale];
    }
    
    return translations[locale];
  })();
  
  return await loadingPromises[locale];
};

const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

export const t = (key, fallback = key, locale = 'en') => {
  try {
    const value = getNestedValue(translations[locale], key);
    // Ensure we return a string, not an object
    if (typeof value === 'string') {
      return value;
    }
    return fallback;
  } catch (error) {
    
    return fallback;
  }
};

export const loadLocaleTranslations = async (locale) => {
  if (typeof window !== 'undefined') {
    await loadTranslations(locale);
  }
};

export const getTranslations = (locale) => translations[locale] || {};

// Initialize default locale on client
if (typeof window !== 'undefined') {
  loadTranslations('en').catch(() => {});
}