'use client';

import { useState } from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Pagination } from '@/components/common/Pagination';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';

export default function ProductsClient({ initialProducts, initialPagination }) {
    const { t } = useTranslation();
    const [products] = useState(initialProducts);
    const [pagination] = useState(initialPagination);
    const [loading] = useState(false);

    return (
        <div className="bg-[var(--background)] text-[var(--text-primary)] min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className='text-center mb-16'
                >
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-[var(--text-primary)] mb-3">
                        {t('pages.products.title', 'All Products')}
                    </h1>
                    <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: 48 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="block mx-auto h-1 bg-gradient-to-r from-transparent via-[var(--main-color)] to-transparent"
                    />
                </motion.div>

                <section aria-labelledby="product-heading">
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="min-h-[400px] flex flex-col items-center justify-center">
                            <p className="text-xl text-[var(--text-secondary)] mb-4">
                                {t('pages.products.noProducts', 'No products found')}
                            </p>
                        </div>
                    ) : (
                        <>
                            <ProductGrid products={products} />
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                baseUrl="/products"
                            />
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}
