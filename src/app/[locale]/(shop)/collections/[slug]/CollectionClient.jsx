'use client';

import { useState, useEffect, useMemo } from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import LazyImage from '@/components/common/LazyImage';
import { useProducts } from '@/hooks/useProducts';
import Loading from '@/components/common/Loading';
import { motion } from 'framer-motion';

export default function CollectionClient({ collection, products: initialProducts, locale }) {
    const { fetchProductsByCategory } = useProducts();
    const [products, setProducts] = useState(initialProducts || []);
    const [loading, setLoading] = useState(false);
    
    const getLocalizedName = (collection) => {
        const translation = collection.translations?.find(t => t.locale === locale);
        return translation?.name || collection.name;
    };

    useEffect(() => {
        if (collection?.name) {
            setLoading(true);
            fetchProductsByCategory(collection.name)
                .then(categoryProducts => {
                    setProducts(categoryProducts || []);
                })
                .catch(error => {

                    setProducts(initialProducts || []);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [collection?.name, fetchProductsByCategory, initialProducts]);


    return (
        <div className="bg-[var(--background)]">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-12">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative h-[65vh] min-h-[500px] rounded-3xl overflow-hidden mb-16 group shadow-2xl"
                    >
                        {collection.image && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <LazyImage
                                    src={collection.image}
                                    alt={collection.name}
                                    className="w-full h-full object-cover"
                                    fill={true}
                                />
                            </motion.div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40" />

                        <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                            <div className="max-w-4xl">
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--main-color)] to-[var(--main-color-hover)] drop-shadow-2xl"
                                >
                                    {getLocalizedName(collection)}
                                </motion.h1>

                                {collection.description && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                        className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-6"
                                    >
                                        {collection.description}
                                    </motion.p>
                                )}

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="text-white/80 leading-relaxed mt-6 pt-6 border-t border-white/20"
                                >
                                    This collection features carefully selected pieces that
                                    embody our commitment to quality and style. Each item is
                                    crafted with attention to detail and designed to
                                    complement your wardrobe seamlessly.
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Products Grid */}
                    {loading ? (
                        <Loading />
                    ) : products.length > 0 ? (
                        <div className="space-y-12">
                            <ProductGrid
                                products={products}
                                collection={collection.slug}
                            />

                            {/* Collection Story Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="bg-gradient-to-r from-[var(--main-color)]/10 via-[var(--gray-light)] to-transparent rounded-3xl p-8 md:p-12 mt-16 shadow-xl backdrop-blur-sm border border-[var(--border-color)]"
                            >
                                <div className="max-w-3xl">
                                    <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
                                        The Story Behind {getLocalizedName(collection)}
                                    </h3>
                                    <div className="text-lg text-[var(--text-secondary)] leading-relaxed space-y-4">
                                        <p>
                                            Each piece in this collection represents our
                                            commitment to exceptional craftsmanship and
                                            sustainable fashion. From the initial design concept
                                            to the final stitch, every detail is carefully
                                            considered.
                                        </p>
                                        <p>
                                            We believe in creating timeless pieces that transcend
                                            seasonal trends, offering you clothing that grows more
                                            beautiful with time and wear.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-inner">
                            <div className="max-w-md mx-auto">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-12 h-12 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                                    Coming Soon
                                </h3>
                                <p className="text-[var(--text-secondary)] text-lg">
                                    This collection is being curated. Check back soon for amazing pieces!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}