"use client";
import Link from "next/link";
import { memo, useMemo, useCallback, useEffect, Suspense } from "react";
import { useMediaQuery } from "react-responsive";
import { useParams, usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import dynamic from "next/dynamic";
import { useNavigation } from "@/hooks/useUi";

// Lazy load motion for better performance
const MotionNav = dynamic(() => import("framer-motion").then(mod => ({ default: mod.motion.nav })), { ssr: false });
const MotionDiv = dynamic(() => import("framer-motion").then(mod => ({ default: mod.motion.div })), { ssr: false });

// ================== Constants ==================
const NAV_ITEMS = [
    { href: "/", labelKey: "navigation.home", defaultLabel: "Home", ariaLabel: "Go to homepage" },
    { href: "/collections", labelKey: "navigation.shopByCollections", defaultLabel: "Shop by Collections", ariaLabel: "Browse product collections" },
    { href: "/products", labelKey: "navigation.allProducts", defaultLabel: "All Products", ariaLabel: "View all products" },
    { href: "/size-guide", labelKey: "navigation.sizeGuide", defaultLabel: "Size Guide", ariaLabel: "View sizing information" },
    { href: "/contact", labelKey: "navigation.contact", defaultLabel: "Contact", ariaLabel: "Contact us" },
    { href: "/outfit", labelKey: "navigation.outfit", defaultLabel: "Outfit", ariaLabel: "Browse outfit ideas" },
];

// ================== Navigation Item Component ==================
const NavItem = memo(({ item, isActive, onActiveTap, onNavClose }) => {
    const { t, locale } = useTranslation();

    const handleClick = useCallback(() => {
        onActiveTap(item.href);
        onNavClose();
    }, [item.href, onActiveTap, onNavClose]);

    const motionProps = useMemo(() => ({
        whileHover: { scale: 1.1, y: -2 },
        whileTap: { scale: 0.95 },
        transition: { type: "spring", stiffness: 400, damping: 17 }
    }), []);

    const linkClassName = useMemo(() =>
        `group relative text-sm font-semibold tracking-wide transition-all duration-300 ${isActive
            ? "text-[var(--main-color)] drop-shadow-sm"
            : "text-[var(--text-primary)] hover:text-[var(--main-color)]"
        }`, [isActive]
    );

    const underlineClassName = useMemo(() =>
        `absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-transparent via-[var(--main-color)] to-transparent transition-all duration-300 ${isActive ? "w-full" : "group-hover:w-full"
        }`, [isActive]
    );

    const localizedHref = `/${locale}${item.href}`;

    return (
        <Suspense fallback={<div className="h-6 w-16" />}>
            <MotionDiv {...motionProps}>
                <Link
                    href={localizedHref}
                    className={linkClassName}
                    aria-label={item.ariaLabel}
                    aria-current={isActive ? "page" : undefined}
                    onClick={handleClick}
                >
                    {t(item.labelKey, item.defaultLabel)}
                    <span className={underlineClassName} />
                </Link>
            </MotionDiv>
        </Suspense>
    );
});

// ================== Navbar Component ==================
const Navbar = memo(() => {
    const { t } = useTranslation();
    const isSmall = useMediaQuery({ maxWidth: 991 });
    const pathname = usePathname();
    const { activeTap, setActiveTap, setActiveNav, initializeNavigation } = useNavigation();
    const params = useParams();
    const locale = params?.locale || 'en';
    // Initialize navigation state on mount
    useEffect(() => {
        initializeNavigation();
    }, [initializeNavigation]);

    // Update active tap when pathname changes
    useEffect(() => {
        setActiveTap(pathname);
    }, [pathname, setActiveTap]);

    // Memoize the active tap handler to prevent unnecessary re-renders
    const handleActiveTap = useCallback((href) => {
        setActiveTap(href);
    }, [setActiveTap]);

    // Close navbar when link is clicked
    const handleNavClose = useCallback(() => {
        setActiveNav(false);
    }, [setActiveNav]);

    // Memoize motion props
    const motionProps = useMemo(() => ({
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 }
    }), []);

    // Early return for mobile to prevent unnecessary rendering
    if (isSmall) return null;

    return (
        <Suspense fallback={
            <nav className="bg-[var(--background)] sticky top-50 z-40 w-full shadow-md border-b border-[var(--border-color)] mb-5 h-14" />
        }>
            <MotionNav
                {...motionProps}
                className="relative bg-gradient-to-r from-[var(--background)] via-[var(--card-bg)] to-[var(--background)] w-full shadow-lg backdrop-blur-sm"
                role="navigation"
                aria-label={t("navigation.mainNavigation", "Main navigation")}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(204,154,6,0.03),transparent_70%)] pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="flex justify-center items-center h-14">
                        <div className="flex gap-x-10">
                            {NAV_ITEMS.map((item) => (
                                <NavItem
                                    key={`/${locale}${item.href}`}
                                    item={item}
                                    isActive={activeTap === item.href}
                                    onActiveTap={handleActiveTap}
                                    onNavClose={handleNavClose}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--main-color)]/40 to-transparent" />
            </MotionNav>
        </Suspense>
    );
});

// ================== Display Names ==================
NavItem.displayName = "NavItem";
Navbar.displayName = "Navbar";

export default Navbar;