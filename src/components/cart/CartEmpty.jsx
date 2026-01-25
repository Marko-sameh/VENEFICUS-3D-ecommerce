import { Handbag } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

/**
 * CartEmpty component - Displayed when cart is empty
 * SEO-optimized with proper semantic HTML
 * Follows VENEFICUS design system
 */
export function CartEmpty() {
    const params = useParams();
    const locale = params?.locale || 'en';
    return (
        <div className="bg-[var(--card-bg)] rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
                <div className="flex justify-center mb-6">
                    <div className="bg-[var(--gray-light)] rounded-full p-4">
                        {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-12 h-12 text-[var(--text-light)]"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356 1.993l1.068-1.068a4.5 4.5 0 00-6.364-6.364l-1.068 1.068m-11.356 1.993l-1.068 1.068a4.5 4.5 0 01-6.364 6.364l1.068-1.068m11.356-1.993V18a4.5 4.5 0 01-4.5 4.5h-6a4.5 4.5 0 01-4.5-4.5v-6"
                            />
                        </svg> */}
                        <Handbag className="w-15 h-15 transition-transform duration-300 ease-in-out hover:opacity-80" />

                    </div>
                </div>

                <h2
                    className="text-2xl font-[var(--font-heading-weight)] mb-4"
                    style={{ fontFamily: 'var(--font-heading-family)' }}
                >
                    Your cart is empty
                </h2>

                <p className="text-[var(--text-secondary)] mb-8" style={{ fontFamily: 'var(--font-body-family)' }}>
                    Looks like you haven't added any items to your cart yet. Start shopping to find your favorite products!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={`/${locale}/products`}
                        className="px-6 py-3 bg-[var(--main-color)] text-[var(--text-white)] rounded-md hover:bg-[var(--main-color-hover)] transition-colors font-[var(--font-body-weight-bold)]"
                        style={{ fontFamily: 'var(--font-body-family)' }}
                    >
                        Shop All Products
                    </Link>

                    <Link
                        href={`/${locale}/collections`}
                        className="px-6 py-3 border border-[var(--border-color)] text-[var(--text-primary)] rounded-md hover:bg-[var(--gray-light)] transition-colors font-[var(--font-body-weight-bold)]"
                        style={{ fontFamily: 'var(--font-body-family)' }}
                    >
                        shop by collections
                    </Link>
                </div>
            </div>
        </div>
    );
}