'use client';

import { memo, useEffect, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { usePricing } from '@/hooks/useUi';

/**
 * SEO-Optimized Price Display Component with Multi-Language Support
 * Works seamlessly with Laravel backend API responses
 * 
 * @param {number} price - Raw price value (e.g., 1999 for 19.99 EUR)
 * @param {number} [compareAtPrice] - Original price before discount
 * @param {string} [currency="EUR"] - ISO 4217 currency code (EUR, USD, etc.)
 * @param {string} [availability="https://schema.org/InStock"] - Product availability status
 * @param {string} [className=""] - Custom CSS classes
 * 
 * @example
 * // From Laravel API response
 * <PriceDisplay 
 *   price={product.price} 
 *   compareAtPrice={product.compare_at_price}
 *   currency={product.currency}
 *   availability={product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}
 * />
 */
const PriceDisplay = memo(function PriceDisplay({
    price,
    compareAtPrice,
    currency = "EUR",
    availability = "https://schema.org/InStock",
    className = ""
}) {
    const { t } = useTranslation();
    const { locale, formatPriceData, initializeLocale } = usePricing();

    // Initialize locale on mount
    useEffect(() => {
        initializeLocale();
    }, [initializeLocale]);

    // Memoized price formatting
    const priceData = useMemo(() => {
        const currentPrice = parseFloat(price || 0);
        const originalPrice = parseFloat(compareAtPrice || 0);

        return formatPriceData(currentPrice, originalPrice, currency, locale);
    }, [formatPriceData, price, compareAtPrice, currency, locale]);

    // 3. SEO-critical Schema.org structured data
    const renderSchemaMarkup = () => (
        <span
            itemScope
            itemType="https://schema.org/Offer"
            itemProp="offers"
            style={{ display: 'none' }} // Hidden from UI but visible to crawlers
        >
            <meta itemProp="price" content={parseFloat(price || 0).toFixed(2)} />
            <meta itemProp="priceCurrency" content={currency} />
            <link itemProp="availability" href={availability} />
            {compareAtPrice && (
                <meta
                    itemProp="priceValidUntil"
                    content={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}
                />
            )}
        </span>
    );

    // Handle invalid price data gracefully
    if (priceData.error) {
        
        return (
            <div className={`text-red-500 ${className}`} aria-live="polite">
                {t('pricing.priceUnavailable', 'Price unavailable')}
            </div>
        );
    }

    const { formattedPrice, formattedComparePrice, discountPercentage } = priceData;

    return (
        <span className={`font-bold text-lg ${className}`}>
            {renderSchemaMarkup()}

            <span className="flex flex-col sm:flex-row sm:items-center gap-2 ">
                <span className="flex items-baseline gap-2 flex-wrap">
                    {formattedComparePrice && (
                        <span className="text-[var(--gray)] line-through text-base">
                            {formattedComparePrice}
                        </span>
                    )}

                    <span className="text-[var(--foreground)] font-bold">
                        {formattedPrice}
                    </span>
                </span>

                {discountPercentage && (
                    <span className="bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded 
                    self-start sm:self-auto whitespace-nowrap
                    mt-1 sm:mt-0">
                        {t('pricing.save', 'Save')} {discountPercentage}%
                    </span>
                )}
            </span>
        </span>
    );
});

export default PriceDisplay;