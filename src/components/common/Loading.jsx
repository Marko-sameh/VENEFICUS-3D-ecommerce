'use client';

import Image from "next/image";
import logo from "@/../public/images/logo_wbg.png";

export default function Loading() {
    
    return (
        <div
            className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--background)] z-50 min-h-screen"
            role="status"
            aria-label="The site is loading."
            aria-live="polite"
            aria-busy="true"
        >
            {/* SEO-friendly loading container */}
            <main className="relative flex flex-col items-center justify-center">
                {/* Logo Container with proper semantics */}
                <div
                    className="relative w-48 h-48 flex items-center justify-center animate-logo"
                    itemScope
                    itemType="https://schema.org/Organization"
                >
                    {/* Logo with enhanced SEO */}
                    <Image
                        src={logo}
                        alt="VENEFICUS - Official company logo"
                        fill
                        className="object-contain"
                        priority={true}
                        quality={100}
                        itemProp="logo"
                        sizes="(max-width: 768px) 100vw, 192px"
                    />

                    {/* Decorative eyes - hidden from screen readers */}
                    <span
                        className="absolute rounded-full bg-[var(--main-color)] shadow-[0_0_12px_var(--main-color)] animate-eye"
                        style={{
                            top: "37%",
                            left: "44%",
                            width: "6px",
                            height: "6px",
                        }}
                        role="presentation"
                        aria-hidden="true"
                    />

                    <span
                        className="absolute rounded-full bg-[var(--main-color)] shadow-[0_0_12px_var(--main-color)] animate-eye delay-[600ms]"
                        style={{
                            top: "37%",
                            right: "44%",
                            width: "6px",
                            height: "6px",
                        }}
                        role="presentation"
                        aria-hidden="true"
                    />
                </div>

                {/* Brand Name with proper heading structure */}
                <header className="mt-8">
                    <h1
                        className="text-2xl font-bold tracking-widest text-[var(--foreground)] animate-fadein"
                        itemProp="name"
                    >
                        <span className="sr-only">a company </span>
                        VENEFICUS
                    </h1>
                </header>

                {/* Progress indicator for better UX */}
                <div
                    className="mt-6 w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={100}
                    aria-label="Loading indicator"
                >
                    <div className="h-full bg-[var(--main-color)] animate-progress" />
                </div>

                {/* Screen reader announcements */}
                <div className="sr-only" aria-atomic="true">
                    <p>Welcome to the VENEFICUS website</p>
                    <p>Content is loading, please wait a moment...</p>
                </div>
            </main>

            {/* Metadata for search engines */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "VENEFICUS Loading",
                        "description": "VENEFICUS Loading Page",
                        "publisher": {
                            "@type": "Organization",
                            "name": "VENEFICUS",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "@/../public/images/logo_wbg.png"
                            }
                        }
                    })
                }}
            />

            {/* Hidden skip link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[var(--main-color)] text-white p-2 rounded"
            >
                Skip to main content
            </a>
        </div>
    );
}