import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata = {
    title: 'Page Not Found | VENEFICUS',
    description: 'The page you are looking for does not exist on VENEFICUS website. Explore our collections of premium denim or return to the homepage.',
    robots: {
        index: false,
        follow: true
    },
    openGraph: {
        title: 'Page Not Found | VENEFICUS',
        description: 'The page you are looking for does not exist on VENEFICUS website.',
        url: '/404',
        siteName: 'VENEFICUS',
        images: [{
            url: '/images/404-og.jpg',
            width: 1200,
            height: 630,
            alt: 'Page Not Found - VENEFICUS'
        }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Page Not Found | VENEFICUS',
        description: 'The page you are looking for does not exist.',
        creator: '@ESSECDenim',
        images: ['/images/404-og.jpg'],
    }
};

export default function NotFound() {
    return (
        <>
            <div className="min-h-screen bg-[var(--background)] flex flex-col">
                <div className="container mx-auto px-4 py-20 flex-grow flex items-center">
                    <div className="max-w-2xl mx-auto text-center w-full">

                        {/* رمز الخطأ */}
                        <div className="mb-10">
                            <div
                                className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 shadow-lg animate-bounce"
                                style={{
                                    backgroundColor: 'var(--main-color-light)',
                                    color: 'var(--text-white)',
                                }}
                            >
                                <span
                                    className="text-4xl font-[var(--font-heading-weight)]"
                                    style={{ fontFamily: 'var(--font-heading-family)' }}
                                >
                                    404
                                </span>
                            </div>

                            <h1
                                className="text-5xl md:text-6xl font-[var(--font-heading-weight)] mb-4 text-[var(--text-primary)]"
                                style={{ fontFamily: 'var(--font-heading-family)' }}
                            >
                                Page Not Found
                            </h1>

                            <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-lg mx-auto leading-relaxed">
                                The page you're looking for doesn't exist.
                            </p>
                        </div>

                        {/* روابط سريعة */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
                            {[
                                { href: '/', title: 'Home', desc: 'Return to our homepage' },
                                { href: '/products', title: 'Shop', desc: 'Browse our collections' },
                                { href: '/contact', title: 'Help', desc: 'Contact our support' },
                            ].map((link, i) => (
                                <a
                                    key={i}
                                    href={link.href}
                                    className="block p-6 bg-[var(--card-bg)] rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-[var(--border-color)]"
                                >
                                    <h2
                                        className="text-xl font-[var(--font-heading-weight)] mb-2 text-[var(--text-primary)]"
                                        style={{ fontFamily: 'var(--font-heading-family)' }}
                                    >
                                        {link.title}
                                    </h2>
                                    <p className="text-[var(--text-secondary)] text-sm">{link.desc}</p>
                                </a>
                            ))}
                        </div>

                        {/* مربع البحث */}
                        {/* <div className="mt-6">
                            <p className="text-[var(--text-light)] text-sm mb-3">
                                Or search for what you're looking for:
                            </p>
                            <div className="max-w-md mx-auto relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]"
                                />
                                <button
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-light)] hover:text-[var(--main-color)] transition-colors"
                                    aria-label="Search"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* الفوتر */}
                {/* <div className="py-6 border-t border-[var(--border-color)]">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-[var(--text-light)] text-sm">
                            © {new Date().getFullYear()} VENEFICUS. All rights reserved.
                        </p>
                    </div>
                </div> */}
            </div>


            {/* Error Page Schema */}
            <JsonLd
                item={{
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    'name': 'Page Not Found',
                    'description': 'The requested page could not be found on VENEFICUS website',
                    'url': 'https://VENEFICUS.com/404',
                    'potentialAction': {
                        '@type': 'SearchAction',
                        'target': 'https://VENEFICUS.com/search?q={search_term_string}',
                        'query-input': 'required name=search_term_string'
                    }
                }}
            />
        </>
    );
}

