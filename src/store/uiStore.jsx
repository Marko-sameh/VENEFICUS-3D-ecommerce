import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(persist(
    (set, get) => ({
        // Theme state
        theme: 'light',
        isDarkMode: false,

        // Navigation state
        activeNav: null,
        activeTap: '',
        mobileMenuOpen: false,
        mobileMenuVisible: false,

        // Scroll state
        scrolled: false,

        // Modal state
        modals: {
            login: false,
            register: false,
            forgotPassword: false,
            cart: false,
            wishlist: false,
            quickView: null,
        },

        // Toast notifications
        toasts: [],

        // Loading states
        loading: {
            global: false,
            product: false,
            cart: false,
            auth: false
        },

        // Error handling state
        hasError: false,
        errorInfo: null,
        errorHandlersInitialized: false,

        // Analytics and search state
        searchAnalytics: {
            lastSearchTerm: '',
            lastContentType: 'products',
            suggestionClicks: 0
        },

        // Pagination state
        pagination: {
            currentPage: 1,
            totalPages: 1,
            baseUrl: '',
            filters: {},
            visiblePages: []
        },

        // Locale and pricing state
        locale: 'en',
        priceCache: new Map(),

        // Sharing state
        clientReady: false,
        currentUrl: '',
        copiedStates: new Map(),

        // SEO related state
        seo: {
            title: 'VENEFICUS Website',
            description: 'Modern web development toolkit',
            keywords: 'VENEFICUS, web development, toolkit, modern'
        },

        // Gallery state
        gallery: [],
        galleryLoading: false,
        galleryError: null,

        // Set theme
        setTheme: (theme) => {
            try {
                const isDark = theme === 'dark' ||
                    (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

                if (typeof document !== 'undefined') {
                    document.documentElement.classList.toggle('dark', isDark);
                }

                set({
                    theme,
                    isDarkMode: isDark
                });
            } catch (error) {

            }
        },

        // Mobile menu actions
        openMobileMenu: () => {
            set({ mobileMenuVisible: true });
            // Prevent body scroll
            if (typeof document !== 'undefined') {
                document.body.style.overflow = 'hidden';
            }
            // Delay animation to allow DOM update
            setTimeout(() => set({ mobileMenuOpen: true }), 20);
        },

        closeMobileMenu: () => {
            set({ mobileMenuOpen: false });
            // Restore body scroll
            if (typeof document !== 'undefined') {
                document.body.style.overflow = 'unset';
            }
            // Delay hiding to allow animation
            setTimeout(() => set({ mobileMenuVisible: false }), 300);
        },

        // Close menu on route change and update active navigation
        handleRouteChange: (pathname) => {
            const { mobileMenuOpen, closeMobileMenu, setActiveTap } = get();
            if (mobileMenuOpen) {
                closeMobileMenu();
            }
            // Update active tap based on current pathname
            if (pathname) {
                setActiveTap(pathname);
            }
        },

        // Initialize navigation state based on current pathname
        initializeNavigation: () => {
            if (typeof window !== 'undefined') {
                const pathname = window.location.pathname;
                const { setActiveTap } = get();
                setActiveTap(pathname);
            }
        },

        // Cleanup function for body scroll
        cleanup: () => {
            if (typeof document !== 'undefined') {
                document.body.style.overflow = 'unset';
            }
        },

        // Legacy toggle for backward compatibility
        toggleMobileMenu: () => {
            const { mobileMenuOpen, openMobileMenu, closeMobileMenu } = get();
            if (mobileMenuOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        },

        // Open/close modals
        openModal: (modalName, data = null) => {
            const modals = { ...get().modals };

            // Close all modals first
            Object.keys(modals).forEach(key => {
                modals[key] = false;
            });

            // Special handling for quickView
            if (modalName === 'quickView' && data) {
                modals.quickView = data;
            } else if (modalName !== 'quickView') {
                modals[modalName] = true;
            }

            set({ modals });
        },

        closeModal: (modalName) => {
            const modals = { ...get().modals };

            if (modalName === 'all') {
                Object.keys(modals).forEach(key => {
                    modals[key] = key === 'quickView' ? null : false;
                });
            } else if (modalName === 'quickView') {
                modals.quickView = null;
            } else {
                modals[modalName] = false;
            }

            set({ modals });
        },

        // Add toast notification
        addToast: (toast) => {
            const id = typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const newToast = {
                id,
                type: 'info',
                duration: 5000,
                ...toast
            };

            set(state => ({
                toasts: [...state.toasts, newToast]
            }));

            // Auto-remove toast after duration
            setTimeout(() => {
                get().removeToast(id);
            }, newToast.duration);
        },

        // Remove toast notification
        removeToast: (id) => {
            set(state => ({
                toasts: state.toasts.filter(toast => toast.id !== id)
            }));
        },

        // Set loading state
        setLoading: (area, isLoading) => {
            set(state => ({
                loading: {
                    ...state.loading,
                    [area]: isLoading
                }
            }));
        },

        // Set SEO metadata
        setSeo: (seoData) => {
            if (!seoData || typeof seoData !== 'object') return;

            const state = get();

            // Sanitize and encode input data
            const encodeHtml = (str) => str.replace(/[&<>"']/g, (match) => {
                const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
                return entities[match];
            });

            const sanitizedData = {};
            if (seoData.title && typeof seoData.title === 'string' && /^[a-zA-Z0-9\s\-_.,!?]+$/.test(seoData.title)) {
                sanitizedData.title = encodeHtml(seoData.title.substring(0, 100));
            }
            if (seoData.description && typeof seoData.description === 'string' && /^[a-zA-Z0-9\s\-_.,!?]+$/.test(seoData.description)) {
                sanitizedData.description = encodeHtml(seoData.description.substring(0, 200));
            }
            if (seoData.keywords && typeof seoData.keywords === 'string' && /^[a-zA-Z0-9\s\-_.,!?]+$/.test(seoData.keywords)) {
                sanitizedData.keywords = encodeHtml(seoData.keywords.substring(0, 150));
            }

            set({
                seo: {
                    ...state.seo,
                    ...sanitizedData
                }
            });

            try {
                if (typeof document !== 'undefined' && typeof window !== 'undefined') {
                    // Update document head safely
                    if (sanitizedData.title) {
                        const titleElement = document.getElementsByTagName('title')[0];
                        if (titleElement) {
                            titleElement.textContent = sanitizedData.title + ' | VENEFICUS';
                        } else {
                            document.title = sanitizedData.title + ' | VENEFICUS';
                        }
                    }

                    const description = document.querySelector('meta[name="description"]');
                    if (description && sanitizedData.description) {
                        description.setAttribute('content', sanitizedData.description);
                    }

                    const keywords = document.querySelector('meta[name="keywords"]');
                    if (keywords && sanitizedData.keywords) {
                        keywords.setAttribute('content', sanitizedData.keywords);
                    }
                }
            } catch (error) {

            }
        },

        // Reset SEO to default
        resetSeo: () => {
            const defaultSeo = {
                title: 'VENEFICUS Website',
                description: 'Modern web development toolkit',
                keywords: 'VENEFICUS, web development, toolkit, modern'
            };

            set({ seo: defaultSeo });

            try {
                if (typeof document !== 'undefined' && typeof window !== 'undefined') {
                    document.title = defaultSeo.title;

                    const description = document.querySelector('meta[name="description"]');
                    if (description) {
                        description.setAttribute('content', defaultSeo.description);
                    }

                    const keywords = document.querySelector('meta[name="keywords"]');
                    if (keywords) {
                        keywords.setAttribute('content', defaultSeo.keywords);
                    }
                }
            } catch (error) {

            }
        },

        // Error handling
        setError: (errorInfo) => {
            set({ hasError: true, errorInfo });
        },

        clearError: () => {
            set({ hasError: false, errorInfo: null });
        },

        initializeErrorHandlers: () => {
            if (get().errorHandlersInitialized || typeof window === 'undefined') return;

            const errorHandler = (errorEvent) => {
                if (!errorEvent || (!errorEvent.message && !errorEvent.error)) return;

                const safeErrorInfo = {
                    message: errorEvent?.message || errorEvent?.error?.message || 'Unknown error occurred',
                    filename: errorEvent?.filename || 'Unknown file',
                    lineno: errorEvent?.lineno || 0,
                    colno: errorEvent?.colno || 0,
                    error: errorEvent?.error?.toString() || 'No error details',
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                };

                if (safeErrorInfo.message !== 'Unknown error occurred') {

                }

                get().setError({
                    type: 'JavaScript Error',
                    message: safeErrorInfo.message,
                    timestamp: safeErrorInfo.timestamp
                });
            };

            const unhandledRejectionHandler = (event) => {
                if (!event?.reason ||
                    (typeof event.reason === 'object' && Object.keys(event.reason).length === 0) ||
                    event.reason === null || event.reason === undefined) return;

                const reasonStr = event.reason?.toString() || String(event.reason) || 'Unknown rejection reason';

                if (reasonStr === '{}' || reasonStr === '[object Object]' || reasonStr.trim() === '') return;



                get().setError({
                    type: 'Promise Rejection',
                    message: 'An error occurred while loading data',
                    timestamp: new Date().toISOString()
                });

                if (event?.preventDefault) {
                    event.preventDefault();
                }
            };

            window.addEventListener('error', errorHandler);
            window.addEventListener('unhandledrejection', unhandledRejectionHandler);

            set({ errorHandlersInitialized: true });

            return () => {
                window.removeEventListener('error', errorHandler);
                window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
            };
        },

        // Analytics tracking
        trackNoResultsView: (type, searchTerm, isError) => {
            const analytics = {
                lastSearchTerm: searchTerm || '(empty)',
                lastContentType: type,
                suggestionClicks: get().searchAnalytics.suggestionClicks
            };

            set({ searchAnalytics: analytics });

            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'no_results_view', {
                    'content_type': type,
                    'search_term': searchTerm || '(empty)',
                    'is_error': isError
                });
            }
        },

        trackSuggestionClick: (suggestion, type, searchTerm, onSearchChange, router) => {
            const currentAnalytics = get().searchAnalytics;
            set({
                searchAnalytics: {
                    ...currentAnalytics,
                    suggestionClicks: currentAnalytics.suggestionClicks + 1
                }
            });

            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'no_results_suggestion_click', {
                    'content_type': type,
                    'suggestion': suggestion,
                    'search_term': searchTerm
                });
            }

            if (onSearchChange) {
                onSearchChange(suggestion);
            } else if (router) {
                router.push(`/search?q=${encodeURIComponent(suggestion)}`);
            }
        },

        // Get suggestions based on content type
        getDefaultSuggestions: (type, t) => {
            const suggestions = {
                products: [t('suggestions.jeans'), t('suggestions.jacket'), t('suggestions.womens'), t('suggestions.ripped')],
                orders: [t('suggestions.pending'), t('suggestions.shipped'), t('suggestions.delivered'), t('suggestions.cancelled')],
                content: [t('suggestions.articles'), t('suggestions.tips'), t('suggestions.care'), t('suggestions.designs')]
            };
            return suggestions[type] || suggestions.products;
        },

        // Pagination logic
        calculateVisiblePages: (currentPage, totalPages) => {
            if (totalPages <= 0) return [];

            const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
            const pages = [];
            const maxVisible = 7;

            if (totalPages <= maxVisible) {
                return Array.from({ length: totalPages }, (_, i) => i + 1);
            }

            let start = Math.max(2, safeCurrentPage - 3);
            let end = Math.min(totalPages - 1, safeCurrentPage + 3);

            if (safeCurrentPage <= 4) {
                end = 1 + maxVisible - 2;
            }

            if (safeCurrentPage >= totalPages - 3) {
                start = totalPages - (maxVisible - 2);
            }

            pages.push(1);

            if (start > 2) {
                pages.push('ellipsis-start');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages - 1) {
                pages.push('ellipsis-end');
            }

            if (totalPages > 1) {
                pages.push(totalPages);
            }

            return pages;
        },

        generatePageUrl: (page, baseUrl, filters) => {
            if (page === 1) {
                return baseUrl;
            }

            const params = new URLSearchParams();
            Object.entries(filters || {}).forEach(([key, value]) => {
                if (value) params.set(key, value);
            });

            if (page > 1) params.set('page', page);

            return `${baseUrl}?${params.toString()}`;
        },

        // Locale detection and management
        detectLocale: () => {
            if (typeof window === 'undefined') return 'en';

            // Check Laravel XSRF-TOKEN cookie
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'XSRF-TOKEN') {
                    return value.includes('it') ? 'it' : 'en';
                }
            }

            // Fallback to URL parameter
            const urlLocale = new URLSearchParams(window.location.search).get('lang');
            return urlLocale || 'en';
        },

        setLocale: (locale) => {
            set({ locale });
        },

        initializeLocale: () => {
            const { detectLocale, setLocale } = get();
            const detectedLocale = detectLocale();
            setLocale(detectedLocale);
        },

        // Price formatting with caching
        formatPriceData: (price, compareAtPrice, currency, locale) => {
            const cacheKey = `${price}-${compareAtPrice}-${currency}-${locale}`;
            const cached = get().priceCache.get(cacheKey);

            if (cached) return cached;

            if (isNaN(price) || price < 0) {
                return { error: 'Invalid price' };
            }

            const localeCode = locale === 'it' ? 'it-IT' : 'en-US';

            // Import formatPrice and formatDiscountPercentage dynamically
            const result = {
                formattedPrice: new Intl.NumberFormat(localeCode, {
                    style: 'currency',
                    currency: currency || 'EUR'
                }).format(price),
                formattedComparePrice: null,
                discountPercentage: null
            };

            if (compareAtPrice && !isNaN(compareAtPrice) && compareAtPrice > price) {
                result.formattedComparePrice = new Intl.NumberFormat(localeCode, {
                    style: 'currency',
                    currency: currency || 'EUR'
                }).format(compareAtPrice);

                const discount = ((compareAtPrice - price) / compareAtPrice * 100).toFixed(0);
                result.discountPercentage = discount;
            }

            // Cache the result
            const currentCache = get().priceCache;
            currentCache.set(cacheKey, result);

            // Limit cache size
            if (currentCache.size > 100) {
                const firstKey = currentCache.keys().next().value;
                currentCache.delete(firstKey);
            }

            set({ priceCache: currentCache });
            return result;
        },

        // Sharing functionality
        initializeClient: () => {
            if (typeof window !== 'undefined') {
                set({
                    clientReady: true,
                    currentUrl: window.location.href
                });
            }
        },

        trackShare: (platform, url) => {
            if (typeof window !== 'undefined' && window.gtag) {
                const secureUrl = url.replace(/^http:/, 'https:');
                window.gtag('event', 'share', {
                    method: platform,
                    content_url: secureUrl
                });
            }
        },

        copyToClipboard: async (url, componentId = 'default') => {
            const { trackShare, copiedStates } = get();

            try {
                await navigator.clipboard.writeText(url);

                // Update copied state for this component
                const newCopiedStates = new Map(copiedStates);
                newCopiedStates.set(componentId, true);
                set({ copiedStates: newCopiedStates });

                // Reset after 2 seconds
                setTimeout(() => {
                    const resetStates = new Map(get().copiedStates);
                    resetStates.set(componentId, false);
                    set({ copiedStates: resetStates });
                }, 2000);

                trackShare('copy', url);
                return true;
            } catch (err) {

                return false;
            }
        },

        shareViaSystem: async (data, url) => {
            const { trackShare } = get();

            if (typeof navigator !== 'undefined' && navigator.share) {
                try {
                    await navigator.share({
                        ...data,
                        url: url.replace(/^http:/, 'https:')
                    });
                    trackShare('system', url);
                    return true;
                } catch (err) {

                    return false;
                }
            }
            return false;
        },

        // Navigation management with optimization
        setActiveTap: (activeTap) => {
            const currentState = get();
            if (currentState.activeTap !== activeTap) {
                set({ activeTap });
            }
        },

        setActiveNav: (activeNav) => {
            const currentState = get();
            if (currentState.activeNav !== activeNav) {
                set({ activeNav });
            }
        },

        // Scroll management with optimization
        setScrolled: (scrolled) => {
            const currentState = get();
            if (currentState.scrolled !== scrolled) {
                set({ scrolled });
            }
        },

        initializeScrollListener: () => {
            if (typeof window === 'undefined') return;

            const handleScroll = () => {
                const { setScrolled } = get();
                setScrolled(window.scrollY > 10);
            };

            window.addEventListener('scroll', handleScroll, { passive: true });

            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        },

        // SEO structured data generation
        generateProductCollectionSchema: (products, title, description, url, t) => {
            if (!products?.length) return null;

            return {
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                'name': `${title} - VENEFICUS`,
                'description': description,
                'url': url,
                'mainEntity': {
                    '@type': 'ItemList',
                    'name': title,
                    'itemListElement': products.map((product, index) => ({
                        '@type': 'ListItem',
                        'position': index + 1,
                        'url': `/products/${product.slug}`,
                        'item': {
                            '@type': 'Product',
                            'name': product.name,
                            'image': product.mainImage,
                            'description': product.description?.substring(0, 160) || product.name,
                            'sku': product.sku,
                            'offers': {
                                '@type': 'Offer',
                                'price': product.price,
                                'priceCurrency': 'USD',
                                'availability': product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
                            }
                        }
                    }))
                }
            };
        },

        // Gallery actions
        fetchGallery: async () => {
            const { galleryLoading } = get();
            if (galleryLoading) return;

            set({ galleryLoading: true, galleryError: null });

            try {
                const { apiClient } = await import('@/lib/api-client');
                const { config } = await import('@/lib/config');
                const API_BASE_URL = config.api.baseUrl;

                const response = await apiClient.get('/api/all_gallery');
                const galleryData = response.gallery || response || [];

                const transformedGallery = galleryData.map((item, index) => ({
                    id: item.id || `gallery-${index + 1}`,
                    src: item.image ? `${API_BASE_URL}/${item.image}` : item.src,
                    alt: item.alt || item.description || `Gallery image ${index + 1}`
                }));

                set({ gallery: transformedGallery, galleryLoading: false });
            } catch (error) {
                console.error('Failed to fetch gallery:', error);
                set({ galleryError: 'Failed to load gallery images', galleryLoading: false });
            }
        },

        resetGallery: () => set({ gallery: [], galleryLoading: false, galleryError: null }),


    }),
    {
        name: 'ui-storage',
        partialize: (state) => ({
            theme: state.theme,
            isDarkMode: state.isDarkMode,
            activeNav: state.activeNav,
            activeTap: state.activeTap
            // Note: scrolled state is intentionally excluded from persistence
        }),
    }
));