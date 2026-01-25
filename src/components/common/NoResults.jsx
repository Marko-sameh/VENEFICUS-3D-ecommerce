"use client";
import Link from 'next/link';
import { Search, Home, ArrowRight, PackageOpen, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useUi } from '@/hooks/useUi';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useCallback, memo } from 'react';

/**
 * Optimized NoResults component with centralized analytics
 */
const NoResults = memo(function NoResults({
    searchTerm = '',
    type = 'products',
    suggestions = [],
    onSearchChange,
    isError = false
}) {
    const { t } = useTranslation();
    const { trackNoResultsView, trackSuggestionClick, getDefaultSuggestions } = useUi();
    const router = useRouter();

    // Track component usage for analytics
    useEffect(() => {
        trackNoResultsView(type, searchTerm, isError);
    }, [type, searchTerm, isError, trackNoResultsView]);

    // Memoized display labels
    const displayType = useMemo(() => {
        switch (type) {
            case 'products': return t('products');
            case 'orders': return t('orders');
            case 'content': return t('content');
            default: return t('results');
        }
    }, [type, t]);

    const actionText = useMemo(() => {
        switch (type) {
            case 'products': return t('productsAction');
            case 'orders': return t('ordersAction');
            case 'content': return t('contentAction');
            default: return t('defaultAction');
        }
    }, [type, t]);

    // Get suggestions with memoization
    const displaySuggestions = useMemo(() => {
        return suggestions.length > 0
            ? suggestions
            : getDefaultSuggestions(type, t);
    }, [suggestions, type, t, getDefaultSuggestions]);

    // Optimized suggestion click handler
    const handleSuggestionClick = useCallback((suggestion) => {
        trackSuggestionClick(suggestion, type, searchTerm, onSearchChange, router);
    }, [trackSuggestionClick, type, searchTerm, onSearchChange, router]);

    return (
        <div style={{
            paddingTop: '3rem',
            paddingBottom: '3rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            color: 'var(--text-primary)'
        }}>
            {/* SEO: Clear semantic structure for search engines */}
            <div style={{
                backgroundColor: 'var(--gray-light)',
                borderRadius: '1rem',
                padding: '2rem',
                borderColor: 'var(--border-color)',
                borderWidth: '1px'
            }}>
                {/* Icon with proper accessibility */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    marginBottom: '1.5rem'
                }}>
                    {isError ? (
                        <RefreshCw style={{
                            width: '2rem',
                            height: '2rem',
                            color: 'var(--text-primary)'
                        }} aria-hidden="true" />
                    ) : (
                        <PackageOpen style={{
                            width: '2rem',
                            height: '2rem',
                            color: 'var(--text-primary)'
                        }} aria-hidden="true" />
                    )}
                </div>

                {/* Main heading - SEO critical */}
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem'
                }}>
                    {isError
                        ? t('errorTitle')
                        : t('noResultsTitle', { searchTerm: searchTerm || t('yourSearch') })}
                </h2>

                {/* Descriptive text with keywords */}
                <p style={{
                    color: 'var(--text-secondary)',
                    marginBottom: '1.5rem',
                    maxWidth: '48rem',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    {actionText}
                </p>

                {/* Search suggestions - critical for UX and SEO */}
                {!isError && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: 'var(--text-secondary)',
                            marginBottom: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Search style={{
                                width: '1rem',
                                height: '1rem',
                                marginRight: '0.5rem'
                            }} />
                            {t('tryThese')}
                        </h3>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}>
                            {displaySuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: 'var(--background)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '9999px',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-primary)',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-light)'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
                                    aria-label={t('searchFor', { term: suggestion })}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Alternative navigation links - improves site structure */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                    gap: '1rem',
                    maxWidth: '48rem',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    <Link
                        href={type === 'orders' ? '/account/orders' : '/'}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.75rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.5rem',
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-light)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        aria-label={type === 'orders' ? t('viewAllOrders') : t('returnHome')}
                    >
                        <Home style={{
                            width: '1rem',
                            height: '1rem',
                            marginRight: '0.5rem'
                        }} />
                        {type === 'orders' ? t('allOrders') : t('home')}
                        <ArrowRight style={{
                            width: '1rem',
                            height: '1rem',
                            marginLeft: '0.5rem'
                        }} />
                    </Link>

                    {type === 'products' && (
                        <Link
                            href="/shop/new-arrivals"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0.75rem',
                                backgroundColor: 'var(--main-color)',
                                color: 'var(--text-white)',
                                borderRadius: '0.5rem',
                                textDecoration: 'none',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--main-color-hover)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--main-color)'}
                            aria-label={t('viewNewArrivals')}
                        >
                            {t('newArrivals')}
                            <ArrowRight style={{
                                width: '1rem',
                                height: '1rem',
                                marginLeft: '0.5rem'
                            }} />
                        </Link>
                    )}
                </div>

                {/* Error-specific actions */}
                {isError && (
                    <div style={{ marginTop: '1.5rem' }}>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: 'var(--main-color)',
                                color: 'var(--text-white)',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--main-color-hover)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--main-color)'}
                        >
                            {t('refreshPage')}
                        </button>
                    </div>
                )}
            </div>

            {/* SEO: Structured data for "No Results" pages */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": `${t('noResultsFor')} "${searchTerm || t('yourSearch')}" | ESSEC Denim`,
                        "description": isError
                            ? t('errorDescription')
                            : `No ${displayType} found for "${searchTerm}". ${t('exploreAlternatives')}`,
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://essec-denim.com/search?q={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    })
                }}
            />
        </div>
    );
});

export default NoResults;