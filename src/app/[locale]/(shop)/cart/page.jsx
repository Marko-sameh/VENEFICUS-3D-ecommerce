import { JsonLd } from '@/components/seo/JsonLd';
import { CartClient } from './CartClient';

/**
 * Cart page for VENEFICUS store
 * Implements proper SEO structure and follows design system
 * Uses server-side rendering for optimal SEO performance
 */
export const revalidate = 0;

export async function generateMetadata() {
    return {
        title: 'Shopping Cart | VENEFICUS',
        description: 'Review your items and complete your purchase at VENEFICUS. Free shipping on orders over $50.',
        openGraph: {
            title: 'Shopping Cart | VENEFICUS',
            description: 'Review your items and complete your purchase at VENEFICUS.',
            url: '/cart',
            siteName: 'VENEFICUS',
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Shopping Cart | VENEFICUS',
            description: 'Review your items and complete your purchase at VENEFICUS.'
        }
    };
}

export default function CartPage() {
    const cartJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Shopping Cart",
        description: "Items in the shopping cart at VENEFICUS"
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
            <JsonLd data={cartJsonLd} />
            <CartClient />
        </div>
    );
}