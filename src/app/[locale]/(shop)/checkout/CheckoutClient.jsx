'use client';

import { useUnifiedCartStore } from '@/store/unifiedCartStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ProgressSteps } from '@/components/checkout/ProgressSteps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useEffect } from 'react';
import { CartDrawer } from '@/components/cart/CartDrawer';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { motion } from 'framer-motion';

export function CheckoutClient() {
    const { t } = useTranslation();
    const { items, itemCount, init } = useUnifiedCartStore();
    const { isAuthenticated, user, refreshAuth } = useAuth();
    const isEmpty = itemCount === 0;




    const handleLoginSuccess = () => {
        refreshAuth();
        window.location.reload();
    };

    useEffect(() => {
        init();
    }, [init]);

    // Empty cart case
    if (isEmpty) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Card className="max-w-md mx-auto border border-[var(--border-color)] shadow-sm">
                    <CardHeader>
                        <CardTitle
                            className="text-xl text-center"
                            style={{
                                fontFamily: "var(--font-heading-family)",
                                color: "var(--text-primary)",
                            }}
                        >
                            {t('checkout.emptyCart', 'Your Cart is Empty')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto text-[var(--gray)] mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>

                        <p
                            className="mb-6"
                            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body-family)" }}
                        >
                            {t('checkout.emptyCartMessage', 'There are no items in your cart. Add some products to proceed to checkout.')}
                        </p>

                        <Button
                            asChild
                            className="px-4 py-2 rounded-md"
                            style={{
                                backgroundColor: "var(--main-color)",
                                color: "var(--text-white)",
                            }}
                        >
                            <a href="/shop">{t('checkout.continueShopping', 'Continue Shopping')}</a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Authentication required case
    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Card className="max-w-md mx-auto border border-[var(--border-color)] shadow-sm">
                    <CardHeader>
                        <CardTitle
                            className="text-xl text-center"
                            style={{
                                fontFamily: "var(--font-heading-family)",
                                color: "var(--text-primary)",
                            }}
                        >
                            {t('checkout.loginRequired', 'Sign In Required')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto text-[var(--main-color)] mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>

                        <p
                            className="mb-6"
                            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body-family)" }}
                        >
                            {t('checkout.loginMessage', 'You must sign in to your account to continue with checkout.')}
                        </p>

                        <GoogleSignInButton onSuccess={handleLoginSuccess} />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center"
            >
                <h1 className="text-4xl md:text-6xl font-heading font-bold text-[var(--text-primary)] mb-4">
                    {t('checkout.title', 'Checkout')}
                </h1>
                <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: 64 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="block mx-auto h-1 bg-gradient-to-r from-transparent via-[var(--main-color)] to-transparent"
                />
                <p className="text-[var(--text-secondary)] mt-4">
                    {t('checkout.subtitle', 'Complete your purchase in 4 easy steps')}
                </p>
            </motion.div>

            {/* <ProgressSteps steps={[
                { id: "cart", name: t('checkout.steps.cart', 'Cart'), href: "/cart", status: "complete" },
                { id: "information", name: t('checkout.steps.information', 'Information'), href: "#", status: "current" },
                { id: "shipping", name: t('checkout.steps.shipping', 'Shipping'), href: "#", status: "upcoming" },
                { id: "payment", name: t('checkout.steps.payment', 'Payment'), href: "#", status: "upcoming" }
            ]} /> */}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                <Card className="lg:col-span-2 shadow-xl">
                    <CardContent className="p-6">
                        <CheckoutForm
                            items={items}
                            user={user}
                            isLoggedIn={isAuthenticated}
                        />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-1 shadow-xl">
                    <CardContent className="p-6">
                        <OrderSummary items={items || []} showPromoCode={true} showShippingOptions={true} />
                    </CardContent>
                </Card>
            </motion.div>
            {/* <CartDrawer isOpen={true}></CartDrawer> */}
        </div>
    );
}