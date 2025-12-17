// // src/services/categoryService.js

// // بيانات مؤقتة للمجموعات
// const collections = [
//   {
//     id: 1,
//     name: "Summer 2024 Collection",
//     slug: "summer-2024",
//     description: "Lightweight VENEFICUS pieces designed for warm weather",
//     image:
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     featuredProducts: 8,
//   },
//   {
//     id: 2,
//     name: "Heritage Collection",
//     slug: "heritage",
//     description: "Timeless VENEFICUS classics inspired by vintage designs",
//     image:
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     featuredProducts: 12,
//   },
//   {
//     id: 3,
//     name: "Sustainable Line",
//     slug: "sustainable",
//     description:
//       "Eco-friendly VENEFICUS made with organic cotton and recycled materials",
//     image:
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     featuredProducts: 9,
//   },
//   {
//     id: 4,
//     name: "Collaborations",
//     slug: "collaborations",
//     description: "Exclusive partnerships with renowned designers and artists",
//     image:
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     featuredProducts: 6,
//   },
//   {
//     id: 5,
//     name: "Limited Edition",
//     slug: "limited-edition",
//     description: "Small-batch releases with unique details and finishes",
//     image:
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     featuredProducts: 4,
//   },
// ];

// // بيانات مؤقتة للمنتجات
// const products = [
//   {
//     id: 1,
//     name: "Summer Lightweight Jeans",
//     slug: "summer-lightweight-jeans",
//     description: "Breathable cotton blend perfect for warm weather",
//     price: 299,
//     images: [
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     ],
//     mainImage:
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     collection: "summer-2024",
//     inStock: true,
//   },
//   {
//     id: 2,
//     name: "Heritage Classic Fit",
//     slug: "heritage-classic-fit",
//     description: "Timeless design inspired by vintage denim",
//     price: 449,
//     images: [
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     ],
//     mainImage:
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     collection: "heritage",
//     inStock: true,
//   },
//   {
//     id: 3,
//     name: "Organic Cotton Jeans",
//     slug: "organic-cotton-jeans",
//     description: "Made with 100% organic cotton and recycled materials",
//     price: 399,
//     images: [
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     ],
//     mainImage:
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     collection: "sustainable",
//     inStock: true,
//   },
//   {
//     id: 4,
//     name: "Artist Collaboration Piece",
//     slug: "artist-collaboration-piece",
//     description: "Exclusive design created with renowned artist",
//     price: 599,
//     images: [
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     ],
//     mainImage:
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     collection: "collaborations",
//     inStock: true,
//   },
//   {
//     id: 5,
//     name: "Limited Edition Raw Denim",
//     slug: "limited-edition-raw-denim",
//     description: "Small-batch premium raw denim with unique finishing",
//     price: 799,
//     images: [
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     ],
//     mainImage:
//       "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
//     collection: "limited-edition",
//     inStock: true,
//   },
// ];

// export async function getCollectionBySlug(slug) {
//   // محاكاة استدعاء API
//   await new Promise((resolve) => setTimeout(resolve, 100));
//   return collections.find((collection) => collection.slug === slug) || null;
// }

// export async function getProductsByCollection(collectionSlug) {
//   // محاكاة استدعاء API
//   await new Promise((resolve) => setTimeout(resolve, 100));
//   return products.filter((product) => product.collection === collectionSlug);
// }

// export async function getAllCollections() {
//   await new Promise((resolve) => setTimeout(resolve, 100));
//   return collections;
// }

// export async function getAllProducts() {
//   await new Promise((resolve) => setTimeout(resolve, 100));
//   return products;
// }

// import axios from "axios";
// import { API_ENDPOINTS } from "@/lib/endpoints";
// import { getAuthToken } from "@/lib/storage";
// import { API_BASE_URL, API_TIMEOUT } from "@/lib/constants";

// /**
//  * Category service for handling category-related API requests
//  * Provides methods for fetching categories, products by category, etc.
//  * Implements proper error handling and authentication
//  */

// /**
//  * Create axios instance for category API requests
//  */
// const createCategoryApiClient = () => {
//   const token = getAuthToken();

//   return axios.create({
//     baseURL: API_BASE_URL,
//     timeout: API_TIMEOUT,
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//     },
//   });
// };

// /**
//  * Fetch all categories
//  * @returns {Promise<Array>} Array of category objects
//  */
// export const getAllCategories = async () => {
//   try {
//     const apiClient = createCategoryApiClient();
//     const response = await apiClient.get(API_ENDPOINTS.CATEGORY.ALL);

