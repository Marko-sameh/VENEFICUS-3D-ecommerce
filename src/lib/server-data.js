// Server-side data fetching utilities
import { productService } from '@/services/products';

/**
 * Fetch homepage data on server
 */
export async function getHomePageData() {
  try {
    const [featuredProducts, bestSellers, newArrivals] = await Promise.all([
      productService.getFeaturedProducts(2),
      productService.getBestSellingProducts(4),
      productService.getNewArrivals(4)
    ]);

    return {
      featuredProducts,
      bestSellers,
      newArrivals
    };
  } catch (error) {
    
    // Return fallback data
    return {
      featuredProducts: [],
      bestSellers: [],
      newArrivals: []
    };
  }
}

/**
 * Fetch products page data on server
 */
export async function getProductsPageData(params = {}) {
  try {
    const { page = 1, category, sort = 'newest' } = params;
    
    const [productsData, categories] = await Promise.all([
      productService.getProducts({ page, category, sort }),
      productService.getCategories()
    ]);

    return {
      products: productsData.products || [],
      pagination: productsData.pagination || { currentPage: 1, totalPages: 1 },
      categories
    };
  } catch (error) {
    
    return {
      products: [],
      pagination: { currentPage: 1, totalPages: 1 },
      categories: []
    };
  }
}

/**
 * Fetch single product data on server
 */
export async function getProductData(slug) {
  try {
    const [product, relatedProducts] = await Promise.all([
      productService.getProductBySlug(slug),
      productService.getRelatedProducts(slug, 4)
    ]);

    return {
      product,
      relatedProducts
    };
  } catch (error) {
    
    return null;
  }
}