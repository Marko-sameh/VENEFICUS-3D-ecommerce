/**
 * JSON-LD structured data generators for VENEFICUS
 * Creates schema.org compatible structured data
 */

import { DEFAULT_META_TITLE, DEFAULT_IMAGE } from "./constants";

/**
 * Generate Product structured data
 * @param {Object} product - Product data
 * @returns {Object} Product structured data
 */
export const generateProductSchema = (product) => {
  if (!product) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images || [DEFAULT_IMAGE],
    description: product.description?.substring(0, 160) || "",
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "VENEFICUS",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "VENEFICUS",
      },
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0,
      },
    }),
    ...(product.reviews &&
      product.reviews.length > 0 && {
        review: product.reviews.slice(0, 3).map((review) => ({
          "@type": "Review",
          author: {
            "@type": "Person",
            name: review.user?.name || "Customer",
          },
          datePublished: review.createdAt,
          reviewBody: review.comment,
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating,
            bestRating: 5,
          },
        })),
      }),
  };
};

/**
 * Generate Breadcrumb structured data
 * @param {Array} items - Breadcrumb items [{ label, href }]
 * @returns {Object} Breadcrumb structured data
 */
export const generateBreadcrumbSchema = (items) => {
  if (!items || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href
        ? item.href.startsWith("http")
          ? item.href
          : `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}`
        : undefined,
    })),
  };
};

/**
 * Generate Website structured data
 * @returns {Object} Website structured data
 */
export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: DEFAULT_META_TITLE,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
};

/**
 * Generate Organization structured data
 * @returns {Object} Organization structured data
 */
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: DEFAULT_META_TITLE,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`,
    sameAs: [
      "https://www.facebook.com/veneficus",
      "https://www.instagram.com/veneficus",
      "https://www.twitter.com/veneficus",
      "https://www.linkedin.com/company/veneficus",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-555-1234",
      contactType: "Customer service",
      areaServed: "US",
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Main St",
      addressLocality: "Anytown",
      addressRegion: "CA",
      postalCode: "90210",
      addressCountry: "US",
    },
  };
};

/**
 * Generate CollectionPage structured data
 * @param {Object} category - Category data
 * @returns {Object} CollectionPage structured data
 */
export const generateCollectionPageSchema = (category) => {
  if (!category) return null;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    image: category.image || DEFAULT_IMAGE,
    breadcrumb: generateBreadcrumbSchema([
      { label: "Home", href: "/" },
      { label: category.name, href: `/categories/${category.slug}` },
    ]),
  };
};

/**
 * Generate Article structured data
 * @param {Object} post - Blog post data
 * @returns {Object} Article structured data
 */
export const generateArticleSchema = (post) => {
  if (!post) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.featuredImage ? [post.featuredImage] : [],
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author?.name || "VENEFICUS Team",
    },
    publisher: {
      "@type": "Organization",
      name: "VENEFICUS",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
    },
  };
};

/**
 * Generate FAQPage structured data
 * @param {Array} items - FAQ items [{ question, answer }]
 * @returns {Object} FAQPage structured data
 */
export const generateFAQSchema = (items) => {
  if (!items || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
};

/**
 * Generate ProductCollection structured data
 * @param {Array} products - Array of product objects
 * @param {string} collectionName - Name of the collection
 * @param {string} description - Description of the collection
 * @returns {Object} ProductCollection structured data
 */
export const generateProductCollectionSchema = (
  products,
  collectionName,
  description
) => {
  if (!products || products.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: collectionName,
    description: description,
    mainEntity: {
      "@type": "ProductGroup",
      name: collectionName,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/collections/${collectionName
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
      hasVariant: products.map((product) => ({
        "@type": "Product",
        name: product.name,
        image: product.images[0],
        description: product.description.substring(0, 160),
        sku: product.sku,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
        },
      })),
    },
  };
};

/**
 * Generate SearchResultsPage structured data
 * @param {string} query - Search query
 * @param {number} count - Number of results
 * @returns {Object} SearchResultsPage structured data
 */
export const generateSearchResultsSchema = (query, count) => {
  if (!query) return null;

  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    query: query,
    numberOfResults: count,
    description: `Search results for "${query}"`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${
        process.env.NEXT_PUBLIC_SITE_URL
      }/search?q=${encodeURIComponent(query)}`,
      "query-input": `required name=search_term_string value=${encodeURIComponent(
        query
      )}`,
    },
  };
};

/**
 * Generate WebPage structured data
 * @param {Object} options - Options for the webpage
 * @returns {Object} WebPage structured data
 */
export const generateWebPageSchema = (options = {}) => {
  const {
    title = DEFAULT_META_TITLE,
    description = "",
    url = process.env.NEXT_PUBLIC_SITE_URL,
    lastReviewed,
    reviewedBy,
  } = options;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: url,
    ...(lastReviewed && {
      lastReviewed: lastReviewed,
      reviewedBy: reviewedBy
        ? {
            "@type": "Organization",
            name: reviewedBy,
          }
        : undefined,
    }),
  };
};
