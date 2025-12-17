import { JsonLd } from '@/components/seo/JsonLd';
import OrdersClient from './OrdersClient';
import { generateMetadata as Gmd } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata() {
    return Gmd(
        'Order History',
        'View your order history and track current orders with VENEFICUS. Check order status, delivery details, and more.'
    );
}

export default function OrdersPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <JsonLd item={{
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Order History'
            }} />
            <OrdersClient />
        </div>
    );
}