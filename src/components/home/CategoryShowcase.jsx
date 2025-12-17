'use client';

import { useMemo, memo } from 'react';
import Link from 'next/link';
import LazyImage from '@/components/common/LazyImage';
import { useProducts } from '@/hooks/useProducts';

const CategoryItem = memo(({ category, index }) => (
    <Link
        href={`/categories/${category.slug}`}
        className="group block"
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
    >
        <meta itemProp="position" content={category.featuredOrder || index + 1} />
        <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="aspect-[4/3] relative overflow-hidden">
                <LazyImage
                    src={category.image}
                    alt={`${category.name} - VENEFICUS`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" aria-hidden="true"></div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 font-heading group-hover:text-[var(--main-color)] transition-colors" itemProp="name">
                    {category.name}
                </h3>
                <p className="text-[var(--text-light)] text-sm line-clamp-2">
                    {category.description}
                </p>
            </div>
        </div>
    </Link>
));

CategoryItem.displayName = 'CategoryItem';

export default function CategoryShowcase() {
    const { featuredCategories, loading, error } = useProducts();

    const visibleCategories = useMemo(() => {
        return featuredCategories.length > 0 ? featuredCategories : [];
    }, [featuredCategories]);

    const schemaData = useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "VENEFICUS Categories",
        "description": "Premium denim collection showcase",
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": visibleCategories.map((category, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://veneficus.com'}/categories/${category.slug}`,
                "name": category.name
            }))
        }
    }), [visibleCategories]);

    if (loading && visibleCategories.length === 0) {
        return (
            <section className="py-16 bg-[var(--gray-light)]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 font-heading">
                            Browse the featured collection
                        </h2>
                        <div className="w-24 h-1 bg-[var(--main-color)] mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={`skeleton-${index}`}
                                className="bg-white rounded-lg overflow-hidden shadow-sm"
                            >
                                <div className="aspect-[4/3] bg-[var(--gray-light)] animate-pulse"></div>
                                <div className="p-4">
                                    <div className="h-6 bg-[var(--gray-light)] rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-[var(--gray-light)] rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-[var(--gray-light)]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 font-heading">
                        Browse the featured collection
                    </h2>
                    <p className="text-[var(--text-secondary)]">حدث خطأ أثناء تحميل الفئات. يرجى المحاولة لاحقًا.</p>
                </div>
            </section>
        );
    }

    if (visibleCategories.length === 0) {
        return null;
    }

    return (
        <section
            className="py-16 bg-[var(--gray-light)]"
            itemScope
            itemType="https://schema.org/CollectionPage"
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 max-w-3xl mx-auto">
                    <h2
                        className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 font-heading"
                        itemProp="name"
                    >Browse the featured collection
                    </h2>
                    <div className="w-24 h-1 bg-[var(--main-color)] mx-auto mb-6"></div>
                    <p
                        className="text-[var(--text-secondary)] text-lg"
                        itemProp="description"
                    >Discover our exclusive collection of premium handcrafted jeans of the highest quality.
                    </p>
                </div>

                {/* Schema.org markup for the collection */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6" itemProp="hasPart">
                    {visibleCategories.map((category, index) => (
                        <CategoryItem key={category.id} category={category} index={index} />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/categories"
                        className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[var(--main-color)] hover:bg-[var(--main-color-hover)] transition-colors"
                    >
                        View all collections
                        <svg
                            className="ml-2 -mr-1 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}