import { productService } from '@/services/products';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://veneficus.com';
  const currentDate = new Date().toISOString();

  try {
    const [products, categories] = await Promise.all([
      productService.getProducts(),
      productService.getCategories()
    ]);

    const staticPages = [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/collections`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/size-guide`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      },
    ];

    const productPages = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/collections/${category.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticPages, ...productPages, ...categoryPages];
  } catch (error) {
    
    return [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}