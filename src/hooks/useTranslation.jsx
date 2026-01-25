'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { t as translate, loadLocaleTranslations } from '@/lib/i18n';

export function useTranslation() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get locale from params or detect from pathname
  const locale = params?.locale || (pathname?.startsWith('/it') ? 'it' : 'en');

  useEffect(() => {
    if (locale) {
      loadLocaleTranslations(locale);
    }
  }, [locale]);

  const t = (key, fallback = key) => {
    try {
      return translate(key, fallback, locale);
    } catch (error) {
      
      return fallback;
    }
  };

  const switchLanguage = async (lang) => {
    setIsLoading(true);
    try {
      const currentPath = pathname.replace(/^\/(en|it)/, '') || '/';
      const newPath = `/${lang}${currentPath}`;
      router.push(newPath);
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  return {
    t,
    locale,
    isLoading,
    isRTL: locale === 'ar' || locale === 'he',
    changeLanguage: switchLanguage
  };
}