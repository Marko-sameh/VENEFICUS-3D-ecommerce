'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useUiStore } from '@/store/uiStore';
import { useProductsStore } from '@/store/productsStore';
import { usePathname } from 'next/navigation';

/**
 * Optimized UI hook with error handling and state management
 */
export function useUi() {
  const hasError = useUiStore(state => state.hasError);
  const errorInfo = useUiStore(state => state.errorInfo);
  const errorHandlersInitialized = useUiStore(state => state.errorHandlersInitialized);
  const setError = useUiStore(state => state.setError);
  const clearError = useUiStore(state => state.clearError);
  const initializeErrorHandlers = useUiStore(state => state.initializeErrorHandlers);
  
  const theme = useUiStore(state => state.theme);
  const isDarkMode = useUiStore(state => state.isDarkMode);
  const activeNav = useUiStore(state => state.activeNav);
  const activeTap = useUiStore(state => state.activeTap);
  const mobileMenuOpen = useUiStore(state => state.mobileMenuOpen);
  const mobileMenuVisible = useUiStore(state => state.mobileMenuVisible);
  const modals = useUiStore(state => state.modals);
  const toasts = useUiStore(state => state.toasts);
  const loading = useUiStore(state => state.loading);
  const scrolled = useUiStore(state => state.scrolled);
  
  const setTheme = useUiStore(state => state.setTheme);
  const setActiveNav = useUiStore(state => state.setActiveNav);
  const setActiveTap = useUiStore(state => state.setActiveTap);
  const openMobileMenu = useUiStore(state => state.openMobileMenu);
  const closeMobileMenu = useUiStore(state => state.closeMobileMenu);
  const toggleMobileMenu = useUiStore(state => state.toggleMobileMenu);
  const handleRouteChange = useUiStore(state => state.handleRouteChange);
  const initializeNavigation = useUiStore(state => state.initializeNavigation);
  const cleanup = useUiStore(state => state.cleanup);
  const openModal = useUiStore(state => state.openModal);
  const closeModal = useUiStore(state => state.closeModal);
  const addToast = useUiStore(state => state.addToast);
  const removeToast = useUiStore(state => state.removeToast);
  const setLoading = useUiStore(state => state.setLoading);
  const setScrolled = useUiStore(state => state.setScrolled);
  const initializeScrollListener = useUiStore(state => state.initializeScrollListener);

  const pathname = usePathname();

  // Initialize error handlers once
  useEffect(() => {
    if (!errorHandlersInitialized) {
      const cleanup = initializeErrorHandlers();
      return cleanup;
    }
  }, [errorHandlersInitialized, initializeErrorHandlers]);

  // Initialize navigation state on mount
  useEffect(() => {
    initializeNavigation();
  }, [initializeNavigation]);

  // Clear errors and close mobile menu on route change
  useEffect(() => {
    if (hasError) {
      clearError();
    }
    handleRouteChange(pathname);
  }, [pathname, hasError, clearError, handleRouteChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Clear errors on browser navigation
  useEffect(() => {
    const handleRouteChange = () => {
      if (hasError) {
        clearError();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handleRouteChange);
      return () => window.removeEventListener('popstate', handleRouteChange);
    }
  }, [hasError, clearError]);

  const handleRetry = useCallback(() => {
    clearError();
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, [clearError]);

  // Get analytics functions
  const trackNoResultsView = useUiStore(state => state.trackNoResultsView);
  const trackSuggestionClick = useUiStore(state => state.trackSuggestionClick);
  const getDefaultSuggestions = useUiStore(state => state.getDefaultSuggestions);
  const searchAnalytics = useUiStore(state => state.searchAnalytics);
  
  // Get pagination functions
  const pagination = useUiStore(state => state.pagination);
  const calculateVisiblePages = useUiStore(state => state.calculateVisiblePages);
  const generatePageUrl = useUiStore(state => state.generatePageUrl);
  
  // Get locale and pricing functions
  const locale = useUiStore(state => state.locale);
  const detectLocale = useUiStore(state => state.detectLocale);
  const setLocale = useUiStore(state => state.setLocale);
  const initializeLocale = useUiStore(state => state.initializeLocale);
  const formatPriceData = useUiStore(state => state.formatPriceData);
  
  // Get sharing functions
  const clientReady = useUiStore(state => state.clientReady);
  const currentUrl = useUiStore(state => state.currentUrl);
  const copiedStates = useUiStore(state => state.copiedStates);
  const initializeClient = useUiStore(state => state.initializeClient);
  const trackShare = useUiStore(state => state.trackShare);
  const copyToClipboard = useUiStore(state => state.copyToClipboard);
  const shareViaSystem = useUiStore(state => state.shareViaSystem);
  
  // Get SEO functions
  const generateProductCollectionSchema = useUiStore(state => state.generateProductCollectionSchema);

  return {
    // Error state
    hasError,
    errorInfo,
    setError,
    clearError,
    handleRetry,
    
    // Analytics
    searchAnalytics,
    trackNoResultsView,
    trackSuggestionClick,
    getDefaultSuggestions,
    
    // Pagination
    pagination,
    calculateVisiblePages,
    generatePageUrl,
    
    // Locale and pricing
    locale,
    detectLocale,
    setLocale,
    initializeLocale,
    formatPriceData,
    
    // Sharing
    clientReady,
    currentUrl,
    copiedStates,
    initializeClient,
    trackShare,
    copyToClipboard,
    shareViaSystem,
    
    // SEO
    generateProductCollectionSchema,
    
    // UI state
    theme,
    isDarkMode,
    activeNav,
    activeTap,
    mobileMenuOpen,
    mobileMenuVisible,
    modals,
    toasts,
    loading,
    scrolled,
    
    // UI actions
    setTheme,
    setActiveNav,
    setActiveTap,
    initializeNavigation,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    openModal,
    closeModal,
    addToast,
    removeToast,
    setLoading,
    setScrolled,
    initializeScrollListener
  };
}

// Lightweight hooks for specific UI state
export function useUiError() {
  const hasError = useUiStore(state => state.hasError);
  const errorInfo = useUiStore(state => state.errorInfo);
  const clearError = useUiStore(state => state.clearError);
  
  return { hasError, errorInfo, clearError };
}

export function useUiTheme() {
  const theme = useUiStore(state => state.theme);
  const isDarkMode = useUiStore(state => state.isDarkMode);
  const setTheme = useUiStore(state => state.setTheme);
  
  return { theme, isDarkMode, setTheme };
}

export function useUiModals() {
  const modals = useUiStore(state => state.modals);
  const openModal = useUiStore(state => state.openModal);
  const closeModal = useUiStore(state => state.closeModal);
  
  return { modals, openModal, closeModal };
}

export function useMobileMenu() {
  const mobileMenuOpen = useUiStore(state => state.mobileMenuOpen);
  const mobileMenuVisible = useUiStore(state => state.mobileMenuVisible);
  const openMobileMenu = useUiStore(state => state.openMobileMenu);
  const closeMobileMenu = useUiStore(state => state.closeMobileMenu);
  
  return { mobileMenuOpen, mobileMenuVisible, openMobileMenu, closeMobileMenu };
}

export function usePagination() {
  const calculateVisiblePages = useUiStore(state => state.calculateVisiblePages);
  const generatePageUrl = useUiStore(state => state.generatePageUrl);
  
  return { calculateVisiblePages, generatePageUrl };
}

export function usePricing() {
  const locale = useUiStore(state => state.locale);
  const formatPriceData = useUiStore(state => state.formatPriceData);
  const initializeLocale = useUiStore(state => state.initializeLocale);
  
  return { locale, formatPriceData, initializeLocale };
}

export function useSharing() {
  const clientReady = useUiStore(state => state.clientReady);
  const currentUrl = useUiStore(state => state.currentUrl);
  const copiedStates = useUiStore(state => state.copiedStates);
  const initializeClient = useUiStore(state => state.initializeClient);
  const copyToClipboard = useUiStore(state => state.copyToClipboard);
  const shareViaSystem = useUiStore(state => state.shareViaSystem);
  
  return { clientReady, currentUrl, copiedStates, initializeClient, copyToClipboard, shareViaSystem };
}

// Specialized hook for best sellers with selective subscriptions
export function useBestSellers() {
  const bestSellers = useProductsStore(state => state.bestSellers);
  const loading = useProductsStore(state => state.loading.bestSellers);
  const error = useProductsStore(state => state.error);
  const fetchBestSellers = useProductsStore(state => state.fetchBestSellers);
  
  return { bestSellers, loading, error, fetchBestSellers };
}

// Specialized hook for navigation functionality
export function useNavigation() {
  const activeNav = useUiStore(state => state.activeNav);
  const activeTap = useUiStore(state => state.activeTap);
  const setActiveNav = useUiStore(state => state.setActiveNav);
  const setActiveTap = useUiStore(state => state.setActiveTap);
  const initializeNavigation = useUiStore(state => state.initializeNavigation);
  
  return { activeNav, activeTap, setActiveNav, setActiveTap, initializeNavigation };
}

// Specialized hook for scroll functionality
export function useScroll() {
  const scrolled = useUiStore(state => state.scrolled);
  const setScrolled = useUiStore(state => state.setScrolled);
  const initializeScrollListener = useUiStore(state => state.initializeScrollListener);
  
  return { scrolled, setScrolled, initializeScrollListener };
}

// Specialized hook for SEO functions
export function useSeo() {
  const generateProductCollectionSchema = useUiStore(state => state.generateProductCollectionSchema);
  
  return { generateProductCollectionSchema };
}