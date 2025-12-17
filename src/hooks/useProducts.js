"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useProductsStore } from "@/store/productsStore";
import { useDebounce } from "./useDebounce";
import { usePathname } from "next/navigation";
import { productService } from "@/services/products";

export const useProducts = () => {
  const store = useProductsStore();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery) {
      handleSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, handleSearch]);

  const handleSearch = useCallback(async (query) => {
    try {
      await store.searchProducts(query);
    } catch (error) {
      
    }
  }, [store]);

  const fetchProducts = useCallback(async (filters = {}, page = 1, itemsPerPage = 12) => {
    try {
      await store.fetchProducts(filters, page, itemsPerPage);
    } catch (error) {
      
    }
  }, [store.fetchProducts]);

  const fetchProductBySlug = useCallback(async (slug) => {
    try {
      return await store.fetchProductBySlug(slug);
    } catch (error) {
      
      throw error;
    }
  }, [store.fetchProductBySlug]);

  const setInitialData = (data) => {
    useProductsStore.setState({
      categories: data.categories || store.categories,
      featuredProducts: data.featuredProducts || store.featuredProducts,
      bestSellers: data.bestSellers || store.bestSellers,
      newArrivals: data.newArrivals || store.newArrivals,
    });
  };

  // Category helpers
  const toggleCategory = useCallback((categoryId) => {
    store.toggleCategory(categoryId);
  }, [store.toggleCategory]);

  const isActiveCategory = useCallback((categoryPath) => {
    return pathname?.startsWith(`/shop/categories/${categoryPath}`) || false;
  }, [pathname]);

  // Memoized selectors
  const featuredCategories = useMemo(() => {
    if (!store.categories?.length) return [];
    
    const featured = store.categories
      .filter(category => category.isFeatured)
      .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
    
    return featured.length > 0 ? featured : store.categories.slice(0, 6);
  }, [store.categories]);

  const categoriesWithActiveState = useMemo(() => {
    return store.categories.map(category => ({
      ...category,
      isActive: isActiveCategory(category.slug),
      isOpen: store.ui.openCategories[category.id] || false
    }));
  }, [store.categories, store.ui.openCategories, isActiveCategory]);

  // Individual product operations
  const getCurrentProduct = () => {
    return store.model3D.currentProduct || null;
  };

  const loadProduct = async (slug) => {
    store.setModel3DLoading(true);
    store.setModel3DError(null);
    
    try {
      const product = await fetchProductBySlug(slug);
      store.setCurrentProduct(product);
      return product;
    } catch (err) {
      store.setModel3DError(err.message);
      throw err;
    } finally {
      store.setModel3DLoading(false);
    }
  };

  const updateColor = useCallback((color) => {
    if (color && typeof color === 'string') {
      store.selectColor(color);
    }
  }, [store.selectColor]);

  const updateSize = useCallback((sizeName) => {
    if (sizeName && typeof sizeName === 'string') {
      store.selectSize(sizeName);
    }
  }, [store.selectSize]);

  const initializeClient = useCallback((colors = [], sizes = []) => {
    store.initializeClient(colors, sizes);
  }, [store.initializeClient]);

  // Stable getFilteredProducts function
  const getFilteredProductsCallback = useCallback((products) => {
    return store.getFilteredProducts(products);
  }, [store.getFilteredProducts]);

  // Filtered products selector
  const filteredProducts = useMemo(() => {
    return store.getFilteredProducts(store.products);
  }, [store.products, store.filters, store.getFilteredProducts]);



  return {
    // State
    products: store.products,
    filteredProducts,
    featuredProducts: store.featuredProducts,
    bestSellers: store.bestSellers,
    newArrivals: store.newArrivals,
    categories: store.categories,
    categoriesWithActiveState,
    featuredCategories,
    collections: store.collections,
    loading: store.loading,
    error: store.error,
    filters: store.filters,
    pagination: store.pagination,
    model3D: store.model3D,
    ui: store.ui,
    
    // Individual product (from useProduct)
    product: getCurrentProduct(),
    selectedColor: store.model3D.selectedColor,
    modelSize: store.model3D.modelSize,
    isClient: store.model3D.isClient,
    availableColors: store.model3D.availableColors,
    availableSizes: store.model3D.availableSizes,
    isLoading: store.model3D.isLoading || store.loading.products,
    loadError: store.model3D.loadError || store.error,
    
    // Actions
    fetchProducts,
    fetchProductBySlug,
    fetchCategories: store.fetchCategories,
    fetchCollections: store.fetchCollections,
    fetchFeaturedProducts: store.fetchFeaturedProducts,
    fetchBestSellers: store.fetchBestSellers,
    fetchNewArrivals: store.fetchNewArrivals,
    setFilters: store.setFilters,
    resetFilters: store.resetFilters,
    setPage: store.setPage,
    clearError: store.clearError,
    searchProducts: store.searchProducts,
    fetchProductsByCategory: store.fetchProductsByCategory,
    setInitialData,
    
    // Filter actions
    filterOptions: store.getFilterOptions(),
    filterUI: store.filterUI,
    handleFilterChange: store.handleFilterChange,
    handlePriceRangeSelect: store.handlePriceRangeSelect,
    clearAllFilters: store.clearAllFilters,
    getActiveFiltersCount: store.getActiveFiltersCount,
    getCurrentAvailabilityLabel: store.getCurrentAvailabilityLabel,
    getCurrentPriceLabel: store.getCurrentPriceLabel,
    setFilterUIOpen: store.setFilterUIOpen,
    getFilteredProducts: getFilteredProductsCallback,
    
    // Category actions
    toggleCategory,
    isActiveCategory,
    setActiveCategory: store.setActiveCategory,
    
    // Individual product actions
    loadProduct,
    updateColor,
    updateSize,
    initializeClient,
    resetModel: store.resetModel3D,
    
    // 3D Model actions
    setSelectedColor: store.setSelectedColor,
    setModelSize: store.setModelSize,
    selectColor: store.selectColor,
    selectSize: store.selectSize,
    setModel3DLoading: store.setModel3DLoading,
    setModel3DError: store.setModel3DError,
    setCurrentProduct: store.setCurrentProduct,
    resetModel3D: store.resetModel3D,
    

    
    // Search
    searchQuery,
    setSearchQuery,
    isSearching: searchQuery !== "" && searchQuery === debouncedSearchQuery
  };
};


