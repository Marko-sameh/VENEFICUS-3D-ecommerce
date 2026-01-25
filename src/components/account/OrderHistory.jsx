"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/common/Pagination";
import { OrderCard } from "./OrderCard";
import { useOrders } from "@/hooks/useOrders";
import { PackageOpen, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function OrderHistory({ orders = [], limit = 10, showPagination = true, isLoading = false }) {
    const { currentPage, setCurrentPage } = useOrders();

    const totalPages = Math.ceil(orders.length / limit);
    const paginatedOrders = orders.slice(
        (currentPage - 1) * limit,
        currentPage * limit
    );

    if (isLoading) {
        return (
            <Card className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-color)] mx-auto"></div>
                <p className="mt-4 text-[var(--text-secondary)]">Loading orders...</p>
            </Card>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <Card className="p-12 text-center border-0 bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-secondary)]">
                <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-[var(--main-color)] bg-opacity-10 rounded-full">
                        <PackageOpen className="w-12 h-12 text-[var(--main-color)]" />
                    </div>
                    <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        No Orders Yet
                    </h3>
                    <p className="text-[var(--text-secondary)] max-w-md">
                        You haven't placed any orders yet. Start shopping to see your order history here.
                    </p>
                    <Link
                        href="/shop"
                        className="mt-6 px-6 py-3 bg-[var(--main-color)] text-white rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Start Shopping
                    </Link>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Orders List */}
            <div className="space-y-4">
                {paginatedOrders.map((order, index) => (
                    <motion.div
                        key={order.id || order.orderNumber || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <OrderCard order={order} />
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {showPagination && totalPages > 1 && (
                <div className="flex justify-center pt-6">
                    <Pagination
                        currentPage={currentPage.toString()}
                        totalPages={totalPages.toString()}
                        onPageChange={(page) => setCurrentPage(Number(page))}
                    />
                </div>
            )}
        </div>
    );
}
