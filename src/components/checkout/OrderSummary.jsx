"use client";
import PriceDisplay from '@/components/common/PriceDisplay';
import { Button } from '@/components/ui/Button';
import { CouponCode } from '../cart/CouponCode';
import { ShippingCalculator } from '../cart/ShippingCalculator';
import { useUnifiedCartStore } from '@/store/unifiedCartStore';
import { useUserStore } from '@/store/userStore';
import { useOrdersStore } from '@/store/ordersStore';
import { useMemo, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LazyImage from '../common/LazyImage';

export function OrderSummary({ items, showPromoCode = false, showShippingOptions = false }) {
    const { getCartCalculations, clearCart } = useUnifiedCartStore();
    const { user, addresses, isAuthenticated, getTax } = useUserStore();
    const { createOrder } = useOrdersStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [taxRate, setTaxRate] = useState(0);
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || 'en';

    useEffect(() => {
        setTaxRate(getTax());
    }, [getTax]);

    const getTranslatedName = (product) => {
        if (!product?.translations) return product?.name || 'Product';
        const translation = product.translations.find(t => t.locale === locale);
        return translation?.name || product.name || 'Product';
    };

    const calculations = useMemo(() => getCartCalculations(), [getCartCalculations]);
    const { subtotal, tax, finalTotal: total, discount } = calculations;

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        try {
            // Validate user authentication
            if (!isAuthenticated || !user?.id) {
                alert('Please sign in to place an order');
                // router.push(`/${locale}/login`);
                return;
            }

            // Get default address or first address
            const shippingAddress = addresses.find(addr => addr.isDefault) || addresses[0];
            if (!shippingAddress) {
                alert('Please add a shipping address');
                router.push(`/${locale}/account/addresses`);
                return;
            }

            // Create order data
            const orderData = {
                user_id: user.id,
                address_id: shippingAddress.id,
                total_amount: total,
                items: items,
                subtotal,
                tax,
                discount
            };

            // Create order with API integration
            await createOrder(orderData);

            // Clear cart
            await clearCart();

            // Redirect to orders page with proper locale
            router.push(`/${locale}/orders`);
        } catch (error) {

            alert('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };
    const handleCalculateShipping = () => {

    };
    const isShippingCalculated = false;
    const shippingCost = 0;
    return (
        <div
            className="bg-[var(--background)] rounded-lg p-6"
            style={{ borderColor: 'var(--border-color)' }}
        >
            <h2
                className="text-xl font-bold mb-6"
                style={{ color: 'var(--text-primary)' }}
            >
                Order Summary
            </h2>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)]"
                    >
                        {/* Image */}
                        <div className="relative h-10 w-10 rounded overflow-hidden">
                            <LazyImage
                                src={item?.product?.image ? `https://veneficus.asbackend.com/${item.product.image}` : '/images/placeholder.jpg'}
                                alt={item.product?.name || 'Product'}
                                fill
                                className="object-cover h-10 w-10"
                            />
                        </div>

                        {/* Name */}
                        <p
                            className="text-sm font-medium truncate"
                            style={{ color: "var(--text-primary)", fontFamily: "var(--font-body-family)" }}
                        >
                            {getTranslatedName(item.product)}
                        </p>

                        {/* Quantity */}
                        <p
                            className="text-sm text-[var(--text-light)]"
                            style={{ fontFamily: "var(--font-body-family)" }}
                        >
                            {item.quantity} ×
                        </p>

                        {/* Price */}
                        <PriceDisplay
                            price={item.product?.discounted_price ? item.product.discounted_price : (item.product?.price || item.piece_price)}
                            className="text-sm font-medium"
                            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body-family)" }}
                        />
                    </div>
                ))}
            </div>

            <div className="my-6 border-t border-b py-4" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex justify-between mb-2">
                    <span style={{ color: 'var(--text-light)' }}>Subtotal</span>
                    <PriceDisplay
                        price={subtotal}
                        className="text-sm"
                        style={{ color: 'var(--text-primary)' }}
                    />
                </div>

                {/* {showShippingOptions && (
                    <div className="mt-4">
                        <ShippingCalculator
                            onCalculate={handleCalculateShipping}
                            isCalculated={isShippingCalculated}
                        />
                    </div>
                )} */}

                {isShippingCalculated && (
                    <div className="flex justify-between mt-2">
                        <span style={{ color: 'var(--text-light)' }}>Shipping</span>
                        <PriceDisplay
                            price={shippingCost}
                            className="font-medium"
                            style={{ color: 'var(--text-primary)' }}
                        />
                    </div>
                )}

                <div className="flex justify-between mt-2">
                    <span style={{ color: 'var(--text-light)' }}>Tax ({taxRate}%)</span>
                    <PriceDisplay
                        price={tax}
                        className="font-medium"
                        style={{ color: 'var(--text-primary)' }}
                    />
                </div>
                {/* 
                {discount > 0 && (
                    <div className="flex justify-between mt-2 text-green-600">
                        <span>Discount</span>
                        <PriceDisplay
                            price={-discount}
                            className="font-medium"
                        />
                    </div>
                )} */}
            </div>

            <div className="flex justify-between font-bold text-lg mb-6">
                <span style={{ color: 'var(--text-primary)' }}>Total</span>
                <PriceDisplay
                    price={total}
                    style={{ color: 'var(--text-primary)' }}
                />
            </div>

            {/* {showPromoCode && (
                <div className="mb-6">
                    <CouponCode />
                </div>
            )} */}


            <Button
                className="w-full"
                style={{
                    backgroundColor: 'var(--main-color)',
                    fontFamily: 'var(--font-body-family)'
                }}
                onClick={handlePlaceOrder}
                disabled={isProcessing}
            >
                {isProcessing ? 'Processing...' : 'Place Order'}
            </Button>

            {/* <div className="mt-4 text-center">
                <p
                    className="text-sm"
                    style={{ color: 'var(--text-light)' }}
                >
                    Secured checkout with SSL encryption
                </p>
            </div> */}
        </div>
    );
}