//     return response.data;
//   } catch (error) {
//     
//     throw new Error(
//       error.response?.data?.message ||
//         "Failed to load categories. Please try again later."
//     );
//   }
// };

// /**
//  * Fetch a single category by ID
//  * @param {string} categoryId - Category ID
//  * @returns {Promise<Object>} Category object
//  */
// export const getCategoryById = async (categoryId) => {
//   try {
//     const apiClient = createCategoryApiClient();
//     const response = await apiClient.get(
//       API_ENDPOINTS.CATEGORY.BY_ID.replace(":id", categoryId)
//     );

//     return response.data;
//   } catch (error) {
//     
//     throw new Error(
//       error.response?.data?.message ||
//         "Failed to load category. Please try again later."
//     );
//   }
// };

// /**
//  * Fetch a single category by slug
//  * @param {string} slug - Category slug
//  * @returns {Promise<Object>} Category object
//  */
// export const getCategoryBySlug = async (slug) => {
//   try {
//     const apiClient = createCategoryApiClient();
//     const response = await apiClient.get(
//       API_ENDPOINTS.CATEGORY.BY_SLUG.replace(":slug", slug)
//     );

//     return response.data;
//   } catch (error) {
//     
//     throw new Error(
//       error.response?.data?.message ||
//         "Failed to load category. Please try again later."
//     );
//   }
// };

// /**
//  * Fetch products by category ID
//  * @param {string} categoryId - Category ID
//  * @param {Object} params - Query parameters (page, limit, sort, etc.)
//  * @returns {Promise<Object>} Paginated products response
//  */
// export const getProductsByCategoryId = async (categoryId, params = {}) => {
//   try {
//     const apiClient = createCategoryApiClient();
//     const response = await apiClient.get(
//       API_ENDPOINTS.CATEGORY.PRODUCTS_BY_ID.replace(":id", categoryId),
//       { params }
//     );

//     return response.data;
//   } catch (error) {
//     
//     throw new Error(
//       error.response?.data?.message ||
//         "Failed to load products. Please try again later."
//     );
//   }
// };

// /**
//  * Fetch products by category slug
//  * @param {string} slug - Category slug
//  * @param {Object} params - Query parameters (page, limit, sort, etc.)
//  * @returns {Promise<Object>} Paginated products response
//  */
// export const getProductsByCategorySlug = async (slug, params = {}) => {
//   try {
//     const apiClient = createCategoryApiClient();
//     const response = await apiClient.get(
//       API_ENDPOINTS.CATEGORY.PRODUCTS_BY_SLUG.replace(":slug", slug),
//       { params }
//     );

//     return response.data;
//   } catch (error) {
//     
//     throw new Error(
//       error.response?.data?.message ||
//         "Failed to load products. Please try again later."
//     );
//   }
// };

// /**
//  * Get featured categories
//  * @returns {Promise<Array>} Array of featured category objects
//  */
// export const getFeaturedCategories = async () => {
//   try {
//     const apiClient = createCategoryApiClient();
//     const response = await apiClient.get(API_ENDPOINTS.CATEGORY.FEATURED);

//     return response.data;
//   } catch (error) {
//     
//     throw new Error(
//       error.response?.data?.message ||
//         "Failed to load featured categories. Please try again later."
//     );
//   }
// };

// /**
//  * Get category tree (hierarchical structure)
//  * @returns {Promise<Array>} Array of category tree nodes
//  */
// export const getCategoryTree = async () => {
//   try {
//     const apiClient = createCategoryApiClient();
//     const response = await apiClient.get(API_ENDPOINTS.CATEGORY.TREE);

//     return response.data;
//   } catch (error) {
//     
//     throw new Error(
//       error.response?.data?.message ||
//         "Failed to load category structure. Please try again later."
//     );
//   }
// };

import { API_ENDPOINTS, getApiUrl } from "@/lib/endpoints";
import { getAuthToken } from "@/lib/storage";
import {
  getCsrfToken,
  retryWithBackoff,
  validateId,
  sanitizeInput,
  createSecureFetchOptions,
  createNormalizedError,
} from "@/lib/security";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";

// SAMPLE DATA - Remove in production
const MOCK_CATEGORIES = [
  {
    id: "cat-001",
    name: "Men's Jeans",
    slug: "mens-jeans",
    description: "Premium men's denim collection",
    image:
      "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
    productCount: 25,
  },
  {
    id: "cat-002",
    name: "Women's Jeans",
    slug: "womens-jeans",
    description: "Stylish women's denim collection",
    image:
      "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
    productCount: 30,
  },
];

