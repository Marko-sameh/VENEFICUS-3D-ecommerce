'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { memo, useMemo, useState, useEffect } from 'react';
import PriceDisplay from '../common/PriceDisplay';
import SizeSelector from './SizeSelector';
import ColorSelector from './ColorSelector';
import { AddToCartButton } from './AddToCartButton';
import { useProducts } from '@/hooks/useProducts';
import ShareButtons from '../common/ShareButtons';
import { motion } from 'framer-motion';
import { replaceImageUrl } from '@/lib/config';

function ProductDetails({ product }) {
    const { t } = useTranslation();
    const { selectColor, selectSize, initializeClient } = useProducts();
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [availableVariants, setAvailableVariants] = useState([]);

    const priceProps = useMemo(() => ({
        price: product.has_discount === 1 ? product.discounted_price : product.price,
        compareAtPrice: product.has_discount === 1 ? product.price : undefined,
        className: "text-2xl tracking-tight text-[var(--text-primary)]"
    }), [product.price, product.discounted_price, product.has_discount]);

    const schemaData = useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,

        "description": product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || '',
        "sku": product.sku,
        "mpn": product.mpn,
        "brand": {
            "@type": "Brand",
            "name": "VENEFICUS"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://veneficus.com/products/${product.slug}`,
            "priceCurrency": "USD",
            "price": product.has_discount === 1 ? product.discounted_price : product.price,
            "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            "itemCondition": "https://schema.org/NewCondition",
            "availability": (product.product_variant_sum_stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": "VENEFICUS"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": product.reviewCount
        }
    }), [product]);
    const totalStock = product?.product_variant?.reduce((total, variant) => total + variant.stock, 0);

    // Fetch colors and sizes on mount
    useEffect(() => {
        const fetchVariantData = async () => {
            try {
                const [colorsRes, sizesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/all_color`, {
                        headers: { 'Api-Code': 'B1m8fszhQ5qompWX3tC5BKGmv3fohU0iGjEmO5GjxU9o8wGHaHryNgTrWJmtkeok' }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/all_size`, {
                        headers: { 'Api-Code': 'B1m8fszhQ5qompWX3tC5BKGmv3fohU0iGjEmO5GjxU9o8wGHaHryNgTrWJmtkeok' }
                    })
                ]);

                const colorsData = await colorsRes.json();
                const sizesData = await sizesRes.json();

                const colorsList = colorsData.colors || colorsData || [];
                const sizesList = sizesData.sizes || sizesData || [];

                setColors(colorsList);
                setSizes(sizesList);
                setAvailableVariants(product.product_variant || []);

                // Initialize 3D model with colors and sizes
                initializeClient(
                    colorsList.map(c => ({ ...c, hex: c.hex_code || c.color })),
                    sizesList
                );
            } catch (error) {

            }
        };

        if (product?.id) {
            fetchVariantData();
        }
    }, [product]);

    const getAvailableColors = () => {
        return colors.filter(color =>
            availableVariants.some(variant =>
                variant.color_id === color.id &&
                variant.product_id === product.id &&
                variant.stock > 0
            )
        );
    };

    const getAvailableSizes = () => {
        if (!selectedColor) {
            return sizes.filter(size =>
                availableVariants.some(variant =>
                    variant.size_id === size.id &&
                    variant.product_id === product.id &&
                    variant.stock > 0
                )
            );
        }
        return sizes.filter(size =>
            availableVariants.some(variant =>
                variant.color_id === selectedColor.id &&
                variant.size_id === size.id &&
                variant.product_id === product.id &&
                variant.stock > 0
            )
        );
    };

    const isVariantAvailable = (colorId, sizeId) => {
        return availableVariants.some(variant =>
            variant.color_id === colorId &&
            variant.size_id === sizeId &&
            variant.product_id === product.id &&
            variant.stock > 0
        );
    };


    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0"
            itemScope
            itemType="https://schema.org/Product"
        >
            <meta itemProp="sku" content={product.sku} />
            <meta itemProp="mpn" content={product.mpn} />
            <meta itemProp="brand" content="VENEFICUS" />

            <div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl"
                    itemProp="name"
                >
                    {product.name}
                </motion.h1>

                {/* <div className="mt-3">
                    <div className="flex items-center">
                        <StarRating
                            rating={product.rating}
                            reviewCount={product.reviewCount}
                            className="text-[var(--main-color)]"
                        />
                        <a
                            href="#reviews"
                            className="ml-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                            {product.reviewCount} تقييم
                        </a>
                    </div>
                </div> */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-6"
                >
                    <PriceDisplay
                        price={product.has_discount === 1 ? product?.discounted_price : product?.price}
                        compareAtPrice={product.has_discount === 1 ? product?.price : undefined}
                        className="font-semibold text-xl sm:text-2xl text-[var(--text-primary)]"
                        style={{ fontFamily: 'var(--font-heading-family)' }}
                    />
                </motion.div>

                <div className="mt-6">
                    <h2 className="sr-only">{t('product.description')}</h2>
                    <div
                        className="text-base text-[var(--text-secondary)] prose max-w-none"
                        itemProp="description"
                    >
                        {product.description || 'No description available'}
                    </div>
                </div>

                {/* Color Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-8"
                >
                    <label className="block text-base font-semibold text-[var(--text-primary)] mb-4">Color</label>
                    <div className="flex flex-wrap gap-3">
                        {getAvailableColors().map((color, index) => (
                            <motion.button
                                key={color.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                                whileHover={{ scale: 1.15, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setSelectedColor(color);
                                    selectColor(color.hex_code || color.color);
                                    if (selectedSize && !isVariantAvailable(color.id, selectedSize.id)) {
                                        setSelectedSize(null);
                                    }
                                }}
                                className={`w-14 h-14 rounded-full border-2 transition-all shadow-lg ${selectedColor?.id === color.id
                                    ? 'ring-4 ring-[var(--main-color)] ring-offset-2'
                                    : 'border-gray-300'
                                    }`}
                                style={{ backgroundColor: color.hex_code || color.color }}
                                title={color.name}
                            />
                        ))}
                    </div>
                    {selectedColor && (
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                            Selected: {selectedColor.name}
                        </p>
                    )}
                </motion.div>

                {/* Size Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-8"
                >
                    <label className="block text-base font-semibold text-[var(--text-primary)] mb-4">Size</label>
                    <div className="grid grid-cols-4 gap-3">
                        {getAvailableSizes().map((size, index) => {
                            const isDisabled = selectedColor && !isVariantAvailable(selectedColor.id, size.id);
                            return (
                                <motion.button
                                    key={size.id}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                                    whileHover={!isDisabled ? { scale: 1.05, y: -2 } : {}}
                                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                                    onClick={() => {
                                        if (!isDisabled) {
                                            setSelectedSize(size);
                                            selectSize(size.name);
                                        }
                                    }}
                                    disabled={isDisabled}
                                    className={`p-3 border-2 rounded-xl text-sm font-semibold transition-all shadow-md ${selectedSize?.id === size.id
                                        ? 'bg-[var(--main-color)] text-white border-[var(--main-color)] shadow-lg shadow-[var(--main-color)]/30'
                                        : isDisabled
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                            : 'hover:border-[var(--main-color)] hover:text-[var(--main-color)] bg-white'
                                        }`}
                                >
                                    {size.name}
                                </motion.button>
                            );
                        })}
                    </div>
                    {selectedSize && (
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                            Selected: {selectedSize.name}
                        </p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between w-[70%] m-auto"
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full"
                    >
                        <AddToCartButton
                            className="w-full shadow-xl shadow-[var(--main-color)]/20"
                            product={product}
                            selectedVariant={selectedColor && selectedSize ? { colorId: selectedColor.id, sizeId: selectedSize.id } : null}
                            disabled={!selectedColor || !selectedSize || !isVariantAvailable(selectedColor?.id, selectedSize?.id)}
                        />
                    </motion.div>
                </motion.div>

                {(!selectedColor || !selectedSize) && (
                    <p className="mt-3 text-sm text-red-500 text-center">
                        Please select both color and size to add to cart
                    </p>
                )}

                <div className="mt-8 w-full m-auto flex justify-end">
                    <ShareButtons />
                </div>

                <div className="mt-8 border-t border-[var(--border-color)] pt-8">
                    <dl className="text-sm text-[var(--text-light)]">
                        <div className="flex justify-between py-2 border-b border-[var(--gray-light)]">
                            <dt className="font-medium text-[var(--text-secondary)]">{t('product.availability')}:</dt>
                            <dd>{totalStock > 0 ? t('product.inStock') : t('product.outOfStock')}</dd>
                        </div>
                        {/* <div className="flex justify-between py-2 border-b border-[var(--gray-light)]">
                            <dt className="font-medium text-[var(--text-secondary)]">{t('product.shipping')}:</dt>
                            <dd>{t('product.freeShipping')}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[var(--gray-light)]">
                            <dt className="font-medium text-[var(--text-secondary)]">{t('product.returns')}:</dt>
                            <dd>{t('product.returnPolicy')}</dd>
                        </div>
                        <div className="flex justify-between py-2">
                            <dt className="font-medium text-[var(--text-secondary)]">{t('product.sku')}:</dt>
                            <dd>{product.sku}</dd>
                        </div> */}
                    </dl>
                </div>
            </div>

            <div className="mt-8 border-t border-[var(--border-color)] pt-8">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Description</h3>
                <div className="text-base text-[var(--text-secondary)] prose max-w-none">
                    {product.description || 'No description available'}
                </div>
            </div>

            {/* Schema.org structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schemaData)
                }}
            />
        </motion.div>
    );
}

export { ProductDetails };
export default memo(ProductDetails);