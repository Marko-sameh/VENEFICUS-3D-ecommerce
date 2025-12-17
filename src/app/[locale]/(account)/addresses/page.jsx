import { getAddresses } from '@/services/addressService';
import { JsonLd } from '@/components/seo/JsonLd';
import AddressBook from '@/components/account/AddressBook';

export const revalidate = 300;

export async function generateMetadata() {
    return {
        title: 'Addresses | VENEFICUS',
        description: 'Manage your shipping and billing addresses for VENEFICUS orders. Add, edit, or delete addresses as needed.',
        openGraph: {
            title: 'Addresses | VENEFICUS',
            description: 'Manage your shipping and billing addresses for VENEFICUS orders.',
            url: '/account/addresses',
            siteName: 'VENEFICUS',
            images: [{ url: '/images/og-addresses.jpg', width: 1200, height: 630 }],
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Addresses | VENEFICUS',
            description: 'Manage your shipping and billing addresses for VENEFICUS orders.',
        }
    };
}

export default async function AddressesPage() {
    // const session = await getServerSession(authOptions);

    // if (!session?.user) {
    //     return (
    //         <div className="container mx-auto px-4 py-12">
    //             <div className="max-w-md mx-auto bg-[var(--card-bg)] rounded-lg p-8 text-center">
    //                 <h1
    //                     className="text-2xl font-bold mb-4"
    //                     style={{
    //                         color: 'var(--text-primary)',
    //                         fontFamily: 'var(--font-heading-family)'
    //                     }}
    //                 >
    //                     Please Sign In
    //                 </h1>
    //                 <p
    //                     className="text-[var(--text-secondary)] mb-6"
    //                     style={{ fontFamily: 'var(--font-body-family)' }}
    //                 >
    //                     You need to be logged in to manage your addresses.
    //                 </p>
    //                 <a
    //                     href="/auth/login"
    //                     className="inline-block px-6 py-2 bg-[var(--main-color)] text-[var(--text-white)] rounded-md hover:bg-[var(--main-color-hover)] transition-colors"
    //                     style={{ fontFamily: 'var(--font-body-family)' }}
    //                 >
    //                     Sign In
    //                 </a>
    //             </div>
    //         </div>
    //     );
    // }

    try {
        const addresses = await getAddresses();
        const validAddresses = Array.isArray(addresses) ? addresses : [];

        return (
            <div className="container mx-auto px-4 py-8">
                <JsonLd item={{
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    name: 'Saved Addresses',
                    itemListElement: validAddresses.map((address, index) => ({
                        '@type': 'ContactPoint',
                        position: index + 1,
                        contactType: 'shipping address',
                        address: {
                            '@type': 'PostalAddress',
                            streetAddress: address.address1 || address.street,
                            addressLocality: address.city,
                            postalCode: address.postalCode || address.zipCode,
                            addressCountry: address.country
                        }
                    }))
                }} />

                <div className="flex justify-between items-center mb-8">
                    <h1
                        className="text-3xl font-bold"
                        style={{
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-heading-family)'
                        }}
                    >
                        My Addresses
                    </h1>
                </div>

                <AddressBook initialAddresses={validAddresses} />
            </div>
        );
    } catch (error) {

        return (
            <div className="container mx-auto px-4 py-12">
                <div
                    className="max-w-md mx-auto bg-[var(--card-bg)] rounded-lg p-8"
                    style={{ borderColor: 'var(--border-color)' }}
                >
                    <h1
                        className="text-2xl font-bold mb-4"
                        style={{
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-heading-family)'
                        }}
                    >
                        Error Loading Addresses
                    </h1>
                    <p
                        className="text-[var(--text-secondary)] mb-6"
                        style={{ fontFamily: 'var(--font-body-family)' }}
                    >
                        We encountered an error while loading your addresses. Please try again later.
                    </p>
                    <a
                        href="/account/addresses"
                        className="inline-block px-4 py-2 bg-[var(--main-color)] text-[var(--text-white)] rounded-md hover:bg-[var(--main-color-hover)]"
                        style={{ fontFamily: 'var(--font-body-family)' }}
                    >
                        Retry
                    </a>
                </div>
            </div>
        );
    }
}