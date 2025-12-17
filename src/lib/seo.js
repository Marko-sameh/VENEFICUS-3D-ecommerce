// SEO Configuration and Utilities
export const seoConfig = {
  title: "VENEFICUS - Premium Denim Collection",
  description: "Discover VENEFICUS premium denim collection. Handcrafted with sustainable materials and timeless designs.",
  keywords: "denim, jeans, premium, sustainable, fashion, VENEFICUS",
  author: "VENEFICUS Team",
  siteUrl: "https://veneficus.com",
  image: "/images/og-default.jpg",
  twitterHandle: "@VENEFICUS",
  locale: "en-US"
};

export function generateMetadata(pageTitle, pageDescription, options = {}) {
  const {
    keywords = seoConfig.keywords,
    image = seoConfig.image,
    url = '',
    noIndex = false,
    locale = seoConfig.locale
  } = options;

  const title = pageTitle ? `${pageTitle} | ${seoConfig.title}` : seoConfig.title;
  const description = pageDescription || seoConfig.description;
  const fullUrl = url ? `${seoConfig.siteUrl}${url}` : seoConfig.siteUrl;
  const fullImage = image.startsWith('http') ? image : `${seoConfig.siteUrl}${image}`;

  return {
    title,
    description,
    keywords,
    ...(noIndex && { robots: 'noindex, nofollow' }),
    openGraph: {
      title: pageTitle || seoConfig.title,
      description,
      url: fullUrl,
      siteName: seoConfig.title,
      images: [{ 
        url: fullImage,
        width: 1200,
        height: 630,
        alt: title
      }],
      type: "website",
      locale
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle || seoConfig.title,
      description,
      creator: seoConfig.twitterHandle,
      images: [fullImage],
    },
    alternates: {
      canonical: fullUrl
    }
  };
}

export function generateProductMetadata(product) {
  if (!product) return generateMetadata();

  const title = product.name;
  const description = product.description?.substring(0, 160) || seoConfig.description;
  const image = product.images?.[0] || seoConfig.image;
  const url = `/products/${product.slug}`;

  return generateMetadata(title, description, {
    keywords: `${product.name}, buy ${product.name}, ${seoConfig.keywords}`,
    image,
    url
  });
}

export function generateCategoryMetadata(category) {
  if (!category) return generateMetadata();

  const title = category.name;
  const description = category.description?.substring(0, 160) || 
    `Shop ${category.name} collection at VENEFICUS. ${seoConfig.description}`;
  const image = category.image || seoConfig.image;
  const url = `/categories/${category.slug}`;

  return generateMetadata(title, description, {
    keywords: `${category.name}, ${category.name} collection, ${seoConfig.keywords}`,
    image,
    url
  });
}

export function generateBreadcrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', href: '/' }];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    breadcrumbs.push({ name, href: currentPath });
  });

  return breadcrumbs;
}

export function createProductStructuredData(product, organization) {
  if (!product) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [],
    description: product.description,
    sku: product.sku || product.id,
    brand: organization ? {
      '@type': 'Brand',
      name: organization.name
    } : undefined,
    offers: {
      '@type': 'Offer',
      url: `${seoConfig.siteUrl}/products/${product.slug}`,
      priceCurrency: product.priceCurrency || 'USD',
      price: product.price,
      availability: product.availability || 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: organization?.name || 'VENEFICUS'
      }
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0
      }
    })
  };
}