import { JsonLd } from '@/components/seo/JsonLd';
import { generateMetadata as GMD } from '@/lib/seo';
import CollectionsClient from './CollectionsClient';
import { categoryService } from '@/services/categoryService';
import { API_ENDPOINTS, getApiUrl } from '@/lib/endpoints';

export const revalidate = 3600;

export async function generateMetadata() {
    return GMD(
        'Our Collections',
        "Discover VENEFICUS's premium collections featuring limited edition pieces, seasonal releases, and exclusive collaborations."
    );
}


export default async function CollectionsPage() {
    try {
        const collectionsData = await categoryService.getCategories();
        const collections = Array.isArray(collectionsData) ? collectionsData : (collectionsData.categories || []);

        return (
            <div className="container mx-auto px-4 py-12">
                <JsonLd item={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'VENEFICUS Collections',
                    description: "Discover VENEFICUS's premium collections.",
                    url: '/collections',
                    mainEntity: {
                        '@type': 'ItemList',
                        itemListElement: collections.map((collection, index) => ({
                            '@type': 'ListItem',
                            position: index + 1,
                            name: collection.name,
                            url: `/collections/${collection.slug || collection.name?.toLowerCase().replace(/\s+/g, '-')}`
                        }))
                    }
                }} />

                <CollectionsClient collections={collections} />
            </div>
        );
    } catch (error) {

        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="max-w-md mx-auto bg-[var(--card-bg)] rounded-lg p-8 border border-[var(--border-color)]">
                    <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)] mb-4">
                        Error Loading Collections
                    </h1>
                    <p className="text-[var(--text-secondary)] mb-6">
                        We encountered an error while loading our collections. Please try again later.
                    </p>
                    <a
                        href="/collections"
                        className="inline-block px-4 py-2 rounded-md bg-[var(--main-color)] text-[var(--text-white)] hover:bg-[var(--main-color-hover)] transition"
                    >
                        Retry
                    </a>
                </div>
            </div>
        );
    }
}