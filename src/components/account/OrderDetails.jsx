// import { Button } from '@/components/ui/Button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import PriceDisplay from '@/components/common/PriceDisplay';
// import { formatDate, formatAddress } from '@/lib/formatters';
// import { OrderTracking } from './OrderTracking';
// import LazyImage from '../common/LazyImage';
// // import { LazyImage } from '@/components/common/LazyImage';

// export function OrderDetails({ order }) {
//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h1
//                         className="text-2xl font-bold"
//                         style={{ color: 'var(--text-primary)' }}
//                     >
//                         Order #{order.orderNumber}
//                     </h1>
//                     <p
//                         className="text-sm mt-1"
//                         style={{ color: 'var(--text-light)' }}
//                     >
//                         Placed on {formatDate(order.date)}
//                     </p>
//                 </div>

//                 <div className="flex space-x-2">
//                     <Button variant="outline">Track Order</Button>
//                     <Button variant="outline">Invoice</Button>
//                 </div>
//             </div>

//             <Tabs defaultValue="overview" className="w-full">
//                 <TabsList
//                     className="grid w-full grid-cols-3 mb-6"
//                     style={{ backgroundColor: 'var(--gray-light)' }}
//                 >
//                     <TabsTrigger value="overview">Overview</TabsTrigger>
//                     <TabsTrigger value="tracking">Tracking</TabsTrigger>
//                     <TabsTrigger value="billing">Billing</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="overview">
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                         <div className="lg:col-span-2 space-y-6">
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle
//                                         className="text-lg"
//                                         style={{ color: 'var(--text-primary)' }}
//                                     >
//                                         Order Items
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="space-y-4">
//                                         {order.items.map((item, index) => (
//                                             <div key={index} className="flex items-start space-x-4">
//                                                 {item.image ? (
//                                                     <LazyImage
//                                                         src={item.image}
//                                                         alt={item.name}
//                                                         width={80}
//                                                         height={80}
//                                                         className="object-cover rounded"
//                                                     />
//                                                 ) : (
//                                                     <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
//                                                         <span className="text-gray-400 text-xs">No Image</span>
//                                                     </div>
//                                                 )}
//                                                 <div className="flex-1">
//                                                     <h3
//                                                         className="font-medium"
//                                                         style={{ color: 'var(--text-primary)' }}
//                                                     >
//                                                         {item.name}
//                                                     </h3>
//                                                     <p
//                                                         className="text-sm"
//                                                         style={{ color: 'var(--text-light)' }}
//                                                     >
//                                                         Size: {item.size} | Quantity: {item.quantity}
//                                                     </p>
//                                                     <PriceDisplay
//                                                         price={item.price}
//                                                         currency={order.currency}
//                                                         className="mt-1 font-medium"
//                                                     />
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle
//                                         className="text-lg"
//                                         style={{ color: 'var(--text-primary)' }}
//                                     >
//                                         Shipping Address
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <p style={{ color: 'var(--text-primary)' }}>
//                                         {formatAddress(order.shippingAddress)}
//                                     </p>
//                                 </CardContent>
//                             </Card>
//                         </div>

//                         <div className="space-y-6">
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle
//                                         className="text-lg"
//                                         style={{ color: 'var(--text-primary)' }}
//                                     >
//                                         Order Summary
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="space-y-3">
//                                         <div className="flex justify-between">
//                                             <span style={{ color: 'var(--text-light)' }}>Subtotal</span>
//                                             <PriceDisplay
//                                                 price={order.subtotal}
//                                                 currency={order.currency}
//                                             />
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span style={{ color: 'var(--text-light)' }}>Shipping</span>
//                                             <PriceDisplay
//                                                 price={order.shipping}
//                                                 currency={order.currency}
//                                             />
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span style={{ color: 'var(--text-light)' }}>Tax</span>
//                                             <PriceDisplay
//                                                 price={order.tax}
//                                                 currency={order.currency}
//                                             />
//                                         </div>
//                                         <div className="pt-3 border-t flex justify-between font-bold">
//                                             <span style={{ color: 'var(--text-primary)' }}>Total</span>
//                                             <PriceDisplay
//                                                 price={order.total}
//                                                 currency={order.currency}
//                                                 className="text-lg"
//                                             />
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle
//                                         className="text-lg"
//                                         style={{ color: 'var(--text-primary)' }}
//                                     >
//                                         Payment Method
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="flex items-center">
//                                         <div
//                                             className="w-8 h-5 rounded bg-gray-200 mr-3"
//                                             style={{
//                                                 backgroundImage: `url(${order.paymentMethod.icon})`,
//                                                 backgroundSize: 'contain',
//                                                 backgroundPosition: 'center',
//                                                 backgroundRepeat: 'no-repeat'
//                                             }}
//                                         />
//                                         <span style={{ color: 'var(--text-primary)' }}>
//                                             {order.paymentMethod.type} •••• {order.paymentMethod.last4}
//                                         </span>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>
//                     </div>
//                 </TabsContent>

//                 <TabsContent value="tracking">
//                     <OrderTracking order={order} />
//                 </TabsContent>

