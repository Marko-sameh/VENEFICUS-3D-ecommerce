import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/formatters';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Package, Calendar, DollarSign } from 'lucide-react';
import { API_BASE_URL } from '@/lib';

export function OrderCard({ order }) {
    const items = order.items || [];
    const firstProduct = items[0] || { product_name: '', image: null };
    const params = useParams();
    const locale = params?.locale || 'en';

    const statusConfig = {
        delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: '✓ Delivered' },
        processing: { bg: 'bg-blue-50', text: 'text-blue-700', label: '⏳ Processing' },
        shipped: { bg: 'bg-purple-50', text: 'text-purple-700', label: '📦 Shipped' },
        default: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Pending' }
    };

    const status = statusConfig[order.status?.toLowerCase()] || statusConfig.default;
    const totalAmount = parseFloat(order.total_amount || 0);

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                    {/* Product Image */}
                    <div className="md:w-24 flex-shrink-0">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                            {firstProduct.image ? (
                                <Image
                                    src={`${API_BASE_URL}/${firstProduct.image}`}
                                    alt={firstProduct.product_name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-8 h-8 text-gray-300" />
                                </div>
                            )}
                            {items.length > 1 && (
                                <div className="absolute -bottom-1 -right-1 bg-[var(--main-color)] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                                    +{items.length - 1}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                                        {firstProduct.product_name}
                                        {items.length > 1 && <span className="text-sm font-normal text-[var(--text-secondary)]"> +{items.length - 1} more</span>}
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                                        Order #{order.order_number || order.id}
                                    </p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                                    {status.label}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {order.created_at ? formatDate(order.created_at) : 'Unknown date'}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Package className="w-4 h-4" />
                                    {items.reduce((sum, item) => sum + (item.quantity || 0), 0)} items
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary & Action */}
                    <div className="md:w-48 flex flex-col justify-between items-end">
                        <div className="text-right">
                            <p className="text-xs text-[var(--text-secondary)] mb-1">Total Amount</p>
                            <p className="text-2xl font-bold" style={{ color: 'var(--main-color)' }}>
                                ${totalAmount.toFixed(2)}
                            </p>
                        </div>

                        <Link href={`/${locale}/orders/${order.id}`} className="w-full">
                            <Button
                                className="w-full bg-[var(--main-color)] hover:opacity-90 text-white"
                                size="sm"
                            >
                                View Details
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
