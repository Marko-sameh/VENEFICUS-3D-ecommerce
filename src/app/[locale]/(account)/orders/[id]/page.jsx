'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useOrdersStore } from '@/store/ordersStore';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Calendar, CreditCard, MapPin } from 'lucide-react';
import { API_BASE_URL } from '@/lib';

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params.id;
    const locale = params.locale;
    const { orders } = useOrdersStore();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const foundOrder = orders.find(o => o.id === parseInt(orderId));
        setOrder(foundOrder);
    }, [orderId, orders]);

    if (!order) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-color)] mx-auto"></div>
                <p className="mt-4 text-[var(--text-secondary)]">Loading order...</p>
            </div>
        );
    }

    const statusConfig = {
        delivered: { color: 'emerald', icon: '✓' },
        processing: { color: 'blue', icon: '⏳' },
        shipped: { color: 'purple', icon: '📦' },
        default: { color: 'gray', icon: '•' }
    };
    const status = statusConfig[order.status] || statusConfig.default;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
        >
            <Link href={`/${locale}/orders`} className="inline-flex items-center gap-2 text-[var(--main-color)] mb-8 hover:opacity-80">
                <ArrowLeft className="w-4 h-4" />
                Back to Orders
            </Link>

            {/* Header */}
            <div className="bg-[var(--card-bg)] rounded-xl p-8 mb-6 shadow-sm border border-[var(--border-color)]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                            Order #{order.order_number || order.id}
                        </h1>
                        <p className="text-[var(--text-secondary)] flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg text-sm font-semibold bg-${status.color}-50 text-${status.color}-700`}>
                        {status.icon} {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                    </div>
                </div>
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)]">
                    <div className="flex items-center gap-3 mb-3">
                        <CreditCard className="w-5 h-5 text-[var(--main-color)]" />
                        <p className="text-sm text-[var(--text-secondary)]">Payment Method</p>
                    </div>
                    <p className="text-lg font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
                        {order.payment_method}
                    </p>
                </div>

                <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)]">
                    <div className="flex items-center gap-3 mb-3">
                        <Package className="w-5 h-5 text-[var(--main-color)]" />
                        <p className="text-sm text-[var(--text-secondary)]">Items</p>
                    </div>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {order.items?.length || 0} items
                    </p>
                </div>

                <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)]">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">💰</span>
                        <p className="text-sm text-[var(--text-secondary)]">Total Amount</p>
                    </div>
                    <p className="text-lg font-semibold" style={{ color: 'var(--main-color)' }}>
                        ${parseFloat(order.total_amount).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-[var(--card-bg)] rounded-xl p-8 border border-[var(--border-color)]">
                <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                    Order Items
                </h2>
                <div className="space-y-4">
                    {order.items?.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex gap-4 p-4 rounded-lg border border-[var(--border-color)] hover:shadow-md transition-shadow"
                        >
                            {item.image ? (
                                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                        src={`${API_BASE_URL}/${item.image}`}
                                        alt={item.product_name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Package className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                                    {item.product_name}
                                </h3>
                                <div className="flex flex-wrap gap-3 mt-2 text-sm text-[var(--text-secondary)]">
                                    <span>Size: <strong>{item.size}</strong></span>
                                    <span>Color: <strong>{item.color}</strong></span>
                                    <span>Qty: <strong>{item.quantity}</strong></span>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-sm text-[var(--text-secondary)] mb-1">Price</p>
                                <p className="text-lg font-bold" style={{ color: 'var(--main-color)' }}>
                                    ${parseFloat(item.total_price).toFixed(2)}
                                </p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">
                                    ${parseFloat(item.price).toFixed(2)} × {item.quantity}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-[var(--card-bg)] rounded-xl p-8 mt-6 border border-[var(--border-color)]">
                <div className="flex ">
                    <div className="w-full ">
                        <div className="space-y-3 border-b border-[var(--border-color)] pb-4 mb-4">
                            <div className="flex justify-between text-[var(--text-secondary)]">
                                <span>Subtotal</span>
                                <span>${parseFloat(order.total_amount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[var(--text-secondary)]">
                                <span>Shipping</span>
                                <span>Included</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-xl font-bold" style={{ color: 'var(--main-color)' }}>
                            <span>Total</span>
                            <span>${parseFloat(order.total_amount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
