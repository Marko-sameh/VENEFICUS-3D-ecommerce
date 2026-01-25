'use client'

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { productService } from '@/services/products';
import { validateProduct } from '@/lib/validations';

export const useProductsStore = create(persist(
  (set, get) => ({
    products: [],
    categories: [],
    collections: [],
    featuredProducts: [],
    newArrivals: [],
    bestSellers: [],
    loading: {
      products: false,
      categories: false,
      collections: false,
      featured: false,
      newArrivals: false,
      bestSellers: false
    },
    error: null,
    ui: {
      openCategories: {},
      activeCategory: null
    },
    filters: {
      category: null,
      collection: null,
      priceRange: [0, 1000],
      colors: [],
      sizes: [],
      availability: '',
      priceMin: undefined,
      priceMax: undefined,
      sort: 'name-az'
    },
    filterUI: {
      isOpen: false,
      priceValue: [0, 1000]
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 12
    },
    // 3D Model states
    model3D: {
      selectedColor: '#4a90e2',
      modelSize: 4,
      isLoading: false,
      loadError: null,
      currentProduct: null,
      isClient: false,
      availableColors: [],
      availableSizes: []
    },

    // Fetch all products with filters and pagination
    fetchProducts: async (filters = {}, page = 1, itemsPerPage = 12) => {
      set(state => ({
        loading: { ...state.loading, products: true },
        error: null
      }));

      try {
        const result = await productService.getProducts({ ...filters, page, limit: itemsPerPage });

        set({
          products: result.products || [],
          pagination: {
            currentPage: page,
            totalPages: Math.ceil((result.total || 0) / itemsPerPage),
            itemsPerPage
          },
          loading: { ...get().loading, products: false }
        });
      } catch (error) {
        set({
          error: error.message,
          loading: { ...get().loading, products: false }
        });
      }
    },

    // Fetch single product by slug
    fetchProductBySlug: async (slug) => {
      set(state => ({
        loading: { ...state.loading, products: true },
        error: null
      }));

      try {
        const product = await productService.getProductBySlug(slug);

        // Update products array if product exists, otherwise add it
        const existingProducts = get().products;
        const productIndex = existingProducts.findIndex(p => p.id === product.id);

        let updatedProducts;
        if (productIndex >= 0) {
          updatedProducts = existingProducts.map((p, index) =>
            index === productIndex ? product : p
          );
        } else {
          updatedProducts = [...existingProducts, product];
        }

        set({
          products: updatedProducts,
          loading: { ...get().loading, products: false }
        });

        return product;
      } catch (error) {
        set({
          error: error.message,
          loading: { ...get().loading, products: false }
        });
        throw error;
      }
    },

    // Fetch categories with fallback to mock data
    fetchCategories: async () => {
      const state = get();
      if (state.categories.length > 0 && !state.loading.categories) {
        return state.categories;
      }

      set(state => ({
        loading: { ...state.loading, categories: true },
        error: null
      }));

      try {
        let categories;
        try {
          categories = await productService.getCategories();
        } catch (apiError) {
          // Fallback to mock data if API fails
          categories = [
            {
              id: '1',
              name: 'Men',
              slug: 'men',
              children: [
                { id: '1-1', name: 'Jeans', slug: 'men/jeans' },
                { id: '1-2', name: 'Jackets', slug: 'men/jackets' },
                { id: '1-3', name: 'T-Shirts', slug: 'men/tshirts' }
              ]
            },
            {
              id: '2',
              name: 'Women',
              slug: 'women',
              children: [
                { id: '2-1', name: 'Jeans', slug: 'women/jeans' },
                { id: '2-2', name: 'Dresses', slug: 'women/dresses' },
                { id: '2-3', name: 'Tops', slug: 'women/tops' }
              ]
            },
            {
              id: '3',
              name: 'Accessories',
              slug: 'accessories',
              children: [
                { id: '3-1', name: 'Belts', slug: 'accessories/belts' },
                { id: '3-2', name: 'Hats', slug: 'accessories/hats' },
                { id: '3-3', name: 'Bags', slug: 'accessories/bags' }
              ]
            }
          ];
        }

        set({
          categories,
          loading: { ...get().loading, categories: false }
        });
        return categories;
      } catch (error) {
        set({
          error: error?.message || 'Unable to load product categories',
          loading: { ...get().loading, categories: false }
        });
        throw error;
      }
    },

    // Fetch collections
    fetchCollections: async () => {
      set(state => ({
        loading: { ...state.loading, collections: true },
        error: null
      }));

      try {
        const collections = await productService.getCollections();
        set({
          collections,
          loading: { ...get().loading, collections: false }
        });
      } catch (error) {
        set({
          error: error.message,
          loading: { ...get().loading, collections: false }
        });
      }
    },

    // Fetch featured products
    fetchFeaturedProducts: async () => {
      set(state => ({
        loading: { ...state.loading, featured: true },
        error: null
      }));

      try {
        const featuredProducts = await productService.getFeaturedProducts();
        set({
          featuredProducts,
          loading: { ...get().loading, featured: false }
        });
      } catch (error) {
        set({
          error: error.message,
          loading: { ...get().loading, featured: false }
        });
      }
    },

    // Fetch new arrivals
    fetchNewArrivals: async () => {
      set(state => ({
        loading: { ...state.loading, newArrivals: true },
        error: null
      }));

      try {
        const newArrivals = await productService.getNewArrivals();
        set({
          newArrivals,
          loading: { ...get().loading, newArrivals: false }
        });
      } catch (error) {
        set({
          error: error.message,
          loading: { ...get().loading, newArrivals: false }
        });
      }
    },

    // Fetch best sellers
    fetchBestSellers: async () => {
      set(state => ({
        loading: { ...state.loading, bestSellers: true },
        error: null
      }));

      try {
        const bestSellers = await productService.getBestSellingProducts();
        set({
          bestSellers,
          loading: { ...get().loading, bestSellers: false }
        });
      } catch (error) {
        set({
          error: error.message,
          loading: { ...get().loading, bestSellers: false }
        });
      }
    },

    // Filter options (memoized)
    getFilterOptions: () => {
      const { products } = get();

      // Calculate real availability counts from products
      const inStockCount = products.filter(p => (p.product_variant_sum_stock || 0) > 0).length;
      const outOfStockCount = products.filter(p => (p.product_variant_sum_stock || 0) === 0).length;


      return {
        availability: [
          { value: 'in_stock', label: 'In Stock', count: inStockCount },
          { value: 'out_of_stock', label: 'Out of Stock', count: outOfStockCount }
        ],
        priceRanges: [
          { value: '0-50', label: 'Under $50', min: 0, max: 50 },
          { value: '50-100', label: '$50 - $100', min: 50, max: 100 },
          { value: '100-200', label: '$100 - $200', min: 100, max: 200 },
          { value: '200-500', label: '$200 - $500', min: 200, max: 500 },
          { value: '500+', label: 'Over $500', min: 500, max: 1000 }
        ]
      };
    },

    // Apply product filters and sorting
    getFilteredProducts: (products = []) => {
      const { filters } = get();

      if (!products.length) return [];

      let filtered = [...products];

      // Apply availability filter
      if (filters.availability && filters.availability !== '') {
        filtered = filtered.filter(product => {
          const isInStock = (product.product_variant_sum_stock || 0) > 0;
          return filters.availability === 'in_stock' ? isInStock : !isInStock;
        });
      }

      // Apply price range filter
      if (filters.priceRange && filters.priceRange !== '') {
        filtered = filtered.filter(product => {
          const price = product.discounted_price ? product.discounted_price : product.price;
          switch (filters.priceRange) {
            case '0-50': return price < 50;
            case '50-100': return price >= 50 && price < 100;
            case '100-200': return price >= 100 && price < 200;
            case '200-500': return price >= 200 && price < 500;
            case '500+': return price >= 500;
            default: return true;
          }
        });
      }

      // Apply sorting
      if (filters.sort) {

        switch (filters.sort) {
          case 'price-low':
            filtered.sort((a, b) => (a.discounted_price ? a.discounted_price : a.price) - (b.discounted_price ? b.discounted_price : b.price));
            break;
          case 'price-high':
            filtered.sort((a, b) => (b.discounted_price ? b.discounted_price : b.price) - (a.discounted_price ? a.discounted_price : a.price))
            break;
          case 'name-az':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-za':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
          default:
            break;
        }
      }

      return filtered;
    },

    // Handle filter change
    handleFilterChange: (filterType, value) => {
      set(state => {
        const newFilters = { ...state.filters, [filterType]: value };
        return { filters: newFilters };
      });
    },

    // Handle price range selection
    handlePriceRangeSelect: (range) => {
      set(state => ({
        filters: {
          ...state.filters,
          priceMin: range.min,
          priceMax: range.max,
          priceRange: range.value
        },
        filterUI: {
          ...state.filterUI,
          priceValue: [range.min, range.max]
        }
      }));
    },

    // Clear all filters
    clearAllFilters: (priceRange = { min: 0, max: 1000 }) => {
      set({
        filters: {
          category: null,
          collection: null,
          priceRange: [],
          colors: [],
          sizes: [],
          availability: '',
          priceMin: undefined,
          priceMax: undefined,
          sort: 'name-az'
        },
        filterUI: {
          isOpen: false,
          priceValue: []
        }
      });
    },

    // Get active filters count
    getActiveFiltersCount: () => {
      const { filters } = get();
      let count = 0;
      
      // Count availability filter
      if (filters.availability && filters.availability !== '') {
        count += 1;
      }
      
      // Count price range filter
      if (filters.priceRange && filters.priceRange !== '') {
        count += 1;
      }
      
      // Count other filters (colors, sizes, category, collection)
      if (filters.colors && Array.isArray(filters.colors) && filters.colors.length > 0) {
        count += 1;
      }
      if (filters.sizes && Array.isArray(filters.sizes) && filters.sizes.length > 0) {
        count += 1;
      }
      if (filters.category && filters.category !== null) {
        count += 1;
      }
      if (filters.collection && filters.collection !== null) {
        count += 1;
      }
      
      return count;
    },

    // Get current availability label
    getCurrentAvailabilityLabel: () => {
      const { filters } = get();
      const options = get().getFilterOptions();
      const current = options.availability.find(item => item.value === filters.availability);
      return current ? current.label : 'Availability';
    },

    // Get current price label
    getCurrentPriceLabel: () => {
      const { filters } = get();
      if (filters.priceRange) {
        const options = get().getFilterOptions();
        const current = options.priceRanges.find(range => range.value === filters.priceRange);
        return current ? current.label : 'Price';
      }
      return 'Price';
    },

    // Set filter UI state
    setFilterUIOpen: (isOpen) => {
      set(state => ({
        filterUI: { ...state.filterUI, isOpen }
      }));
    },

    // Set filters
    setFilters: (filters) => {
      set({ filters });
      get().fetchProducts(filters, 1);
    },

    // Reset filters
    resetFilters: () => {
      get().clearAllFilters();
      get().fetchProducts({}, 1);
    },

    // Set page
    setPage: (page) => {
      const { filters, pagination: { itemsPerPage } } = get();
      get().fetchProducts(filters, page, itemsPerPage);
    },

    // Search products
    searchProducts: async (query) => {
      set(state => ({
        loading: { ...state.loading, products: true },
        error: null
      }));

      try {
        const products = await productService.searchProducts(query);
        set({
          products,
          loading: { ...get().loading, products: false }
        });
        return products;
      } catch (error) {
        set({
          error: error.message,
          loading: { ...get().loading, products: false }
        });
        throw error;
      }
    },

    // Fetch products by category name
    fetchProductsByCategory: async (categoryName) => {
      set(state => ({
        loading: { ...state.loading, products: true },
        error: null
      }));

      try {
        const products = await productService.getProductsByCategory(categoryName);
        set({
          products,
          loading: { ...get().loading, products: false }
        });
        return products;
      } catch (error) {
        set({
          error: error.message,
          loading: { ...get().loading, products: false }
        });
        throw error;
      }
    },



    // 3D Model actions
    setSelectedColor: (color) => {
      set(state => {
        if (state.model3D.selectedColor === color) return state;
        return {
          model3D: {
            ...state.model3D,
            selectedColor: color
          }
        };
      });
    },

    setModelSize: (size) => {
      set(state => {
        if (state.model3D.modelSize === size) return state;
        return {
          model3D: {
            ...state.model3D,
            modelSize: size
          }
        };
      });
    },

    // Initialize client state and colors
    initializeClient: (colors = [], sizes = []) => {
      set(state => {
        // Prevent unnecessary updates
        if (state.model3D.isClient &&
          colors.length === state.model3D.availableColors.length &&
          sizes.length === state.model3D.availableSizes.length) {
          return state;
        }

        const updates = {
          model3D: {
            ...state.model3D,
            isClient: true,
            availableColors: colors,
            availableSizes: sizes
          }
        };

        // Auto-select first color only if still default and colors available
        if (colors.length > 0 && state.model3D.selectedColor === '#4a90e2') {
          updates.model3D.selectedColor = colors[0].hex;
        }

        // Auto-select default size only if sizes available and not already set
        if (sizes.length > 0 && state.model3D.modelSize === 4) {
          const defaultSize = sizes.find(s => s.name === 'M') || sizes[0];
          const sizeMap = { 'S': 3, 'M': 4, 'L': 5, 'XL': 6 };
          updates.model3D.modelSize = sizeMap[defaultSize.name] || 4;
        }

        return updates;
      });
    },

    // Optimized color selection with validation
    selectColor: (colorHex) => {
      set(state => {
        if (!colorHex || state.model3D.selectedColor === colorHex) return state;

        return {
          model3D: {
            ...state.model3D,
            selectedColor: colorHex
          }
        };
      });
    },

    // Optimized size selection with model size mapping
    selectSize: (sizeName) => {
      set(state => {
        if (!sizeName) return state;

        const sizeMap = { 
          'XS': 1, 'xs': 1,
          'S': 3, 's': 3, 'Small': 3, 'small': 3,
          'M': 4, 'm': 4, 'Medium': 4, 'medium': 4,
          'L': 5, 'l': 5, 'Large': 5, 'large': 5,
          'XL': 6, 'xl': 6, 'X-Large': 6, 'x-large': 6,
          'XXL': 7, 'xxl': 7, '2XL': 7, '2xl': 7
        };
        const modelSize = sizeMap[sizeName] || sizeMap[sizeName?.toUpperCase()] || 4;

        if (state.model3D.modelSize === modelSize) return state;

        return {
          model3D: {
            ...state.model3D,
            modelSize
          }
        };
      });
    },

    setModel3DLoading: (loading) => {
      set(state => ({
        model3D: {
          ...state.model3D,
          isLoading: loading
        }
      }))
    },

    setModel3DError: (error) => {
      set(state => ({
        model3D: {
          ...state.model3D,
          loadError: error
        }
      }))
    },

    setCurrentProduct: (product) => {
      set(state => ({
        model3D: {
          ...state.model3D,
          currentProduct: product,
          selectedColor: product?.defaultColor || state.model3D.selectedColor,
          modelSize: product?.modelSize || state.model3D.modelSize
        }
      }))
    },

    resetModel3D: () => {
      set(state => ({
        model3D: {
          ...state.model3D,
          selectedColor: '#4a90e2',
          modelSize: 4,
          isLoading: false,
          loadError: null,
          currentProduct: null,
          isClient: false,
          availableColors: [],
          availableSizes: []
        }
      }));
    },

    // Category UI actions
    toggleCategory: (categoryId) => {
      set(state => ({
        ui: {
          ...state.ui,
          openCategories: {
            ...state.ui.openCategories,
            [categoryId]: !state.ui.openCategories[categoryId]
          }
        }
      }));
    },

    setActiveCategory: (categoryPath) => {
      set(state => ({
        ui: {
          ...state.ui,
          activeCategory: categoryPath
        }
      }));
    },



    // Clear error state
    clearError: () => set({ error: null }),
  }),
  {
    name: 'products-storage',
    partialize: (state) => ({
      filters: state.filters,
      pagination: state.pagination,
      model3D: {
        selectedColor: state.model3D.selectedColor,
        modelSize: state.model3D.modelSize,
        isClient: state.model3D.isClient
      },
      filterUI: state.filterUI,
      ui: {
        openCategories: state.ui.openCategories
      }
    })
  }
));