'use client';

import { useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { X, Menu, User, LogOut } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useMobileMenu } from '@/hooks/useUi';
import { useParams } from 'next/navigation';
import GoogleSignInButton from '../auth/GoogleSignInButton';
import { useUserStore } from '@/store/userStore';

export function MobileMenu() {
    const { t } = useTranslation();
    const { mobileMenuOpen, mobileMenuVisible, openMobileMenu, closeMobileMenu } = useMobileMenu();
    const { isAuthenticated, logout, initializeAuth } = useUserStore();
    const params = useParams();
    const locale = params?.locale || 'en';

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const navItems = useMemo(() => [
        { href: '/', key: 'home', delay: '100ms' },
        { href: '/collections', key: 'shopByCollections', delay: '200ms' },
        { href: '/products', key: 'allProducts', delay: '300ms' },
        { href: '/size-guide', key: 'sizeGuide', delay: '400ms' },
        { href: '/contact', key: 'contact', delay: '500ms' },
        { href: '/outfit', key: 'outfit', delay: '600ms' }
    ], []);

    const handleMenuClick = useCallback(() => {
        closeMobileMenu();
    }, [closeMobileMenu]);

    const handleLoginSuccess = useCallback((data) => {
        closeMobileMenu();
        window.location.reload();
    }, [closeMobileMenu]);

    const handleLogout = useCallback(() => {
        logout();
        window.location.reload();
    }, [logout]);

    return (
        <>
            {!mobileMenuVisible && (
                <button
                    onClick={openMobileMenu}
                    className="p-2 rounded-md text-[var(--gray)] hover:text-[var(--text-primary)] transition-colors duration-200"
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-menu"
                    aria-label={t('navigation.openMenu')}
                >
                    <Menu className="h-6 w-6" />
                </button>
            )}

            {mobileMenuVisible && (
                <>
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 h-[90vh] w-full z-[80] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'
                            }`}
                        onClick={closeMobileMenu}
                    />

                    {/* Menu Panel */}
                    <div
                        id="mobile-menu"
                        className={`fixed inset-y-0 left-0 h-[100vh] z-[100] w-70 bg-[var(--background)] transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}
                        role="dialog"
                        aria-modal="true"
                        aria-label={t('navigation.mobileMenu')}
                    >
                        <div className="flex  flex-col h-[90vh]">
                            {/* Close button */}
                            <div className="flex justify-end p-4">
                                <button
                                    onClick={closeMobileMenu}
                                    className="p-2 rounded-md text-[var(--text-primary)] hover:text-[var(--gray)] transition-all duration-200"
                                    aria-label={t('navigation.closeMenu')}
                                >
                                    <X className="h-6 w-6 transition-transform duration-200 hover:rotate-90" />
                                </button>
                            </div>

                            {/* Navigation Links with staggered animation */}
                            <nav className="flex-1 px-6 py-4">
                                <div className="space-y-6">
                                    {navItems.map((item) => (
                                        <MobileNavLink
                                            key={item.href}
                                            href={`/${locale}${item.href}`}
                                            delay={item.delay}
                                            isOpen={mobileMenuOpen}
                                            onMenuClick={handleMenuClick}
                                        >
                                            {t(`navigation.${item.key}`) || getDefaultText(item.key)}
                                        </MobileNavLink>
                                    ))}
                                </div>
                            </nav>

                            {/* Account section at bottom with animation */}
                            <div
                                className={`border-t border-gray-200 p-6 transform transition-all duration-500 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                    }`}
                                style={{ transitionDelay: mobileMenuOpen ? '700ms' : '0ms' }}
                            >
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            href={`/${locale}/profile`}
                                            className="flex items-center space-x-3 text-[var(--text-primary)] hover:text-[var(--gray)] transition-all duration-200"
                                            onClick={handleMenuClick}
                                        >
                                            <User className="h-5 w-5" />
                                            <span>{t('account.profile') || 'Profile'}</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-3 text-[var(--text-primary)] hover:text-[var(--gray)] transition-all duration-200 mt-3"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span>{t('account.signOut') || 'Sign out'}</span>
                                        </button>
                                    </>
                                ) : (
                                    <GoogleSignInButton onSuccess={handleLoginSuccess} />
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

const MobileNavLink = ({ href, children, delay, isOpen, onMenuClick }) => {
    const isActive = useMemo(() => {
        if (typeof window === 'undefined') return false;
        const pathname = window.location.pathname;
        return href === '/' ? pathname === '/' : pathname.startsWith(href);
    }, [href]);

    return (
        <div
            className={`transform transition-all duration-500 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}
            style={{ transitionDelay: isOpen ? delay : '0ms' }}
        >
            <Link
                href={href}
                className={`block py-3 text-lg transition-all duration-200 rounded-lg hover:bg-[var(--gray-light)] hover:pl-2 ${isActive
                    ? 'text-[var(--text-primary)] font-medium bg-[var(--gray-light)] pl-2'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                onClick={onMenuClick}
            >
                {children}
            </Link>
        </div>
    );
};

function getDefaultText(key) {
    const defaults = {
        home: 'Home',
        shopByCollections: 'Shop by Collections',
        allProducts: 'All Products',
        sizeGuide: 'Size Guide',
        contact: 'Contact',
        outfit: 'Outfit'
    };
    return defaults[key] || key;
}