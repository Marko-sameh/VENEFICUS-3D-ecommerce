'use client';

import { useEffect } from 'react';
import { CartSummary } from '@/components/cart/CartSummary';
import { CartEmpty } from '@/components/cart/CartEmpty';
import { CartItems } from '@/components/cart/CartItems';
import { useUnifiedCart } from '@/hooks/useUnifiedCart.jsx';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';

/**
 * Cart client component for VENEFICUS store
 * Handles cart state and interactions
 */
export function CartClient() {
    const { t } = useTranslation();
    const { isEmpty, init } = useUnifiedCart();

    useEffect(() => {
        init();
    }, [init]);

    return (
        <main className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-6xl font-heading font-bold text-[var(--text-primary)] mb-4">
                    {t('cart.title', 'Shopping Cart')}
                </h1>
                <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: 64 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="block mx-auto h-1 bg-gradient-to-r from-transparent via-[var(--main-color)] to-transparent"
                />
            </motion.div>

            {isEmpty ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <CartEmpty />
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    <div className="lg:col-span-2">
                        <CartItems />
                    </div>
                    <div className="lg:col-span-1">
                        <CartSummary />
                    </div>
                </motion.div>
            )}
        </main>
    );
}