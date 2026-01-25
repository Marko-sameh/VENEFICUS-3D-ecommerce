import { notFound } from 'next/navigation';
import { categoryService } from '@/services/categoryService';
import { JsonLd } from '@/components/seo/JsonLd';
import CollectionClient from './CollectionClient';

export async function generateMetadata({ params }) {
    try {
        const { slug, locale } = await params;
        const categoriesData = await categoryService.getCategories();
        const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData.categories || []);
        
        const collection = categories.find(cat => 
            cat.slug === slug || 
            cat.name?.toLowerCase().replace(/\s+/g, '-') === slug
        );
        
        if (!collection) throw new Error('Collection not found');
        
        const getLocalizedName = (collection) => {
            const translation = collection.translations?.find(t => t.locale === locale);
            return translation?.name || collection.name;
        };
        
        const localizedName = getLocalizedName(collection);
        const truncatedDescription = collection.description?.substring(0, 100) || 'Premium sustainable denim';

        return {
            title: `${localizedName} Collection | VENEFICUS`,
            description: collection.description || `Explore the ${localizedName} collection from VENEFICUS. Premium sustainable denim crafted with attention to detail.`,
            openGraph: {
                title: `${localizedName} Collection | VENEFICUS`,
                description: truncatedDescription,
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/collections/${collection.slug}`,
                siteName: 'VENEFICUS',
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${localizedName} Collection | VENEFICUS`,
                description: truncatedDescription,
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/collections/${collection.slug}`,
            },
        };
    } catch {
        return {
            title: 'Collection Not Found | VENEFICUS',
            robots: { index: false },
        };
    }
}

export default async function CollectionPage({ params }) {
    try {
        const { slug, locale } = await params;
        
        // Get all categories and find the one matching the slug
        const categoriesData = await categoryService.getCategories();
        const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData.categories || []);
        
        const collection = categories.find(cat => 
            cat.slug === slug || 
            cat.name?.toLowerCase().replace(/\s+/g, '-') === slug
        );
        
        if (!collection) {
            notFound();
        }
        
        // Get products by collection name (since we're using category name as collection)
        let products = [];
        try {
            const productsResult = await categoryService.getProductsByCollection(collection.name || slug);
            products = Array.isArray(productsResult) ? productsResult : (productsResult.products || []);
        } catch (error) {

            products = [];
        }

        return (
            <>
                <CollectionClient collection={collection} products={products} locale={locale} />

                <JsonLd item={{
                    '@context': 'https://schema.org',
                    '@type': 'Collection',
                    name: collection.translations?.find(t => t.locale === locale)?.name || collection.name,
                    description: collection.description,
                    url: `${process.env.NEXT_PUBLIC_SITE_URL}/collections/${collection.slug}`,
                    hasPart: products.map((product) => ({
                        '@type': 'Product',
                        name: product.name,
                        image: product.images?.[0] || product.mainImage,
                        url: `/products/${product.slug}`,
                        description: product.description?.substring(0, 150),
                    })),
                }} />
            </>
        );
    } catch (error) {

        notFound();
    }
}