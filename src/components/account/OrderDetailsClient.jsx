'use client';

import { useOrders } from '@/hooks/useOrders';
import { OrderDetails } from '@/components/account/OrderDetails';

export function OrderDetailsClient({ orderId }) {
    const { useOrder } = useOrders();
    const { order, loading, error } = useOrder(orderId);


    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto bg-[var(--card-bg)] rounded-lg p-8 text-center">
                    <p style={{ fontFamily: 'var(--font-body-family)' }}>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto bg-[var(--card-bg)] rounded-lg p-8">
                    <h1
                        className="text-2xl font-bold mb-4"
                        style={{
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-heading-family)'
                        }}
                    >
                        Order Not Found
                    </h1>
                    <p
                        className="text-[var(--text-secondary)] mb-6"
                        style={{ fontFamily: 'var(--font-body-family)' }}
                    >
                        The order you're looking for doesn't exist or you don't have permission to view it.
                    </p>
                    <div className="flex space-x-4">
                        <a
                            href="/orders"
                            className="inline-block px-4 py-2 bg-[var(--main-color)] text-[var(--text-white)] rounded-md hover:bg-[var(--main-color-hover)]"
                            style={{ fontFamily: 'var(--font-body-family)' }}
                        >
                            View All Orders
                        </a>
                        <a
                            href="/products"
                            className="inline-block px-4 py-2 bg-[var(--gray-light)] text-[var(--text-primary)] rounded-md hover:bg-[var(--gray)]"
                            style={{ fontFamily: 'var(--font-body-family)' }}
                        >
                            Continue Shopping
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return <OrderDetails order={order} />;
}