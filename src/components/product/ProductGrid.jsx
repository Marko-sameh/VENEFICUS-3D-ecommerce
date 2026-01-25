// src/components/product/ProductGrid.jsx
'use client';

import { ProductCard } from './ProductCard';
import { Pagination } from '@/components/common/Pagination';
import ProductFilters from './ProductFilters';
import { memo, useMemo } from 'react';
import { JsonLd } from '../seo/JsonLd';
import NoResults from '../common/NoResults';
import { useTranslation } from '@/hooks/useTranslation';
import { useProducts } from '@/hooks/useProducts';
import { motion } from 'framer-motion';

const ProductGrid = memo(function ProductGrid({
    products,
    currentPage = 1,
    totalPages = 1,
    category = null,
    collection = null,
    onProductClick = () => { },
    hasFilter = true
}) {
    const { t } = useTranslation();
    const { getFilteredProducts } = useProducts();

    
    // Apply filters to props products
    const filteredProducts = useMemo(() => {
        // For products page, show all products without filtering
        if (!hasFilter) {
            return products || [];
        }
        return getFilteredProducts(products || []);
    }, [products, getFilteredProducts, hasFilter]);

    // SEO: Create ItemList structured data
    const itemListSchema = useMemo(() => ({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: filteredProducts?.map((product, index) => ({
            '@type': 'ListItem',
            position: (currentPage - 1) * 12 + (index + 1),
            url: `/products/${product.slug}`,
            name: product.name,
            image: product.mainImage,
            description: product.description?.substring(0, 160) || ''
        })) || []
    }), [filteredProducts, currentPage]);

    
    if (!products || products.length === 0) {
        return (
            <NoResults
                title={t('products.noResults', 'No products found')}
                description={t('products.noResultsDesc', 'Try adjusting your filters or search for something else')}
            />
        );
    }

    return (
        <div className="w-full">
            {/* Product Filters */}
            {hasFilter && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ProductFilters totalProducts={filteredProducts.length} className="mb-8" />
                </motion.div>
            )}

            {/* SEO: ItemList Schema for product grid */}
            <JsonLd item={itemListSchema} />

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
                itemScope
                itemType="https://schema.org/ItemList"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
                }}
            >
                {filteredProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                        }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </motion.div>

            {filteredProducts.length === 0 && products.length > 0 && (
                <div className="text-center py-12">
                    <p className="text-[var(--text-secondary)] text-lg">{t('products.noFiltersMatch', 'No products match your filters')}</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-12">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        baseUrl={category ? `/categories/${category.slug}` : '/products'}
                    />
                </div>
            )}
        </div>
    );
});

export { ProductGrid };