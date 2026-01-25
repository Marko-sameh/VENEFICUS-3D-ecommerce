'use client';

import { memo, useState, useEffect } from 'react';
import Link from 'next/link';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useTranslation } from '@/hooks/useTranslation';

function Fallback({ error, resetErrorBoundary }) {
    const { t } = useTranslation();
    const [pathname, setPathname] = useState('');
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPathname(window.location.pathname);
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--background)] text-[var(--text-primary)]">
            {/* Hidden SEO block */}
            <div style={{ display: 'none' }}>
                <h1>Error Page - VENEFICUS</h1>
                <meta name="robots" content="noindex, nofollow" />
                <meta
                    name="description"
                    content="A technical error occurred on VENEFICUS. We are working to resolve the issue."
                />
            </div>

            <div className="max-w-lg w-full text-center space-y-6">
                {/* Header */}
                <header>
                    <h2
                        className="text-3xl font-[var(--font-heading-weight)] font-serif text-[var(--main-color)] mb-3"
                        id="error-heading"
                    >
                        {t('errors.errorTitle', 'Oops! Something went wrong')}
                    </h2>
                    <p
                        className="text-[var(--text-secondary)]"
                        role="alert"
                        aria-describedby="error-heading"
                    >
                        {t(
                            'errors.errorDescription',
                            "We're working to fix the problem. Please try again later."
                        )}
                    </p>

                    {/* Debug info (dev only) */}
                    {process.env.NODE_ENV === 'development' && error && (
                        <details className="mt-4 text-left">
                            <summary className="text-sm text-[var(--text-light)] cursor-pointer">
                                Error Details (Dev only)
                            </summary>
                            <div className="mt-2 p-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded text-xs text-[var(--text-secondary)]">
                                <p><strong>Message:</strong> {error.message}</p>
                                <p><strong>Stack:</strong> {error.stack}</p>
                                <p><strong>Path:</strong> {pathname}</p>
                            </div>
                        </details>
                    )}
                </header>

                {/* Buttons */}
                <nav className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={resetErrorBoundary}
                        className="px-6 py-2 bg-[var(--main-color)] text-[var(--text-white)] rounded-2xl shadow-md hover:bg-[var(--main-color-hover)] transition-all"
                    >
                        {t('common.retry', 'Reload Page')}
                    </button>

                    <Link
                        href="/"
                        className="px-6 py-2 border border-[var(--border-color)] rounded-2xl hover:bg-[var(--gray-light)] transition-all text-[var(--text-primary)]"
                    >
                        {t('navigation.home', 'Go Home')}
                    </Link>

                    <button
                        onClick={() => {
                            const subject = encodeURIComponent('VENEFICUS Error Report');
                            const body = encodeURIComponent(
                                `An error occurred on page: ${pathname}\n` +
                                `Time: ${new Date().toLocaleString()}\n` +
                                `Error Message: ${error?.message || 'Unknown'}\n` +
                                `Browser: ${navigator.userAgent}`
                            );
                            window.location.href = `mailto:support@veneficus.com?subject=${subject}&body=${body}`;
                        }}
                        className="px-6 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                    >
                        {t('common.reportIssue', 'Report Issue')}
                    </button>
                </nav>

                {/* Helpful links */}
                <footer className="text-sm text-[var(--text-light)] mt-4">
                    <p className="mb-2">{t('common.youCanAlso', 'You can also:')}</p>
                    <nav className="flex flex-wrap justify-center gap-4">
                        <Link href="/contact" className="hover:text-[var(--text-secondary)]">
                            {t('navigation.contact', 'Contact Us')}
                        </Link>
                        <Link href="/help" className="hover:text-[var(--text-secondary)]">
                            {t('common.helpCenter', 'Help Center')}
                        </Link>
                        <Link href="/sitemap" className="hover:text-[var(--text-secondary)]">
                            {t('common.sitemap', 'Sitemap')}
                        </Link>
                    </nav>
                </footer>
            </div>
        </div>
    );
}

export const ErrorBoundary = memo(function ErrorBoundary({ children }) {
    return (
        <ReactErrorBoundary
            FallbackComponent={Fallback}
            onReset={() => {
                if (typeof window !== 'undefined') {
                    window.location.reload();
                }
            }}
        >
            {children}
        </ReactErrorBoundary>
    );
});
