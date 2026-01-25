/**
 * Unified Product Service - Single source of truth for all product operations
 * Handles caching, API calls, and data normalization
 */

import { cache } from "react";
import { apiClient } from "@/lib/api-client";
import { unhashId } from "@/lib/hash";

const processProduct = (rawProduct) => {
  return {
    ...rawProduct,
    id: parseInt(rawProduct.id),
    price: parseFloat(rawProduct.price || 0),
    discounted_price: rawProduct.discounted_price ? parseFloat(rawProduct.discounted_price) : null,
    has_discount: parseInt(rawProduct.has_discount || 0),
    inStock: (rawProduct.product_variant_sum_stock || 0) > 0,
    slug: rawProduct.slug || rawProduct.name?.toLowerCase().replace(/\s+/g, "-") || `product-${rawProduct.id}`,
    image_3d: rawProduct.image_3d || null,
  };
};

export const productService = {
  getProducts: cache(async (params = {}) => {
    try {
      const page = Math.max(1, params.page || 1);
      const limit = Math.min(100, Math.max(1, params.limit || 12));
      const offset = (page - 1) * limit;

      const result = await apiClient.products.getAll();
      const products = Array.isArray(result) ? result : result?.products || result?.data || [];
      const total = products.length;
      const paginatedProducts = products.slice(offset, offset + limit);

      return {
        products: paginatedProducts.map(processProduct),
        total,
        page,
        limit,
        hasMore: offset + limit < total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        products: [],
        total: 0,
        page: 1,
        limit: 12,
        hasMore: false,
        totalPages: 0,
      };
    }
  }),

  getProductBySlug: cache(async (slug) => {
    let allProducts;
    try {
      const unhashedId = unhashId(slug);
      allProducts = await productService.getProducts();
      const product = allProducts.products.find(
        (p) =>
          p.slug === slug ||
          p.id?.toString() === slug?.toString() ||
          p.id?.toString() === unhashedId
      );

      if (product) {
        return processProduct(product);
      }

      throw new Error("Product not found");
    } catch (error) {
      throw new Error("Product not found");
    }
  }),

  getFeaturedProducts: cache(async (limit = 4) => {
    const result = await productService.getProducts({ featured: true, limit });
    return result.products.slice(0, limit);
  }),

  getBestSellingProducts: cache(async (limit = 4) => {
    try {
      const data = await apiClient.get('/api/best_seller');
      const products = Array.isArray(data) ? data : data.products || [];
      return products.map(processProduct).slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch best sellers:', error);
      return [];
    }
  }),

  getNewArrivals: cache(async (limit = 4) => {
    const result = await productService.getProducts();
    const newArrivals = result.products.filter(product => product.new_arrival === 1);
    return newArrivals.slice(0, limit);
  }),

  searchProducts: cache(async (query, options = {}) => {
    try {
      const result = await apiClient.get("/api/products/search", {
        query,
        ...options,
      });
      return (result.products || result).map(processProduct);
    } catch (error) {
      return [];
    }
  }),

  getRelatedProducts: cache(async (productId, limit = 4) => {
    try {
      const result = await apiClient.get(`/api/products/${productId}/related`, {
        limit,
      });
      return (result.products || result).map(processProduct);
    } catch (error) {
      return [];
    }
  }),

  getCategories: cache(async () => {
    try {
      return await apiClient.get("/api/categories");
    } catch (error) {
      return [
        { id: "1", name: "Men", slug: "men" },
        { id: "2", name: "Women", slug: "women" },
        { id: "3", name: "Accessories", slug: "accessories" },
      ];
    }
  }),

  getCollections: cache(async () => {
    try {
      return await apiClient.get("/api/collections");
    } catch (error) {
      return [
        { id: "1", name: "New Arrivals", slug: "new-arrivals" },
        { id: "2", name: "Best Sellers", slug: "best-sellers" },
        { id: "3", name: "Sale", slug: "sale" },
      ];
    }
  }),

  getCollectionBySlug: cache(async (slug) => {
    try {
      return await apiClient.get(`/api/collections/${slug}`);
    } catch (error) {
      throw new Error("Collection not found");
    }
  }),

  getProductsByCollection: cache(async (slug) => {
    try {
      const result = await apiClient.get(`/api/collections/${slug}/products`);
      return (result.products || result).map(processProduct);
    } catch (error) {
      return [];
    }
  }),

  getProductsByCategory: cache(async (categoryName) => {
    try {
      const allProducts = await productService.getProducts();
      const filtered = allProducts.products.filter((product) => {
        const productCategory = product.category;
        if (!productCategory) return false;

        const categoryStr =
          typeof productCategory === "string"
            ? productCategory
            : productCategory.name;
        const matches =
          categoryStr?.toLowerCase() === categoryName.toLowerCase();

        return matches;
      });

      return filtered;
    } catch (error) {
      return [];
    }
  }),
};
