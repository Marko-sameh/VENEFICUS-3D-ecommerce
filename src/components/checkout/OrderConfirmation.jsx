import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/common/PriceDisplay';
import { LazyImage } from '@/components/common/LazyImage';
import { formatAddress } from '@/lib/formatters';

export function OrderConfirmation({ order }) {
    return (
        <div className="bg-[var(--background)] rounded-lg p-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                <h1
                    className="text-2xl font-bold mb-2"
                    style={{
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-heading-family)'
                    }}
                >
                    Thank You for Your Order!
                </h1>

                <p
                    className="text-[var(--text-secondary)]"
                    style={{ fontFamily: 'var(--font-body-family)' }}
                >
                    Order #{order.orderNumber} has been confirmed and will be processed shortly.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Order Summary */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2
                            className="text-xl font-bold mb-4"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Order Details
                        </h2>

                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex">
                                    <div className="w-20 h-20 flex-shrink-0">
                                        <LazyImage
                                            src={item.image}
                                            alt={item.name}
                                            width={80}
                                            height={80}
                                            className="object-cover rounded"
                                        />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <h3
                                            className="font-medium"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {item.name}
                                        </h3>
                                        <p
                                            className="text-sm"
                                            style={{ color: 'var(--text-light)' }}
                                        >
                                            {item.quantity} x <PriceDisplay price={item.piece_price || item.price} />
                                        </p>
                                    </div>
                                    <PriceDisplay
                                        price={(item.piece_price || item.price) * item.quantity}
                                        className="font-medium"
                                        style={{ color: 'var(--text-primary)' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="flex justify-between mb-2">
                            <span style={{ color: 'var(--text-light)' }}>Subtotal</span>
                            <PriceDisplay
                                price={order.subtotal}
                                className="font-medium"
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div className="flex justify-between mb-2">
                            <span style={{ color: 'var(--text-light)' }}>Shipping</span>
                            <PriceDisplay
                                price={order.shipping}
                                className="font-medium"
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div className="flex justify-between mb-2">
                            <span style={{ color: 'var(--text-light)' }}>Tax</span>
                            <PriceDisplay
                                price={order.tax}
                                className="font-medium"
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                            <span style={{ color: 'var(--text-primary)' }}>Total</span>
                            <PriceDisplay
                                price={order.total}
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Shipping & Payment */}
                <div className="space-y-6">
                    <div>
                        <h2
                            className="text-xl font-bold mb-4"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Shipping Address
                        </h2>
                        <p style={{ color: 'var(--text-primary)' }}>
                            {formatAddress(order.shippingAddress)}
                        </p>
                    </div>

                    <div>
                        <h2
                            className="text-xl font-bold mb-4"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Payment Method
                        </h2>
                        <div className="flex items-center">
                            <div
                                className="w-8 h-5 rounded bg-gray-200 mr-3"
                                style={{
                                    backgroundImage: `url(/images/${order.paymentMethod.type.toLowerCase()}.svg)`,
                                    backgroundSize: 'contain',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            />
                            <span style={{ color: 'var(--text-primary)' }}>
                                {order.paymentMethod.type} •••• {order.paymentMethod.last4}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h2
                            className="text-xl font-bold mb-4"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Estimated Delivery
                        </h2>
                        <p style={{ color: 'var(--text-primary)' }}>
                            {order.estimatedDelivery}
                        </p>
                        <p
                            className="text-sm mt-1"
                            style={{ color: 'var(--text-light)' }}
                        >
                            Standard shipping typically takes 3-5 business days
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    style={{ borderColor: 'var(--border-color)' }}
                >
                    View Order Details
                </Button>
                <Button
                    className="w-full sm:w-auto"
                    style={{
                        backgroundColor: 'var(--main-color)',
                        fontFamily: 'var(--font-body-family)'
                    }}
                >
                    Continue Shopping
                </Button>
            </div>

            <div className="mt-8 p-4 bg-[var(--gray-light)] rounded-lg">
                <h3
                    className="font-medium mb-2"
                    style={{ color: 'var(--text-primary)' }}
                >
                    What Happens Next?
                </h3>
                <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--text-light)' }}>
                    <li>You'll receive an order confirmation email shortly</li>
                    <li>Your order will be processed and shipped within 1-2 business days</li>
                    <li>You'll receive a shipping confirmation email with tracking information</li>
                    <li>Track your order in your account under "Order History"</li>
                </ul>
            </div>
        </div>
    );
}