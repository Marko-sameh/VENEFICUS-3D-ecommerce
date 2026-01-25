import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/lib/formatters';
import { useOrders } from '@/hooks/useOrders';

export function OrderTracking({ order }) {
    const { getOrderTracking } = useOrders();
    const { trackingStages, progress } = getOrderTracking(order);

    return (
        <Card>
            <CardHeader>
                <CardTitle
                    className="text-lg"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Order Tracking
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {trackingStages.map((stage, index) => {
                            const isCompleted = stage.date && (() => {
                                try {
                                    return new Date(stage.date) <= new Date();
                                } catch {
                                    return false;
                                }
                            })();
                            
                            return (
                                <div
                                    key={stage.id}
                                    className="text-center flex-1"
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                            isCompleted
                                                ? 'bg-[var(--main-color)] text-white'
                                                : 'bg-[var(--gray-light)] text-[var(--text-light)]'
                                        }`}
                                    >
                                        {index + 1}
                                    </div>
                                    <p
                                        className="text-sm font-medium"
                                        style={{
                                            color: isCompleted
                                                ? 'var(--text-primary)'
                                                : 'var(--text-light)'
                                        }}
                                    >
                                        {stage.label}
                                    </p>
                                    {stage.date && (
                                        <p
                                            className="text-xs mt-1"
                                            style={{ color: 'var(--text-light)' }}
                                        >
                                            {formatDate(stage.date)}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* <Progress
                        value={progress}
                        style={{
                            backgroundColor: 'var(--gray-light)',
                            '--progress-background': 'var(--main-color)'
                        }}
                    /> */}
                </div>

                {order.trackingNumber && (
                    <div
                        className="p-4 rounded-lg"
                        style={{
                            backgroundColor: 'var(--gray-light)',
                            borderColor: 'var(--border-color)'
                        }}
                    >
                        <h3
                            className="font-medium mb-2"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Tracking Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p
                                    className="text-sm"
                                    style={{ color: 'var(--text-light)' }}
                                >
                                    Carrier
                                </p>
                                <p style={{ color: 'var(--text-primary)' }}>
                                    {order.carrier}
                                </p>
                            </div>
                            <div>
                                <p
                                    className="text-sm"
                                    style={{ color: 'var(--text-light)' }}
                                >
                                    Tracking Number
                                </p>
                                <p style={{ color: 'var(--text-primary)' }}>
                                    {order.trackingNumber}
                                </p>
                            </div>
                        </div>

                        {order.estimatedDelivery && (
                            <div className="mt-4">
                                <p
                                    className="text-sm"
                                    style={{ color: 'var(--text-light)' }}
                                >
                                    Estimated Delivery
                                </p>
                                <p style={{ color: 'var(--text-primary)' }}>
                                    {formatDate(order.estimatedDelivery)}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}