//                 <TabsContent value="billing">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle
//                                 className="text-lg"
//                                 style={{ color: 'var(--text-primary)' }}
//                             >
//                                 Billing Information
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="space-y-4">
//                                 <div>
//                                     <h4
//                                         className="font-medium mb-2"
//                                         style={{ color: 'var(--text-primary)' }}
//                                     >
//                                         Payment Method
//                                     </h4>
//                                     <div className="flex items-center">
//                                         <div
//                                             className="w-8 h-5 rounded bg-gray-200 mr-3"
//                                             style={{
//                                                 backgroundImage: `url(${order.paymentMethod.icon})`,
//                                                 backgroundSize: 'contain',
//                                                 backgroundPosition: 'center',
//                                                 backgroundRepeat: 'no-repeat'
//                                             }}
//                                         />
//                                         <span style={{ color: 'var(--text-primary)' }}>
//                                             {order.paymentMethod.type} •••• {order.paymentMethod.last4}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <h4
//                                         className="font-medium mb-2"
//                                         style={{ color: 'var(--text-primary)' }}
//                                     >
//                                         Billing Address
//                                     </h4>
//                                     <p style={{ color: 'var(--text-primary)' }}>
//                                         {formatAddress(order.billingAddress)}
//                                     </p>
//                                 </div>

//                                 <div className="flex justify-end">
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         style={{ borderColor: 'var(--border-color)' }}
//                                     >
//                                         Download Invoice
//                                     </Button>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//             </Tabs>
//         </div>
//     );
// }


import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PriceDisplay from '@/components/common/PriceDisplay';
import { formatDate, formatAddress } from '@/lib/formatters';
import { OrderTracking } from './OrderTracking';
import LazyImage from '../common/LazyImage';

export function OrderDetails({ order }) {
    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading text-[var(--text-primary)]">
                        Order #{order.orderNumber || 'N/A'}
                    </h1>
                    <p className="text-sm text-[var(--text-light)] mt-1">
                        Placed on {order.date ? formatDate(order.date) : 'N/A'}
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline">Track Order</Button>
                    <Button>Invoice</Button>
                </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full lg:h-[10rem] mb-6 bg-[var(--gray-light)] rounded-lg shadow-sm">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="tracking">Tracking</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left side */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Items */}
                            <Card className="shadow-md rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-lg text-[var(--text-primary)]">
                                        Order Items
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {order.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-4 p-3 border rounded-lg bg-[var(--card-bg)]"
                                            >
                                                {item.image ? (
                                                    <LazyImage
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover rounded-lg shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-[var(--gray-light)] text-[var(--text-light)] text-xs">
                                                        No Image
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-[var(--text-primary)]">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-[var(--text-light)]">
                                                        Size: {item.size} | Quantity: {item.quantity}
                                                    </p>
                                                    <PriceDisplay
                                                        price={item.piece_price || item.price}
                                                        currency={order.currency}
                                                        className="mt-1 font-medium"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Shipping Address */}
                            <Card className="shadow-md rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-lg text-[var(--text-primary)]">
                                        Shipping Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[var(--text-primary)]">
                                        {formatAddress(order.shippingAddress)}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right side */}
                        <div className="space-y-6">
                            {/* Summary */}
                            <Card className="shadow-md rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-lg text-[var(--text-primary)]">
                                        Order Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-light)]">Subtotal</span>
                                        <PriceDisplay price={order.subtotal} currency={order.currency} />
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-light)]">Shipping</span>
                                        <PriceDisplay price={order.shipping} currency={order.currency} />
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-light)]">Tax</span>
                                        <PriceDisplay price={order.tax} currency={order.currency} />
                                    </div>
                                    <div className="pt-3 border-t flex justify-between font-bold">
                                        <span className="text-[var(--text-primary)]">Total</span>
                                        <PriceDisplay
                                            price={order.total}
                                            currency={order.currency}
                                            className="text-lg"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment */}
                            <Card className="shadow-md rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-lg text-[var(--text-primary)]">
                                        Payment Method
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-5 rounded bg-[var(--gray-light)] shadow-sm"
                                            style={{
                                                backgroundImage: `url(${order.paymentMethod.icon})`,
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        />
                                        <span className="text-[var(--text-primary)]">
                                            {order.paymentMethod.type} •••• {order.paymentMethod.last4}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Tracking Tab */}
                <TabsContent value="tracking">
                    <OrderTracking order={order} />
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing">
                    <Card className="shadow-md rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg text-[var(--text-primary)]">
                                Billing Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="font-medium mb-2 text-[var(--text-primary)]">
                                    Payment Method
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-5 rounded bg-[var(--gray-light)] shadow-sm"
                                        style={{
                                            backgroundImage: `url(${order.paymentMethod.icon})`,
                                            backgroundSize: 'contain',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                    />
                                    <span className="text-[var(--text-primary)]">
                                        {order.paymentMethod.type} •••• {order.paymentMethod.last4}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2 text-[var(--text-primary)]">
                                    Billing Address
                                </h4>
                                <p className="text-[var(--text-primary)]">
                                    {formatAddress(order.billingAddress)}
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <Button variant="outline" size="sm">
                                    Download Invoice
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
