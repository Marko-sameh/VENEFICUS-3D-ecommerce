"use client";
import Link from "next/link";
import { memo, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import { useMediaQuery } from "react-responsive";
import { useParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

import LazyImage from "../common/LazyImage";
import { useUnifiedCartStore } from '@/store/unifiedCartStore';
import { useScroll, useNavigation } from '@/hooks/useUi';
import { Menu } from 'lucide-react';

import logo from "@/../public/images/logo_wbg.png";

// Lazy load heavy components
const Tilt = dynamic(() => import("react-parallax-tilt"), { ssr: false });
const MobileMenu = dynamic(() => import("./MobileMenu").then(mod => ({ default: mod.MobileMenu })), { ssr: false });
const UserMenu = dynamic(() => import("./UserMenu").then(mod => ({ default: mod.UserMenu })), { ssr: false });
const SearchBar = dynamic(() => import("../ui/SearchBar"), { ssr: false });
const CartCounter = dynamic(() => import('../cart/CartCounter').then(mod => ({ default: mod.CartCounter })), { ssr: false });
const CartDrawer = dynamic(() => import('../cart/CartDrawer').then(mod => ({ default: mod.CartDrawer })), { ssr: false });
const Navbar = dynamic(() => import("./Navbar"), { ssr: false });

// ================== Constants ==================
const LOGO_PROPS = {
    src: logo,
    alt: "VENEFICUS - Official company logo",
    priority: true,
};

// ================== Logo Section ==================
const LogoSection = memo(() => {
    const tiltProps = useMemo(() => ({
        glareEnable: true,
        glareMaxOpacity: 0.25,
        scale: 1.08,
        transitionSpeed: 2000,
        className: "cursor-pointer"
    }), []);

    const motionProps = useMemo(() => ({
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    }), []);

    return (
        <Link href="/" aria-label="Go to homepage">
            <Tilt {...tiltProps}>
                <motion.div
                    {...motionProps}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex flex-col items-center justify-center text-center group"
                >
                    <LazyImage {...LOGO_PROPS} className="drop-shadow-2xl w-[3.5rem] h-[3.5rem] md:w-[5rem] md:h-[5rem]" />
                </motion.div>
            </Tilt>
        </Link>
    );
});

// ================== Cart Section ==================
const CartIcon = memo(() => {
    const { isDrawerOpen, closeDrawer } = useUnifiedCartStore();

    return (
        <>
            <Suspense fallback={<div className="h-8 w-8" />}>
                <CartCounter />
            </Suspense>
            {isDrawerOpen && (
                <Suspense fallback={null}>
                    <CartDrawer
                        isOpen={isDrawerOpen}
                        onClose={closeDrawer}
                    />
                </Suspense>
            )}
        </>
    );
});

// ================== Navigation Sections ==================
const LeftSection = memo(({ isSmall, onMenuClick }) => (
    <div className="justify-self-start flex items-center gap-4">
        <Suspense fallback={<div className="h-8 w-8" />}>
            {isSmall ? (
                <MobileMenu />
            ) : (
                <>
                    <button
                        onClick={onMenuClick}
                        className="hover:text-[var(--gray)] transition-colors w-6 h-6 transition-transform duration-300 ease-in-out hover:scale-125 hover:opacity-80"
                        aria-label="Toggle navigation menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <SearchBar />
                </>
            )}
        </Suspense>
    </div>
));

const RightSection = memo(({ isSmall }) => (
    <div className="flex items-center justify-end gap-4">
        <Suspense fallback={<div className="h-8 w-8" />}>
            {isSmall ? <SearchBar className="w-full" /> : <UserMenu />}
            <CartIcon />
        </Suspense>
    </div>
));

// ================== Header ==================
const Header = memo(() => {
    const isSmall = useMediaQuery({ maxWidth: 991 });
    const { scrolled, initializeScrollListener } = useScroll();
    const { activeNav, setActiveNav } = useNavigation();
    const pathname = usePathname();
    const params = useParams();
    const locale = params?.locale || 'en';
    // Initialize scroll listener once
    useEffect(() => {
        const cleanup = initializeScrollListener();
        return cleanup;
    }, [initializeScrollListener]);

    // Toggle navbar visibility
    const handleMenuClick = useCallback(() => {
        setActiveNav(!activeNav);
    }, [activeNav, setActiveNav]);

    // Memoize header class to prevent unnecessary re-renders
    const headerClassName = useMemo(() => {
        const isHomePage = pathname === `/${locale}`;
        if (isHomePage && !scrolled) {
            return "fixed w-full top-0 z-50 transition-colors duration-500 bg-transparent text-white";
        }
        return "fixed w-full top-0 z-50 transition-colors duration-500 bg-white shadow-md";
    }, [scrolled, pathname]);

    // Memoize motion props
    const motionProps = useMemo(() => ({
        initial: { y: -80, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.8, ease: "easeOut" }
    }), []);

    return (
        <div className="fixed w-full top-0 z-50">
            <motion.header
                {...motionProps}
                className={`${headerClassName.replace('fixed w-full top-0 z-50', '')} backdrop-blur-md bg-opacity-95`}
            >
                <div className="px-4 lg:px-8 py-1 md:py-3 transition-all duration-500">
                    <div className="grid grid-cols-3 items-center">
                        <LeftSection isSmall={isSmall} onMenuClick={handleMenuClick} />
                        <LogoSection />
                        <RightSection isSmall={isSmall} />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--main-color)] to-transparent opacity-30" />
            </motion.header>
            {!isSmall && activeNav && (
                <Suspense fallback={null}>
                    <Navbar />
                </Suspense>
            )}
        </div>
    );
});

// ================== Display Names ==================
LogoSection.displayName = "LogoSection";
CartIcon.displayName = "CartIcon";
LeftSection.displayName = "LeftSection";
RightSection.displayName = "RightSection";
Header.displayName = "Header";

export default Header;