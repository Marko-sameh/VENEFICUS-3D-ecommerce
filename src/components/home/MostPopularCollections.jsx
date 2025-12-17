"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

/**
 * Most Popular Collections component
 * Displays collections marked as most_popular = 1
 */
export default function MostPopularCollections({ collections = [] }) {
  const { t } = useTranslation();

  // Filter collections where most_popular is 1
  const popularCollections = collections;
  console.log('Popular collections:', popularCollections);
  console.log('First collection structure:', popularCollections[0]);

  if (!popularCollections.length) {
    return null;
  }

  return (
    <motion.section
      className="w-full relative"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="text-center mb-16">
        <motion.h2
          className="text-3xl md:text-5xl font-heading font-bold text-[var(--text-primary)] mb-6 drop-shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("home.popularCollections", "Most Popular Collections")}
        </motion.h2>
        <motion.p
          className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("home.popularCollectionsSubtitle", "Discover our most loved collections")}
        </motion.p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {popularCollections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </motion.div>
    </motion.section>
  );
}

/**
 * Individual collection card component
 */
function CollectionCard({ collection }) {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params?.locale || 'en';
  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getLocalizedName = (collection) => {
    const translation = collection.translations?.find(t => t.locale === locale);
    return translation?.name || collection.name;
  };

  const localizedName = getLocalizedName(collection);
  const slug = collection.slug || localizedName?.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.div
      ref={cardRef}
      variants={fadeInUp}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05, z: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Link href={`/collections/${slug}`} className="block group">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[var(--card-bg)] border border-[var(--border-color)] shadow-xl hover:shadow-2xl transition-all duration-500">
          {/* Collection Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
            <motion.div
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              <Image
                src={collection.image || collection.image_url || 'https://essecdenim.com/cdn/shop/collections/image_a46df426-5410-4f04-9c4d-51c18f04339d.jpg?v=1752319305&width=750'}
                alt={localizedName}
                fill
                className="object-cover"
                loading="lazy"
                onError={(e) => {
                  console.error('Image failed to load:', collection.image);
                  e.target.src = 'https://essecdenim.com/cdn/shop/collections/image_a46df426-5410-4f04-9c4d-51c18f04339d.jpg?v=1752319305&width=750';
                }}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />

            {/* Popular Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="absolute top-4 left-4"
            >
              <span className="px-4 py-1.5 bg-[var(--main-color)] text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm">
                {t("common.popular", "Popular")}
              </span>
            </motion.div>
          </div>

          {/* Collection Info */}
          <div className="p-6 bg-gradient-to-b from-white/50 to-white backdrop-blur-sm">
            <motion.h3
              className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-3 group-hover:text-[var(--main-color)] transition-colors"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {localizedName}
            </motion.h3>

            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)] text-sm font-medium">
                {t("common.viewCollection", "View Collection")}
              </span>
              <motion.svg
                className="w-5 h-5 text-[var(--main-color)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </motion.svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}