"use client";

import { Button } from "@/components/ui/Button";
import LazyImage from "@/components/common/LazyImage";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function SplitSection({
    image = "/images/hero-fashion.jpg",
    imageAlt = "Veneficus Exclusive Collection",
    primaryText = "Elevate Your Style with Veneficus",
    secondaryText = "Uncover timeless designs that combine craftsmanship and modern elegance.",
    btnText = "Explore Collection",
    ctaUrl = "/products",
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const imageX = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

    return (
        <>
            <JsonLd
                item={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    name: "Veneficus",
                    description: primaryText,
                    image: image,
                    potentialAction: {
                        "@type": "ViewAction",
                        target: ctaUrl,
                        name: btnText,
                    },
                }}
            />

            <section
                ref={ref}
                className="relative flex flex-col md:flex-row items-center justify-between w-full min-h-[90vh] bg-[var(--background)] overflow-hidden"
                aria-label="Veneficus Split Hero Banner"
            >
                {/* Animated Text Side */}
                <motion.div
                    style={{ y: textY }}
                    className="flex flex-col justify-center items-start md:w-1/2 w-full px-6 sm:px-10 md:px-16 lg:px-24 py-12 md:py-0 text-left space-y-6 z-10"
                >
                    <motion.h1
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[var(--main-color)] drop-shadow-lg"
                    >
                        {primaryText}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg"
                    >
                        {secondaryText}
                    </motion.p>

                    {btnText && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <Link href={ctaUrl} aria-label={`Go to ${btnText}`}>
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <Button className="mt-4 px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold shadow-xl shadow-[var(--main-color)]/20">
                                        {btnText}
                                    </Button>
                                </motion.div>
                            </Link>
                        </motion.div>
                    )}
                </motion.div>

                {/* Parallax Image Side */}
                <motion.div
                    style={{ x: imageX }}
                    className="relative md:w-1/2 w-full h-[50vh] md:h-[90vh] overflow-hidden"
                >
                    <motion.div
                        initial={{ scale: 1.2, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full h-full"
                    >
                        <LazyImage
                            src={image}
                            alt={imageAlt}
                            fill={true}
                            className="object-cover md:rounded-l-[2rem] w-full h-full"
                            priority={true}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:hidden"></div>
                    </motion.div>
                </motion.div>

                {/* Decorative Glow */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.15 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2 }}
                    className="absolute top-1/2 left-1/4 w-72 h-72 bg-[var(--main-color)] rounded-full blur-[120px] pointer-events-none"
                />
            </section>
        </>
    );
}
