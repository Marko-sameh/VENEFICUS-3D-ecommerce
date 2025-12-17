import { JsonLd } from '@/components/seo/JsonLd';
import { productService } from '@/services/products';
import { generateMetadata as GMD } from '@/lib/seo';
import ProductsClient from './ProductsClient';

export const revalidate = 300; // 5 minutes

export async function generateMetadata() {
    return GMD(
        'Products - VENEFICUS',
        'Explore our premium denim collection. High-quality jeans and jackets crafted with sustainable materials.'
    );
}

export default async function ProductsPage({ searchParams }) {
    try {
        const params = await searchParams;
        const page = parseInt(params?.page) || 1;
        const limit = parseInt(params?.limit) || 12;

        // Server-side data fetching with caching
        const productsData = await productService.getProducts({ page, limit });
        const products = productsData.products || [];
        const total = productsData.total || 0;
        const totalPages = Math.ceil(total / limit);
        console.log(productsData);


        return (
            <>
                <JsonLd item={{
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    itemListElement: products.map((product, index) => ({
                        '@type': 'ListItem',
                        position: (page - 1) * limit + index + 1,
                        item: {
                            '@type': 'Product',
                            name: product.name,
                            image: product.mainImage,
                            offers: {
                                '@type': 'Offer',
                                url: `/products/${product.slug}`,
                                priceCurrency: 'USD',
                                price: product.price
                            }
                        }
                    }))
                }} />

                <ProductsClient
                    initialProducts={products}
                    initialPagination={{
                        currentPage: page,
                        totalPages,
                        itemsPerPage: limit,
                        total
                    }}
                />
            </>
        );
    } catch (error) {

        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Error Loading Products</h1>
                    <p className="text-[var(--text-secondary)]">Please try again later.</p>
                </div>
            </div>
        );
    }
}