'use client';

import Link from 'next/link';
import { memo, useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PriceDisplay from '../common/PriceDisplay';
import { AddToCartButton } from './AddToCartButton';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { Skeleton } from '../ui/skeleton';
import LazyImage from '../common/LazyImage';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import { hashId } from '@/lib/hash';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button-improved';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { colorService } from '@/services/colorService';
import { sizeService } from '@/services/sizeService';
import { API_BASE_URL } from '@/lib';

const ProductCard = memo(function ProductCard({
    product,
    showQuickView = true,
    showAddToCart = true,
    priority = false,
    showPrice = true,
    homeshow = false,
    className = ""
}) {
    const { t } = useTranslation();
    const params = useParams();
    const locale = params?.locale || 'en';
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [availableVariants, setAvailableVariants] = useState([]);

    // Get localized product data
    const getLocalizedProduct = (product, locale) => {
        const translation = product.translations?.find(t => t.locale === locale);
        return {
            ...product,
            name: translation?.name || product.name,
            description: translation?.description || product.description
        };
    };

    const localizedProduct = getLocalizedProduct(product, locale);

    // Fetch colors and sizes on mount
    useEffect(() => {
        const fetchVariantData = async () => {
            try {
                const [colorsData, sizesData] = await Promise.all([
                    colorService.getAllColors(),
                    sizeService.getAllSizes()
                ]);

                setColors(colorsData);
                setSizes(sizesData);
                setAvailableVariants(product.product_variant || []);
            } catch (error) {
                console.error('Error fetching variant data:', error);
            }
        };

        if (product?.id) {
            fetchVariantData();
        }
    }, [product]);

    const getAvailableOptions = () => {
        const availableColors = colors.filter(color =>
            availableVariants.some(variant =>
                variant.color_id === color.id &&
                variant.product_id === product.id &&
                variant.stock > 0
            )
        );
        const availableSizes = sizes.filter(size =>
            availableVariants.some(variant =>
                variant.size_id === size.id &&
                variant.product_id === product.id &&
                variant.stock > 0
            )
        );
        return { availableColors, availableSizes };
    };

    const isVariantAvailable = (colorId, sizeId) => {
        return availableVariants.some(variant =>
            variant.color_id === colorId &&
            variant.size_id === sizeId &&
            variant.product_id === product.id &&
            variant.stock > 0
        );
    };

    const handleAddToCartClick = () => {
        setShowVariantModal(true);
    };

    const handleVariantSelect = () => {
        if (selectedColor && selectedSize && isVariantAvailable(selectedColor.id, selectedSize.id)) {
            setShowVariantModal(false);
            // Trigger actual add to cart with selected variants
            return { colorId: selectedColor.id, sizeId: selectedSize.id };
        }
    };

    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    if (!product?.id) return <ProductCardSkeleton />;

    const canonicalUrl = `${API_BASE_URL}/products/${product.slug}`;

    return (
        <ErrorBoundary>
            <motion.article
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                whileHover={{ scale: 1.02, z: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`group relative overflow-hidden h-full flex flex-col rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${className}`}
                itemScope
                itemType="https://schema.org/Product"
            >
                <link rel="canonical" href={canonicalUrl} />
                <meta itemProp="name" content={localizedProduct.name} />
                <meta itemProp="sku" content={product.id} />
                <meta itemProp="brand" content="VENEFICUS" />
                <meta itemProp="image" content={product.mainImage} />
                {localizedProduct.description && (
                    <meta itemProp="description" content={localizedProduct.description.substring(0, 160)} />
                )}

                <link
                    itemProp="availability"
                    href={(product.product_variant_sum_stock || 0) > 0 ?
                        "https://schema.org/InStock" :
                        "https://schema.org/OutOfStock"
                    }
                />

                {product.rating && product.reviewCount && (
                    <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                        <meta itemProp="ratingValue" content={product.rating.toString()} />
                        <meta itemProp="bestRating" content="5" />
                        <meta itemProp="reviewCount" content={product.reviewCount.toString()} />
                    </div>
                )}

                <div className="aspect-square w-full overflow-hidden relative rounded-t-xl">
                    <Link
                        href={`/${locale}/products/${hashId(product.id)}`}
                        className="block h-full"
                        itemProp="url"
                        aria-label={t("product.viewDetails", "View details for") + " " + localizedProduct.name}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full w-full"
                        >
                            <LazyImage
                                src={product.image?.startsWith('http') ? product.image : `https://veneficus.asbackend.com/${product.image}`}
                                alt={product.altText || `${product.name} - VENEFICUS high-quality product`}
                                fill={true}
                                priority={priority}
                                className="h-full w-full object-cover object-center"
                            />
                        </motion.div>
                        {product?.has_discount === 1 && (
                            <div
                                className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded"
                                itemProp="offers"
                                itemScope
                                itemType="https://schema.org/Offer"
                            >
                                <meta itemProp="price" content={product.discounted_price?.toString()} />
                                <meta itemProp="priceCurrency" content="USD" />
                                {Math.round(((product.price - product.discounted_price) / product.price) * 100)}% OFF
                            </div>
                        )}
                    </Link>

                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex flex-col space-y-1 sm:space-y-2">
                        {showQuickView && (
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    type="button"
                                    className="p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-md hover:bg-white transition-all shadow-lg"
                                    aria-label={t("product.quickView", "Quick view") + " " + product.name}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--gray)]"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </Button>
                            </motion.div>
                        )}
                    </div>

                    {showAddToCart && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="hidden md:block absolute bottom-3 lg:bottom-4 left-0 right-0 px-3 lg:px-4"
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={handleAddToCartClick}
                                    className="w-full py-2 lg:py-2.5 rounded-md font-semibold text-sm lg:text-base shadow-xl"
                                    style={{ backgroundColor: 'var(--main-color)', color: 'var(--text-white)' }}
                                >
                                    {t('product.addToCart', 'Add to cart')}
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </div>

                <CardContent className="p-3 sm:p-4 flex-1 flex flex-col bg-gradient-to-b from-white to-[var(--gray-light)]/30">
                    <div className="flex-1">
                        <h3
                            className="text-sm sm:text-base font-medium text-[var(--text-primary)] line-clamp-2 sm:line-clamp-1"
                            style={{ fontFamily: 'var(--font-body-family)' }}
                        >
                            <Link
                                href={`/${locale}/products/${hashId(product.id)}`}
                                className="hover:text-[var(--main-color)] transition-colors flex flex-row gap-1 items-center"
                                itemProp="name"
                            >
                                <span className="line-clamp-2 sm:line-clamp-1">{localizedProduct.name}</span>
                                {homeshow && <ArrowRight className="w-4 h-4 flex-shrink-0" />}
                            </Link>
                        </h3>
                        {product.category?.name && (
                            <p
                                className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-1"
                                style={{ fontFamily: 'var(--font-body-family)' }}
                            >
                                {product.category.name}
                            </p>
                        )}
                        {localizedProduct.description && (
                            <p className="mt-1 text-[10px] sm:text-xs text-[var(--text-secondary)] line-clamp-2 sm:line-clamp-1">
                                {localizedProduct.description.length > 60 ? localizedProduct.description.substring(0, 60) + '...' : localizedProduct.description}
                            </p>
                        )}
                    </div>

                    <div className="mt-2 sm:mt-3 flex justify-between items-center gap-2">
                        {showPrice && (
                            <PriceDisplay
                                price={product.has_discount === 1 ? product?.discounted_price : product?.price}
                                compareAtPrice={product.has_discount === 1 ? product?.price : undefined}
                                className="font-semibold text-sm sm:text-base text-[var(--text-primary)]"
                                style={{ fontFamily: 'var(--font-heading-family)' }}
                            />
                        )}

                        {showAddToCart && (
                            <Button
                                onClick={handleAddToCartClick}
                                className="md:hidden p-1.5 sm:p-2 rounded-full bg-[var(--gray-light)] hover:bg-[var(--gray)] text-[var(--text-primary)] flex-shrink-0"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4.5v15m7.5-7.5h-15"
                                    />
                                </svg>
                            </Button>
                        )}
                    </div>
                </CardContent>

                {/* Variant Selection Modal */}
                {showVariantModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-screen items-center justify-center p-4">
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowVariantModal(false)} />
                            <div className="relative bg-white rounded-lg max-w-md w-full p-6 z-20">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Select Options</h3>
                                    <button onClick={() => setShowVariantModal(false)} className="text-2xl">&times;</button>
                                </div>

                                {/* Color Selection */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {getAvailableOptions().availableColors.map(color => (
                                            <button
                                                key={color.id}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-8 h-8 rounded-full border-2 ${selectedColor?.id === color.id ? 'ring-2 ring-blue-500' : ''
                                                    }`}
                                                style={{ backgroundColor: color.hex || color.hex_code || color.color }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Size Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Size</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {getAvailableOptions().availableSizes.map(size => {
                                            const isDisabled = selectedColor && !isVariantAvailable(selectedColor.id, size.id);
                                            return (
                                                <button
                                                    key={size.id}
                                                    onClick={() => !isDisabled && setSelectedSize(size)}
                                                    disabled={isDisabled}
                                                    className={`p-2 border rounded text-sm ${selectedSize?.id === size.id
                                                        ? 'bg-blue-500 text-white'
                                                        : isDisabled
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'hover:border-blue-500'
                                                        }`}
                                                >
                                                    {size.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <AddToCartButton
                                    product={product}
                                    selectedVariant={selectedColor && selectedSize ? { colorId: selectedColor.id, sizeId: selectedSize.id } : null}
                                    disabled={!selectedColor || !selectedSize || !isVariantAvailable(selectedColor?.id, selectedSize?.id)}
                                    className="w-full"
                                    onSuccess={() => setShowVariantModal(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </motion.article>
        </ErrorBoundary>
    );
});

export { ProductCard };

function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden h-full flex flex-col">
            <div className="aspect-square w-full bg-gray-light relative">
                <Skeleton className="h-full w-full" />

                <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex flex-col space-y-1 sm:space-y-2">
                    <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
                    <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
                </div>
            </div>

            <CardContent className="p-3 sm:p-4 flex-1">
                <Skeleton className="h-4 sm:h-5 w-3/4 mb-2" />
                <Skeleton className="h-3 sm:h-4 w-1/2 mb-1" />
                <Skeleton className="h-3 w-full sm:hidden" />

                <div className="mt-2 sm:mt-3 flex justify-between items-center gap-2">
                    <div className="space-y-1 sm:space-y-2 flex-1">
                        <Skeleton className="h-4 sm:h-5 w-16 sm:w-20" />
                        <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
                    </div>
                    <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full md:hidden flex-shrink-0" />
                </div>
            </CardContent>
        </Card>
    );
}