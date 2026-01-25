'use client';

import { useEffect, useRef } from 'react';
import { useOrdersStore } from '@/store/ordersStore';
import { useUserStore } from '@/store/userStore';
import { OrderHistory } from '@/components/account/OrderHistory';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OrdersClient() {
    const { orders, isLoading, error, fetchOrders } = useOrdersStore();
    const { user, isAuthenticated, initializeUser, isInitialized } = useUserStore();
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!isInitialized && isAuthenticated) {
            initializeUser();
        }
    }, [isInitialized, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated && user?.id && isInitialized && !fetchedRef.current) {
            fetchedRef.current = true;
            fetchOrders();
        }
    }, [isAuthenticated, user?.id, isInitialized]);

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto bg-[var(--card-bg)] rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Please Sign In
                </h1>
                <p className="text-[var(--text-secondary)] mb-6">
                    You need to be logged in to view your order history.
                </p>
                <Link href="/auth/login" className="inline-block px-6 py-2 bg-[var(--main-color)] text-white rounded-md">
                    Sign In
                </Link>
            </div>
        );
    }

    if (isLoading && orders.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-color)] mx-auto"></div>
                <p className="mt-4 text-[var(--text-secondary)]">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto bg-[var(--card-bg)] rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Unable to Load Orders
                </h1>
                <p className="text-[var(--text-secondary)] mb-6">
                    {error}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="inline-block px-4 py-2 bg-[var(--main-color)] text-white rounded-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Order History
                </h1>
                <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: 64 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="block mx-auto h-1 bg-gradient-to-r from-transparent via-[var(--main-color)] to-transparent rounded-full"
                />
            </motion.div>

            <OrderHistory orders={orders} showPagination={true} />
        </>
    );
}
