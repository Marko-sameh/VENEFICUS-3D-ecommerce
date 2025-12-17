'use client';
import LazyImage from '@/components/common/LazyImage';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUiStore } from '@/store/uiStore';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function OutfitPage() {
    const router = useRouter();
    const { gallery, galleryLoading, galleryError, fetchGallery } = useUiStore();
    const [selectedOutfit, setSelectedOutfit] = useState(null);

    useEffect(() => {
        if (gallery.length === 0) {
            fetchGallery();
        }
    }, []);

    if (galleryLoading) {
        return (
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-color)] mx-auto"></div>
                    <p className="mt-4 text-[var(--text-secondary)]">Loading gallery...</p>
                </div>
            </section>
        );
    }

    if (galleryError) {
        return (
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center">
                    <p className="text-red-500">{galleryError}</p>
                </div>
            </section>
        );
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: 'Outfit Gallery - VENEFICUS',
                        description: 'Curated outfit combinations for various occasions',
                        mainEntity: {
                            '@type': 'ItemList',
                            itemListElement: gallery.map((outfit, index) => ({
                                '@type': 'ImageObject',
                                position: index + 1,
                                contentUrl: outfit.src,
                                description: outfit.alt
                            }))
                        }
                    })
                }}
            />
            <section className="max-w-6xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-[var(--font-heading-family)] text-[var(--text-primary)] mb-4">
                        Outfit
                    </h1>
                    <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: 64 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="block mx-auto h-1 bg-gradient-to-r from-transparent via-[var(--main-color)] to-transparent"
                    />
                    <p className="text-center text-[var(--text-secondary)] max-w-2xl mx-auto mt-6 text-lg leading-relaxed">
                        Discover our curated outfit combinations featuring premium denim pieces.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
                    }}
                >
                    {gallery.map((outfit) => (
                        <motion.div
                            key={outfit.id}
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                            }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="group relative overflow-hidden rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-xl hover:shadow-2xl"
                        >
                            {/* Image */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full aspect-[4/4]"
                            >
                                <LazyImage
                                    src={outfit.src}
                                    alt={outfit.alt}
                                    fill={true}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            {/* Overlay */}
                            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedOutfit(outfit)}
                                    className="px-6 py-3 bg-[var(--main-color)] hover:bg-[var(--main-color-hover)] text-[var(--text-white)] rounded-xl font-semibold shadow-xl"
                                >
                                    View Look
                                </motion.button>
                            </div> */}
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* {selectedOutfit && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOutfit(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl"
                    >
                        <button
                            onClick={() => setSelectedOutfit(null)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
                        >
                            <X size={32} />
                        </button>
                        <Image
                            src={selectedOutfit.src}
                            alt={selectedOutfit.alt}
                            className="w-[100%] h-[100vh] rounded-lg"
                            fill
                        />
                    </motion.div>
                </div>
            )} */}
        </>
    );
}
