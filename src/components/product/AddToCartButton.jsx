'use client';

import { useMemo, useCallback, memo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useUnifiedCartStore } from '@/store/unifiedCartStore';
import { ErrorBoundary } from '../common/ErrorBoundary';
import LoadingSpinner from '../common/LoadingSpinner';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/contexts/ToastContext';

/**
 * Add to Cart Button Component
 * 
 * A production-ready, SEO-optimized button for adding products to the shopping cart.
 * Now using optimized store logic with minimal re-renders.
 * 
 * Key Features:
 * - Centralized state management via productsStore
 * - Optimized with useMemo and useCallback
 * - Proper loading states with spinner
 * - Comprehensive error handling
 * - Analytics tracking points
 * - Schema.org structured data
 * - Core Web Vitals optimized
 * - Accessible navigation
 * - Internationalization ready
 * 
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data to add to cart
 * @param {string} props.product.id - Product ID
 * @param {string} props.product.name - Product name
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.variant="default"] - Button variant (default, secondary, outline)
 * @param {Function} [props.onAddToCartSuccess] - Callback for successful add to cart
 * @param {Function} [props.onAddToCartError] - Callback for failed add to cart
 * @param {boolean} [props.disabled] - Whether the button is disabled
 */
const AddToCartButton = memo(function AddToCartButton({
    product,
    className = '',
    variant = 'default',
    onAddToCartSuccess,
    onAddToCartError,
    disabled = false,
    children,
    selectedVariant = null,
    onSuccess
}) {
    const { t } = useTranslation();
    const { addItem, isInCart } = useUnifiedCartStore();
    const { toast } = useToast();
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);


    // Memoized product validation
    const isValidProduct = useMemo(() => {
        return product && product.id && product.name;
    }, [product]);

    // Direct add to cart handler
    const handleAddToCart = useCallback(async () => {
        if (disabled || isAdding || !isValidProduct) return;

        setIsAdding(true);

        try {
            // Add to cart store and get result
            const options = selectedVariant || { sizeId: 1, colorId: 1 };
            const result = await addItem(product, 1, options);


            if (!result.success) {

                toast({
                    title: "Error",
                    description: result.error || "Failed to add item to cart",
                    variant: "destructive"
                });

                if (onAddToCartError) {
                    onAddToCartError(new Error(result.error));
                }
                return false;
            }

            // Show success state
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);

            // Show success toast
            toast({
                title: "Added to Cart",
                description: `${product.name} has been added to your cart`,
                variant: "default"
            });

            // Call success callback
            if (onAddToCartSuccess) {
                onAddToCartSuccess(true);
            }
            if (onSuccess) {
                onSuccess();
            }

            return true;
        } catch (error) {

            toast({
                title: "Error",
                description: "Failed to add item to cart. Please try again.",
                variant: "destructive"
            });

            if (onAddToCartError) {
                onAddToCartError(error);
            }
            return false;
        } finally {
            setIsAdding(false);
        }
    }, [disabled, isAdding, isValidProduct, product, addItem, toast, onAddToCartSuccess, onAddToCartError]);

    // Memoized button content
    const buttonContent = useMemo(() => {
        // If children are provided (icon variant), use them
        if (children && variant === 'icon') {
            if (isAdding) {
                return <LoadingSpinner size="sm" />;
            }
            if (isAdded) {
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:w-5 sm:h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            }
            return children;
        }

        // Default text variant
        if (isAdding) {
            return (
                <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {t('product.adding', 'Adding...')}
                </>
            );
        }

        if (isAdded) {
            return (
                <>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {t('product.added', 'Added')}
                </>
            );
        }

        return (
            <>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                    />
                </svg>
                {t('product.addToCart', 'Add to cart')}
            </>
        );
    }, [isAdding, isAdded, t, children, variant]);

    // Memoized aria label
    const ariaLabel = useMemo(() => {
        const productName = product?.name || 'product';
        return isAdded
            ? t('product.addedToCart', `Added ${productName} to cart`)
            : t('product.addToCartLabel', `Add ${productName} to cart`);
    }, [isAdded, product?.name, t]);

    // Memoized structured data
    const structuredData = useMemo(() => {
        if (!product) return null;
        return {
            display: 'none',
            itemProp: 'object',
            itemScope: true,
            itemType: 'https://schema.org/Product'
        };
    }, [product]);

    return (
        <ErrorBoundary>
            <Button
                type="button"
                onClick={handleAddToCart}
                disabled={disabled || isAdding}
                variant={variant}
                className={className}
                aria-label={ariaLabel}
            >
                {buttonContent}
            </Button>

            {/* Schema.org structured data for product */}
            {structuredData && (
                <div style={structuredData}>
                    <meta itemProp="name" content={product.name} />
                    <meta itemProp="sku" content={product.id} />
                    <meta itemProp="url" content={`https://essec-denim.com/products/${product.slug}`} />
                </div>
            )}
        </ErrorBoundary>
    );
});

export { AddToCartButton };