// src/components/home/NewArrivals.jsx
'use client';

import { useState, useEffect } from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductCard } from '@/components/product/ProductCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import NoResults from '@/components/common/NoResults';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { useTranslation, useTranslatedData } from '@/hooks/useUserSettings';
import { transformApiData } from '@/lib/apiTranslations';

const PRODUCT_TRANSLATION_KEYS = {
    name: 'product.name',
    description: 'product.description',
    category: 'product.category',
    material: 'product.material',
    careInstructions: 'product.careInstructions'
};

const useTranslatedProducts = (products) => {
    return useTranslatedData(products, PRODUCT_TRANSLATION_KEYS);
};
import { productService } from '@/services/products';

export function NewArrivals({ data }) {
    const { t, language } = useTranslation();
    const [apiProducts, setApiProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // استخدام hook للبيانات المترجمة
    const { data: translatedProducts, isLoading: isTranslating } = useTranslatedProducts(apiProducts || []);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                setLoading(true);
                // Get products from real API
                const productsData = await productService.getProducts({
                    sort: 'newest',
                    limit: 8
                });
                setApiProducts(productsData || []);
            } catch (err) {
                setError(t('home.newArrivals.error', 'Failed to load new arrivals. Please try again later.'));
                
            } finally {
                setLoading(false);
            }
        };

        fetchNewArrivals();
    }, [data, language]);

    // استخدام البيانات المترجمة أو البيانات الأصلية أو البيانات الممررة
    const products = data || translatedProducts || apiProducts || [];
    const isLoading = loading || isTranslating;

    // SEO: Structured data for new arrivals collection
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: t('home.newArrivals.title', 'New Arrivals') + ' - VENEFICUS',
        description: t('home.newArrivals.subtitle', 'Discover our latest denim collection crafted with premium materials and timeless designs.'),
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: process.env.NEXT_PUBLIC_SITE_URL || 'https://essec-denim.com'
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'New Arrivals'
                }
            ]
        },
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: products.slice(0, 3).map((product, index) => ({
                '@type': 'Product',
                position: index + 1,
                name: product.name,
                image: product.mainImage,
                description: product.description,
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`
            }))
        }
    };

    // SEO: Breadcrumbs for navigation
    const breadcrumbs = [
        { name: 'Home', href: '/' },
        { name: 'New Arrivals', href: '#new-arrivals' }
    ];

    return (
        <section id="new-arrivals" className="py-16 bg-[var(--background)]">
            {/* SEO: JSON-LD structured data */}
            <JsonLd item={structuredData} />

            {/* SEO: Breadcrumbs for navigation */}
            {/* <Breadcrumbs items={breadcrumbs} /> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-heading-family)', fontWeight: 'var(--font-heading-weight)' }}>
                        {t('home.newArrivals.title', 'New Arrivals')}
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body-family)', fontWeight: 'var(--font-body-weight)' }}>
                        {t('home.newArrivals.subtitle', 'Discover our latest denim collection crafted with premium materials and timeless designs.')}
                    </p>
                </div>

                {error ? (
                    <div className="text-center py-12">
                        <p className="text-[var(--text-primary)]">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2 bg-[var(--main-color)] text-white rounded-md hover:bg-[var(--main-color-hover)] transition-colors"
                        >
                            {t('common.retry', 'Retry')}
                        </button>
                    </div>
                ) : isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <LoadingSpinner size="lg" className="text-[var(--main-color)]" />
                    </div>
                ) : products.length === 0 ? (
                    <NoResults
                        title={t('home.newArrivals.noResults', 'No new arrivals yet')}
                        description={t('home.newArrivals.noResultsDesc', 'Check back soon for our latest collection of premium denim products.')}
                    />
                ) : (
                    <>
                        <ProductGrid products={products} hasFilter={false} />

                        <div className="mt-12 text-center">
                            <a
                                href="/products?sort=newest"
                                className="inline-block px-8 py-3 bg-[var(--main-color)] text-white font-medium rounded-md hover:bg-[var(--main-color-hover)] transition-colors"
                                style={{ fontFamily: 'var(--font-body-family)', fontWeight: 'var(--font-body-weight-bold)' }}
                            >
                                {t('home.newArrivals.viewAll', 'View All New Arrivals')}
                            </a>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}