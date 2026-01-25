import { JsonLd } from '@/components/seo/JsonLd';
import { SizeGuideClient } from './SizeGuideClient';

export default function SizeGuidePage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <JsonLd item={{
                '@context': 'https://schema.org',
                '@type': 'Article',
                'headline': 'VENEFICUS Size Guide',
                'description': 'Simple size guide for VENEFICUS jeans and clothing.',
                'image': '/images/size-guide-main.jpg',
                'datePublished': '2023-01-01T08:00:00+08:00',
                'author': {
                    '@type': 'Organization',
                    'name': 'VENEFICUS'
                }
            }} />

            <article>
                <SizeGuideClient />
            </article>
        </div>
    );
}
