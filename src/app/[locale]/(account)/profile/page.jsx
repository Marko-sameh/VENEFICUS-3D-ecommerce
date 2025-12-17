import { getAddresses } from '@/services/addressService';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateMetadata as generateSeoMetadata } from '@/lib/seo';
import Link from 'next/link';
import ProfileClient from './ProfileClient';

export const revalidate = 3600;

export async function generateMetadata() {
    return generateSeoMetadata(
        'My Profile',
        'Manage your VENEFICUS account profile, view order history, and update personal information.'
    );
}

export default async function ProfilePage() {
    try {
        // Data will be fetched and managed by the store in ProfileClient
        const initialData = {
            user: null, // Will be loaded by store
            orders: [],
            addresses: []
        };

        return (
            <div className="container mx-auto px-4 py-8">
                <JsonLd item={{
                    '@context': 'https://schema.org',
                    '@type': 'Person',
                    name: initialData.user?.name || 'User Profile',
                    email: initialData.user?.email || ''
                }} />

                <ProfileClient initialData={initialData} />
            </div>
        );
    } catch (error) {

        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto bg-[var(--card-bg)] rounded-lg p-8">
                    <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                        Error Loading Profile
                    </h1>
                    <p className="text-[var(--text-secondary)] mb-6">
                        We encountered an error while loading your profile information.
                    </p>
                    <Link href="/account/profile" className="inline-block px-4 py-2 bg-[var(--main-color)] text-white rounded-md">
                        Retry
                    </Link>
                </div>
            </div>
        );
    }
}

