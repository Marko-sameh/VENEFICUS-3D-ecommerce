'use client';

import LazyImage from '@/components/common/LazyImage';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CollectionsClient({ collections }) {
    const params = useParams();
    const locale = params?.locale || 'en';
    
    const getLocalizedName = (collection) => {
        const translation = collection.translations?.find(t => t.locale === locale);
        return translation?.name || collection.name;
    };
    return (
        <>
            {/* Page Title */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-6xl font-heading font-bold text-[var(--text-primary)] mb-4">
                    Collections
                </h1>
                <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: 64 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="block mx-auto h-1 bg-gradient-to-r from-transparent via-[var(--main-color)] to-transparent"
                />
                <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed mt-6">
                    Discover our curated collections of premium denim
                </p>
            </motion.div>

            {/* Collections Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
                }}
            >
                {collections.map((collection, index) => (
                    <motion.div
                        key={collection.id}
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                        }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl"
                    >
                        <Link
                            href={`/${locale}/collections/${collection.slug || collection.name?.toLowerCase().replace(/\s+/g, '-')}`}
                            className="group block relative overflow-hidden rounded-2xl shadow-md"
                        >
                            {/* Image wrapper */}
                            <div className="aspect-[3/4] relative overflow-hidden">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className="w-full h-full"
                                >
                                    <LazyImage
                                        src={collection.image}
                                        alt={collection.name}
                                        fill
                                        className="h-full w-full"
                                    />
                                </motion.div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-500" />
                            </div>

                            {/* Overlay content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <motion.h2
                                    className="text-2xl font-bold mb-2 text-[var(--main-color)] group-hover:text-[var(--main-color-hover)] transition-colors"
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {getLocalizedName(collection)}
                                </motion.h2>
                                <p className="text-base text-white/90 mb-3 line-clamp-2">
                                    {collection.description}
                                </p>

                                {/* Featured products (uncomment if needed) */}
                                {/* {collection.featuredProducts > 0 && (
      <span className="inline-block text-xs px-3 py-1 rounded-full bg-[var(--main-color)] text-[var(--text-white)]">
        {collection.featuredProducts}{' '}
        {collection.featuredProducts === 1 ? 'item' : 'items'}
      </span>
    )} */}
                            </div>
                        </Link>

                    </motion.div>
                ))}
            </motion.div>

            {/* Featured Banner */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl p-8 md:p-12 mb-16 bg-gradient-to-br from-[var(--main-color-light)] to-white border border-[var(--main-color)] text-center shadow-xl"
            >
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-[var(--text-primary)] mb-6">
                        Crafted Collections, Timeless Stories
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-4">
                        At VENEFICUS, we don't just create products—we craft
                        collections that tell stories. Each collection represents a
                        carefully curated selection of pieces that share a common
                        inspiration.
                    </p>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                        From limited edition releases to heritage collections, each piece
                        is crafted with attention to detail and commitment to quality that
                        defines the VENEFICUS brand.
                    </p>
                </div>
            </motion.div>
        </>
    );
}