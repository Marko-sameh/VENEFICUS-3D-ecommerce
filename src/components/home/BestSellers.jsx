// 'use client';

// import { memo, useMemo, lazy, Suspense } from 'react';
// import LoadingSpinner from '@/components/common/LoadingSpinner';
// import NoResults from '@/components/common/NoResults';
// import { useTranslation } from '@/hooks/useTranslation';
// import { useBestSellers, useSeo } from '@/hooks/useUi';
// import { Button } from '../ui/Button';

// // Lazy load heavy components
// const ProductGrid = lazy(() => import('@/components/product/ProductGrid').then(module => ({ default: module.ProductGrid })));
// const JsonLd = lazy(() => import('@/components/seo/JsonLd').then(module => ({ default: module.JsonLd })));

// const BestSellers = memo(function BestSellers({ data = [] }) {
//     const { t } = useTranslation();
//     const { bestSellers, loading, error } = useBestSellers();
//     const { generateProductCollectionSchema } = useSeo();

//     // Memoized products selection
//     const products = useMemo(() => 
//         data.length > 0 ? data : bestSellers,
//         [data, bestSellers]
//     );

//     // Memoized loading state
//     const isLoading = useMemo(() => 
//         loading && data.length === 0,
//         [loading, data.length]
//     );

//     // Memoized structured data for SEO using centralized function
//     const structuredData = useMemo(() => {
//         return generateProductCollectionSchema(
//             products,
//             t('home.bestSellers.title', 'Best Selling Products'),
//             t('home.bestSellers.subtitle', 'Discover our most popular denim products loved by customers'),
//             `${process.env.NEXT_PUBLIC_SITE_URL}/best-sellers`,
//             t
//         );
//     }, [products, t, generateProductCollectionSchema]);

//     // Memoized error component
//     const errorComponent = useMemo(() => {
//         if (!error) return null;

//         return (
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//                 <div className="text-center py-12">
//                     <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
//                         {t('common.error', 'Oops!')}
//                     </h2>
//                     <p className="text-[var(--text-secondary)] mb-6">{error}</p>
//                     <Button
//                         onClick={() => window.location.reload()}
//                         variant="default"
//                     >
//                         {t('common.retry', 'Retry')}
//                     </Button>
//                 </div>
//             </div>
//         );
//     }, [error, t]);

//     if (error) return errorComponent;

//     return (
//         <section className="py-12 bg-[var(--background)]">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="text-center mb-12">
//                     <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
//                         {t('home.bestSellers.title', 'Best Selling Products')}
//                     </h2>
//                     <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
//                         {t('home.bestSellers.subtitle', 'Discover our most popular denim products loved by customers worldwide. Crafted with premium materials and timeless designs.')}
//                     </p>
//                 </div>

//                 {isLoading ? (
//                     <div className="flex justify-center items-center py-16">
//                         <LoadingSpinner size="lg" className="text-[var(--main-color)]" />
//                     </div>
//                 ) : products.length === 0 ? (
//                     <NoResults
//                         title={t('home.bestSellers.noResults', 'No best sellers available')}
//                         description={t('home.bestSellers.noResultsDesc', "We're updating our best sellers collection. Check back soon for our most popular products!")}
//                     />
//                 ) : (
//                     <>
//                         {/* Lazy load structured data */}
//                         {structuredData && (
//                             <Suspense fallback={null}>
//                                 <JsonLd data={structuredData} />
//                             </Suspense>
//                         )}

//                         {/* Lazy load product grid */}
//                         <Suspense fallback={
//                             <div className="flex justify-center items-center py-16">
//                                 <LoadingSpinner size="lg" className="text-[var(--main-color)]" />
//                             </div>
//                         }>
//                             <ProductGrid products={products} hasFilter={false} />
//                         </Suspense>

//                         <div className="mt-12 text-center">
//                             <Button
//                                 href="/products"
//                                 variant="outline"
//                                 asChild
//                             >
//                                 <a href="/products">
//                                     {t('home.bestSellers.viewAll', 'View All Products')}
//                                     <svg
//                                         className="ml-2 -mr-1 h-4 w-4"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 20 20"
//                                         fill="currentColor"
//                                         aria-hidden="true"
//                                     >
//                                         <path
//                                             fillRule="evenodd"
//                                             d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
//                                             clipRule="evenodd"
//                                         />
//                                     </svg>
//                                 </a>
//                             </Button>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </section>
//     );
// });

// export default BestSellers;



'use client';

import { memo, useMemo, lazy, Suspense } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import NoResults from '@/components/common/NoResults';
import { useTranslation } from '@/hooks/useTranslation';
import { useBestSellers, useSeo } from '@/hooks/useUi';
import { Button } from '../ui/Button';
import { ProductCard } from '@/components/product/ProductCard';

// Lazy load heavy components
const JsonLd = lazy(() =>
    import('@/components/seo/JsonLd').then((module) => ({ default: module.JsonLd }))
);

const BestSellers = memo(function BestSellers({ data = [] }) {
    const { t } = useTranslation();
    const { bestSellers, loading, error } = useBestSellers();
    const { generateProductCollectionSchema } = useSeo();
    const [emblaRef] = useEmblaCarousel({
        align: 'start',
        loop: false,
        dragFree: true,
    });

    // Memoized products
    const products = useMemo(() => (data.length > 0 ? data : bestSellers), [data, bestSellers]);
    const isLoading = useMemo(() => loading && data.length === 0, [loading, data.length]);

    // Structured Data
    const structuredData = useMemo(
        () =>
            generateProductCollectionSchema(
                products,
                t('home.bestSellers.title', 'Best Selling Products'),
                t('home.bestSellers.subtitle', 'Discover our most popular denim products loved by customers'),
                `${process.env.NEXT_PUBLIC_SITE_URL}/best-sellers`,
                t
            ),
        [products, t, generateProductCollectionSchema]
    );

    // Error state
    if (error)
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                    {t('common.error', 'Oops!')}
                </h2>
                <p className="text-[var(--text-secondary)] mb-6">{error}</p>
                <Button onClick={() => window.location.reload()} variant="default">
                    {t('common.retry', 'Retry')}
                </Button>
            </div>
        );

    return (
        <section className="py-12 bg-[var(--background)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                        {t('home.bestSellers.title', 'Best Selling Products')}
                    </h2>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                        {t(
                            'home.bestSellers.subtitle',
                            'Discover our most popular denim products loved by customers worldwide.'
                        )}
                    </p>
                </div>

                {/* Loading / Empty states */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <LoadingSpinner size="lg" className="text-[var(--main-color)]" />
                    </div>
                ) : products.length === 0 ? (
                    <NoResults
                        title={t('home.bestSellers.noResults', 'No best sellers available')}
                        description={t(
                            'home.bestSellers.noResultsDesc',
                            "We're updating our best sellers collection. Check back soon!"
                        )}
                    />
                ) : (
                    <>
                        {/* JSON-LD */}
                        {structuredData && (
                            <Suspense fallback={null}>
                                <JsonLd data={structuredData} />
                            </Suspense>
                        )}

                        {/* Carousel (responsive horizontal scroll) */}
                        <div ref={emblaRef} className="overflow-hidden">
                            <div className="flex gap-6">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex-[0_0_80%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%]"
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* View All Button */}
                        <div className="mt-12 text-center">
                            <a href="/products" className="inline-flex items-center gap-2">
                                <Button variant="outline">
                                    {t('home.bestSellers.viewAll', 'View All Products')}
                                    <svg
                                        className="h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Button>
                            </a>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
});

export default BestSellers;
