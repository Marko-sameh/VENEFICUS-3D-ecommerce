import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductDetails } from '@/components/product/ProductDetails';
import { productService } from '@/services/products';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

// Helper function to strip HTML tags
const stripHtmlTags = (text) => text.replace(/<[^>]*>/g, '');

export async function generateMetadata({ params }) {
    try {
        const { slug } = await params;
        const product = await productService.getProductBySlug(slug);
        const truncatedDescription = stripHtmlTags(product.description).substring(0, 160);
        console.log(product.image_3d);

        return {
            title: `${product.name} | VENEFICUS`,
            description: `Buy ${product.name} at VENEFICUS. ${truncatedDescription}...`,
            openGraph: {
                title: product.name,
                description: truncatedDescription,
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
                siteName: 'VENEFICUS',
                images: [{
                    url: product.mainImage,
                    width: 1200,
                    height: 630,
                    alt: product.name
                }],
                type: 'website'
            },
            twitter: {
                card: 'summary_large_image',
                title: product.name,
                description: truncatedDescription,
                images: [product.mainImage]
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`
            }
        };
    } catch (error) {
        return {
            title: 'Product Not Found | VENEFICUS',
            description: 'The requested product could not be found.'
        };
    }
}

export default async function ProductPage({ params }) {
    try {
        const { slug } = await params;
        const product = await productService.getProductBySlug(slug);

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": stripHtmlTags(product.description),
            "image": product.mainImage,
            "sku": product.sku,
            "brand": {
                "@type": "Brand",
                "name": "VENEFICUS"
            },
            "offers": {
                "@type": "Offer",
                "price": product.price,
                "priceCurrency": "USD",
                "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`
            },
            "aggregateRating": product.rating ? {
                "@type": "AggregateRating",
                "ratingValue": product.rating,
                "reviewCount": product.reviewCount || 0
            } : undefined
        };

        return (
            <div className="bg-[var(--color-background)] text-[var(--color-text-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                        <ProductGallery
                            productName={product.name}
                            models={[product.image_3d]}
                            modelNames={[product.name]}
                            width={500}
                            height={500}
                        />
                        <div className="mt-10 px-4 sm:mt-16 sm:px-0">
                            <ProductDetails product={product} />
                        </div>
                    </div>
                </div>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </div>
        );
    } catch (error) {
        notFound();
    }
}