// Temporary mockup collections data
const TEMP_COLLECTIONS = [
  {
    id: "col-001",
    name: "Premium Denim",
    slug: "premium-denim",
    description: "Our finest collection of premium denim pieces",
    image:
      "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
    productCount: 15,
  },
  {
    id: "col-002",
    name: "Classic Collection",
    slug: "classic-collection",
    description: "Timeless denim styles for every occasion",
    image:
      "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
    productCount: 20,
  },
  {
    id: "col-003",
    name: "Summer 2024",
    slug: "summer-2024",
    description: "Lightweight denim perfect for warm weather",
    image:
      "https://essecdenim.com/cdn/shop/collections/FullSizeRender.jpg?v=1757617452&width=1200",
    productCount: 12,
  },
];

// Export temporary collections for use in other services
export const getTempCollections = () => TEMP_COLLECTIONS;
export const getTempCollectionBySlug = (slug) =>
  TEMP_COLLECTIONS.find((c) => c.slug === slug);

/**
 * Category service for handling category-related API calls
 */
export const categoryService = {
  /**
   * Fetches all categories
   * @param {Object} [params] - Query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Items per page
   * @returns {Promise<Object>} Categories data with pagination info
   */
  // getCategories: async (params = {}, options = {}) => {
  //   // SAMPLE DATA - Use mock data for testing
  //   // if (
  //   //   process.env.NODE_ENV === "development" &&
  //   //   !process.env.FORCE_API_CALLS
  //   // ) {
  //   //   return { categories: MOCK_CATEGORIES, total: MOCK_CATEGORIES.length };
  //   // }

  //   // Sanitize params
  //   const validParams = {};
  //   Object.entries(params).forEach(([key, value]) => {
  //     if (value && typeof value === "string") {
  //       validParams[key] = sanitizeInput(value);
  //     } else if (typeof value === "number" && value > 0) {
  //       validParams[key] = value;
  //     }
  //   });

  //   const url = new URL(
  //     getApiUrl(API_ENDPOINTS.CATEGORY.ALL),
  //     process.env.NEXT_PUBLIC_API_URL || ""
  //   );
  //   Object.entries(validParams).forEach(([key, value]) => {
  //     url.searchParams.append(key, value);
  //   });

  //   return retryWithBackoff(async () => {
  //     const response = await fetch(
  //       url.toString(),
  //       createSecureFetchOptions({
  //         method: "GET",
  //         headers: {
  //           "Api-Code": process.env.NEXT_PUBLIC_API_CODE,
  //         },
  //         next: { revalidate: options.revalidate || 600, tags: ["categories"] },
  //         cache: options.cache || "force-cache",
  //         ...options,
  //       })
  //     );

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw createNormalizedError(response.status, errorText);
  //     }
  //     let data = await response.json();

  //     // Add base URL to image paths
  //     
  //     if (data) {
  //       data = data.map((category) => {
  //         const imagePath = category.image?.startsWith("http")
  //           ? category?.image
  //           : `https://veneficus.asbackend.com/storage/${category.image}`;

  //         return {
  //           ...category,
  //           image: imagePath,
  //         };
  //       });
  //     }

  //     return data;
  //   });
  // },

  getCategories: async (params = {}, options = {}) => {
    // Sanitize params
    const validParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value && typeof value === "string") {
        validParams[key] = sanitizeInput(value);
      } else if (typeof value === "number" && value > 0) {
        validParams[key] = value;
      }
    });

    const url = new URL(
      getApiUrl(API_ENDPOINTS.CATEGORY.ALL),
      process.env.NEXT_PUBLIC_API_URL || ""
    );
    Object.entries(validParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    return retryWithBackoff(async () => {
      const response = await fetch(
        url.toString(),
        createSecureFetchOptions({
          method: "GET",
          headers: {
            "Api-Code": process.env.NEXT_PUBLIC_API_CODE,
          },
          next: { revalidate: options.revalidate || 600, tags: ["categories"] },
          cache: options.cache || "force-cache",
          ...options,
        })
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }

      let data = await response.json();

      // التحسينات المقترحة:

      // 1. إصلاح البيانات المسترجعة
      const categories = data.categories || data; // Handle both formats

      if (!Array.isArray(categories)) {
        
        return { categories: [], total: 0 };
      }

      // 2. تحسين معالجة الصور
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        if (category.image && !category.image.startsWith("http")) {
          category.image = `https://veneficus.asbackend.com/${category.image}`;
        }
      }

      // 4. إرجاع البيانات بالصيغة المتوقعة
      return Array.isArray(data) ? categories : { ...data, categories };
    });
  },
  /**
   * Fetches a single category by ID or slug
   * @param {string} id - Category ID or slug
   * @param {Object} [params] - Query parameters
   * @returns {Promise<Object>} Category data
   */
  getCategory: async (id, params = {}, options = {}) => {
    if (!validateId(id)) throw new Error("Invalid category ID");

    const url = new URL(
      API_ENDPOINTS.CATEGORY.BY_SLUG.replace("{slug}", id),
      process.env.NEXT_PUBLIC_API_URL
    );
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });

    const token = getAuthToken();
    return retryWithBackoff(async () => {
      const response = await fetch(url.toString(), {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken(),
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        next: { revalidate: 600 },
        ...options,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    });
  },

  /**
   * Fetches products for a category
   * @param {string} categoryId - Category ID or slug
   * @param {Object} [params] - Query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=12] - Items per page
   * @returns {Promise<Object>} Products data with pagination info
   */
  getCategoryProducts: async (categoryId, params = {}) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        API_ENDPOINTS.PRODUCT.BY_CATEGORY.replace("{categoryId}", categoryId),
        {
          params,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return response.data;
    } catch (error) {
      
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch category products. Please try again."
      );
    }
  },

  /**
   * Fetches child categories for a parent category
   * @param {string} parentId - Parent category ID
   * @returns {Promise<Array>} Child categories
   */
  getChildCategories: async (parentId) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        API_ENDPOINTS.CATEGORY.CHILDREN.replace("{id}", parentId),
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return response.data;
    } catch (error) {
      
      return [];
    }
  },

  /**
   * Fetches category tree (hierarchical structure)
   * @returns {Promise<Array>} Category tree
   */
  getCategoryTree: async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(API_ENDPOINTS.CATEGORY.ALL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data;
    } catch (error) {
      
      return [];
    }
  },

  /**
   * Searches categories
   * @param {string} query - Search query
   * @returns {Promise<Array>} Matching categories
   */
  searchCategories: async (query) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(API_ENDPOINTS.SEARCH.ALL, {
        params: { query },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data;
    } catch (error) {
      
      return [];
    }
  },

  /**
   * Gets all collections (temporary mockup)
   * @returns {Promise<Array>} Collections data
   */
  getCollections: async () => {
    if (process.env.NODE_ENV === "development") {
      return TEMP_COLLECTIONS;
    }

    return retryWithBackoff(async () => {
      const response = await fetch(
        getApiUrl(API_ENDPOINTS.CATEGORY.ALL),
        createSecureFetchOptions({
          method: "GET",
        })
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }
      return response.json();
    });
  },

  /**
   * Gets collection by slug (temporary mockup)
   * @param {string} slug - Collection slug
   * @returns {Promise<Object>} Collection data
   */
  getCollectionBySlug: async (slug) => {
    if (process.env.NODE_ENV === "development") {
      const collection = TEMP_COLLECTIONS.find((c) => c.slug === slug);
      if (!collection) throw new Error("Collection not found");
      return collection;
    }

    return retryWithBackoff(async () => {
      const response = await fetch(
        API_ENDPOINTS.CATEGORY.BY_SLUG.replace("{slug}", slug),
        createSecureFetchOptions({
          method: "GET",
        })
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }
      return response.json();
    });
  },

  /**
   * Gets products by collection slug
   * @param {string} slug - Collection slug
   * @returns {Promise<Array>} Products in collection
   */
  getProductsByCollection: async (slug) => {
    if (!validateId(slug)) {
      throw createNormalizedError(400, "Invalid collection slug");
    }

    // Use real API instead of mock data
    try {
      const { productService } = await import('./products');
      const products = await productService.getProducts({ category: sanitizeInput(slug), limit: 3 });
      return products || [];
    } catch (error) {
      
      return [];
    }

    return retryWithBackoff(async () => {
      const response = await fetch(
        API_ENDPOINTS.PRODUCT.BY_CATEGORY.replace("{categoryId}", sanitizeInput(slug)),
        createSecureFetchOptions({
          method: "GET",
        })
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw createNormalizedError(response.status, errorText);
      }
      const result = await response.json();
      return result.products || [];
    });
  },
};
