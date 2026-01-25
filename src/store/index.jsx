import { useUserStore } from './userStore';
import { useUnifiedCartStore } from './unifiedCartStore';
import { useProductsStore } from './productsStore';
import { useUiStore } from './uiStore';

// Selective store access to avoid unnecessary re-renders
export const useStore = (stores = []) => {
    const result = {};
    if (stores.includes('user')) result.user = useUserStore();
    if (stores.includes('cart')) result.cart = useUnifiedCartStore();
    if (stores.includes('products')) result.products = useProductsStore();
    if (stores.includes('ui')) result.ui = useUiStore();
    return result;
};

// Re-export individual stores
export { useUserStore } from './userStore';
export { useUnifiedCartStore } from './unifiedCartStore';
export { useProductsStore } from './productsStore';
export { useUiStore } from './uiStore';

// export const useWishlist = () => useWishlistStore(state => ({
//     items: state.items,
//     addToWishlist: state.addToWishlist,
//     removeFromWishlist: state.removeFromWishlist,
//     isInWishlist: state.isInWishlist,
//     moveToCart: state.moveToCart,
//     clearWishlist: state.clearWishlist,
//     error: state.error,
//     clearError: state.clearError
// }));

export const useUi = () => useUiStore(state => ({
    theme: state.theme,
    isDarkMode: state.isDarkMode,
    setTheme: state.setTheme,
    mobileMenuOpen: state.mobileMenuOpen,
    mobileMenuVisible: state.mobileMenuVisible,
    openMobileMenu: state.openMobileMenu,
    closeMobileMenu: state.closeMobileMenu,
    toggleMobileMenu: state.toggleMobileMenu,
    modals: state.modals,
    openModal: state.openModal,
    closeModal: state.closeModal,
    toasts: state.toasts,
    addToast: state.addToast,
    removeToast: state.removeToast,
    loading: state.loading,
    setLoading: state.setLoading,
    seo: state.seo,
    setSeo: state.setSeo,
    resetSeo: state.resetSeo,
    hasError: state.hasError,
    errorInfo: state.errorInfo,
    setError: state.setError,
    clearError: state.clearError,
    initializeErrorHandlers: state.initializeErrorHandlers,
    searchAnalytics: state.searchAnalytics,
    trackNoResultsView: state.trackNoResultsView,
    trackSuggestionClick: state.trackSuggestionClick,
    getDefaultSuggestions: state.getDefaultSuggestions,
    pagination: state.pagination,
    calculateVisiblePages: state.calculateVisiblePages,
    generatePageUrl: state.generatePageUrl,
    locale: state.locale,
    detectLocale: state.detectLocale,
    setLocale: state.setLocale,
    initializeLocale: state.initializeLocale,
    formatPriceData: state.formatPriceData,
    clientReady: state.clientReady,
    currentUrl: state.currentUrl,
    copiedStates: state.copiedStates,
    initializeClient: state.initializeClient,
    trackShare: state.trackShare,
    copyToClipboard: state.copyToClipboard,
    shareViaSystem: state.shareViaSystem
}));