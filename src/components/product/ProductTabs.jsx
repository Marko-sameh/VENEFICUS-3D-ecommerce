// src/components/product/ProductTabs.jsx
'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export function ProductTabs({ description, specifications, careInstructions }) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('description');
    const [isClient, setIsClient] = useState(false);

    // Ensure we're on the client side for proper hydration
    useEffect(() => {
        setIsClient(true);
    }, []);

    const tabs = [
        { id: 'description', label: t('product.description', 'Description') },
        { id: 'specifications', label: t('product.specifications', 'Specifications') },
        { id: 'care', label: t('product.careInstructions', 'Care Instructions') }
    ];

    // SEO: Generate proper heading structure for crawlers
    useEffect(() => {
        const observer = new MutationObserver(() => {
            if (typeof window !== 'undefined') {
                const mainContent = document.querySelector('main');
                if (mainContent) {
                    const h2Elements = mainContent.querySelectorAll('h2');
                    h2Elements.forEach((h2, index) => {
                        if (index > 0) {
                            h2.tagName = 'h3';
                            const newH3 = document.createElement('h3');
                            newH3.textContent = h2.textContent;
                            h2.parentNode.replaceChild(newH3, h2);
                        }
                    });
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return () => observer.disconnect();
    }, []);

    if (!isClient) {
        // Return a minimal structure during SSR for proper SEO indexing
        return (
            <div className="mt-16" id="product-tabs">
                <div className="border-b border-[var(--border-color)]">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <span
                                key={tab.id}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${tab.id === 'description'
                                    ? 'border-[var(--main-color)] text-[var(--text-primary)]'
                                    : 'border-transparent text-[var(--text-light)]'
                                    }`}
                                aria-current={tab.id === 'description' ? 'page' : undefined}
                            >
                                {tab.label}
                            </span>
                        ))}
                    </nav>
                </div>

                <div className="mt-8">
                    <div
                        className="text-base text-[var(--text-secondary)]"
                        itemProp="description"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="mt-16 transition-all duration-500 ease-in-out opacity-100 translate-y-0" id="product-tabs" itemScope itemType="https://schema.org/WebPageElement">
            <div className="border-b border-[var(--border-color)]">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ease-out transform hover:scale-105 ${activeTab === tab.id
                                ? 'border-[var(--main-color)] text-[var(--text-primary)] shadow-sm'
                                : 'border-transparent text-[var(--text-light)] hover:text-[var(--text-secondary)] hover:border-[var(--gray)] hover:translate-y-[-1px]'
                                }`}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-8 relative overflow-hidden min-h-[200px]" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
                <div
                    className={`transform transition-all duration-500 ease-out ${
                        activeTab === 'description' 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
                    }`}
                    style={{ transitionDelay: activeTab === 'description' ? '100ms' : '0ms' }}
                >
                    <div
                        className="text-base text-[var(--text-secondary)] prose max-w-none"
                        itemProp="description"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </div>

                {specifications && (
                    <div
                        className={`transform transition-all duration-500 ease-out ${
                            activeTab === 'specifications' 
                                ? 'opacity-100 translate-y-0' 
                                : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
                        }`}
                        style={{ transitionDelay: activeTab === 'specifications' ? '100ms' : '0ms' }}
                    >
                        <table className="w-full text-sm">
                            <tbody>
                                {specifications.material && (
                                    <tr className="border-b border-[var(--border-color)]">
                                        <td className="py-2 font-medium text-[var(--text-primary)]">{t('product.material', 'Material')}</td>
                                        <td className="py-2 text-[var(--text-secondary)]">{specifications.material}</td>
                                    </tr>
                                )}
                                {specifications.fit && (
                                    <tr className="border-b border-[var(--border-color)]">
                                        <td className="py-2 font-medium text-[var(--text-primary)]">{t('product.fit', 'Fit')}</td>
                                        <td className="py-2 text-[var(--text-secondary)]">{specifications.fit}</td>
                                    </tr>
                                )}
                                {specifications.washing && (
                                    <tr className="border-b border-[var(--border-color)]">
                                        <td className="py-2 font-medium text-[var(--text-primary)]">{t('product.washing', 'Washing')}</td>
                                        <td className="py-2 text-[var(--text-secondary)]">{specifications.washing}</td>
                                    </tr>
                                )}
                                {specifications.madeIn && (
                                    <tr className="border-b border-[var(--border-color)]">
                                        <td className="py-2 font-medium text-[var(--text-primary)]">{t('product.madeIn', 'Made In')}</td>
                                        <td className="py-2 text-[var(--text-secondary)]">{specifications.madeIn}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {careInstructions && (
                    <div
                        className={`transform transition-all duration-500 ease-out ${
                            activeTab === 'care' 
                                ? 'opacity-100 translate-y-0' 
                                : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
                        }`}
                        style={{ transitionDelay: activeTab === 'care' ? '100ms' : '0ms' }}
                    >
                        <div
                            className="text-base text-[var(--text-secondary)] prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: careInstructions }}
                        />
                    </div>
                )}
            </div>

            {/* Schema.org structured data for product details */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPageElement",
                        "name": "Product Details",
                        "description": "Detailed information about the product specifications and care instructions"
                    })
                }}
            />
        </div>
    );
}