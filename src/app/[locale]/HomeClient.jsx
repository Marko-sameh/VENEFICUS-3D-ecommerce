"use client";

import { HeroBanner } from "@/components/home/HeroBanner";
import BestSellers from "@/components/home/BestSellers";
import { NewArrivals } from "@/components/home/NewArrivals";
import MostPopularCollections from "@/components/home/MostPopularCollections";
import { ProductCard } from "@/components/product/ProductCard";
import { PerformanceProfiler } from "@/components/debug/PerformanceProfiler";
import { motion, AnimatePresence } from "framer-motion";
import heroImage from "@/../public/images/Hero.jpg";
import { SplitSection } from "@/components/home/SplitSection";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState, useRef, useCallback } from "react";
import { useProductsStore } from "@/store/productsStore";
import { useUserStore } from "@/store";
import { API_BASE_URL, replaceImageUrl } from "@/lib";
import { useParams } from "next/navigation";
import { ModeToggle } from "@/components/home/ModeToggle";

const slideVariants = {
  enter: { y: 1000, opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: -1000, opacity: 0 }
};

export default function HomeClient({ initialData, locale, homedata: initialHomedata, translations: initialTranslations }) {
  const { t } = useTranslation();
  console.log(initialHomedata);
  const [collections] = useState((initialData?.collections || []).map(c => ({
    ...c,
    image: replaceImageUrl(c.image)
  })));
  const [isSlideMode, setIsSlideMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const containerRef = useRef(null);
  const currentSlideRef = useRef(0);
  const isScrollingRef = useRef(false);

  const [homedata] = useState(initialHomedata || {});
  const [translations] = useState(initialTranslations || []);
  const products = initialData?.products || [];
  const newArrivals = products.filter(p => p.new_arrival === 1).slice(0, 8);
  const bestSellers = initialData?.bestSellers || [];

  const aboutDataFromStore = useUserStore(state => state.aboutData);
  const params = useParams();
  const localepar = params?.locale || 'en';

  const getLocalizedName = (collection) => {
    const translation = collection.translations?.find(t => t.locale === locale);
    return translation?.name || collection.name;
  };

  const popularCollections = collections.filter(c => c.most_popular === 1).slice(0, 2);
  const allpopularCollections = collections.filter(collection => collection.most_popular === 1);

  const slides = [
    'hero',
    'featured',
    'story',
    ...(allpopularCollections.length > 0 ? ['popular'] : []),
    'bestsellers',
    'newarrivals',
    'sizeguide'
  ];

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);

  useEffect(() => {
    if (!homedata || Object.keys(homedata).length === 0) {
      const { fetchAboutData } = useUserStore.getState();
      fetchAboutData();
    }
  }, [homedata]);
  useEffect(() => {
    const header = document.querySelector('header, [role="banner"]');
    const footer = document.querySelector('footer, [role="contentinfo"]');

    if (isSlideMode) {
      if (header) header.style.display = 'none';
      if (footer) footer.style.display = 'none';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [isSlideMode]);

  const handleWheel = useCallback((e) => {
    if (isScrollingRef.current) return;

    e.preventDefault();
    isScrollingRef.current = true;
    setIsScrolling(true);

    if (e.deltaY > 0 && currentSlideRef.current < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else if (e.deltaY < 0 && currentSlideRef.current > 0) {
      setCurrentSlide(prev => prev - 1);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      setIsScrolling(false);
    }, 800);
  }, [slides.length]);

  const handleTouchStart = useRef(0);
  const handleTouchEnd = useCallback((e) => {
    const touchEnd = e.changedTouches[0].clientY;
    const diff = handleTouchStart.current - touchEnd;

    if (Math.abs(diff) > 50 && !isScrollingRef.current) {
      isScrollingRef.current = true;
      setIsScrolling(true);

      if (diff > 0 && currentSlideRef.current < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else if (diff < 0 && currentSlideRef.current > 0) {
        setCurrentSlide(prev => prev - 1);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        setIsScrolling(false);
      }, 800);
    }
  }, [slides.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isSlideMode) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', (e) => {
      handleTouchStart.current = e.touches[0].clientY;
    });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleWheel, handleTouchEnd, isSlideMode]);
  console.log("homedata", homedata);
  const effectiveHomedata = (homedata && Object.keys(homedata).length > 0) ? homedata : (aboutDataFromStore?.[0] || {});
  const heroImageUrl = effectiveHomedata?.home_image ? `${API_BASE_URL}/${effectiveHomedata.home_image}` : "";
  const ourStoryImage = effectiveHomedata?.our_story_img ? `${API_BASE_URL}/${effectiveHomedata.our_story_img}` : "";
  const localizedStoryDescription = translations.find(t => t.locale === localepar)?.our_story_description || effectiveHomedata?.our_story_description || "";
  console.log("llllllllllllllllllllllllllllllllll", effectiveHomedata);

  const renderSlide = () => {
    const slide = slides[currentSlide];

    switch (slide) {
      case 'hero':
        return (
          <motion.section className="w-full h-screen flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <HeroBanner
              image={heroImageUrl}
              imageAlt="Luxury fashion and car hero"
              primaryText={t("home.heroTitle", "Find the best VENEFICUS for your closet")}
              secondryText={t("home.heroSubtitle", "Over 200 different models available. Choose the right one for you")}
              btnText={t("home.heroButton", "Shop now!")}
            />
          </motion.section>
        );

      case 'featured':
        return (
          <section className="w-full h-screen flex flex-col items-center justify-center px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">{t("home.featuredTitle", "Featured Collections")}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--main-color)] to-transparent mx-auto" />
            </motion.div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 w-full max-w-[90%]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {popularCollections[0] && (
                <motion.div
                  className="col-span-1 lg:col-span-4 flex justify-center"
                  whileHover={{ rotateY: 6, rotateX: -4, scale: 1.05, z: 50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  <ProductCard
                    product={{
                      id: popularCollections[0].id,
                      name: getLocalizedName(popularCollections[0]),
                      slug: popularCollections[0].slug || getLocalizedName(popularCollections[0]).toLowerCase().replace(/\s+/g, '-'),
                      image: popularCollections[0].image || "https://essecdenim.com/cdn/shop/collections/image_a46df426-5410-4f04-9c4d-51c18f04339d.jpg?v=1752319305&width=750",
                      description: getLocalizedName(popularCollections[0])
                    }}
                    showQuickView={false}
                    showAddToCart={false}
                    showPrice={false}
                    homeshow={true}
                    className="w-full h-64 sm:h-80 md:h-[28rem] lg:h-[34rem]"
                  />
                </motion.div>
              )}
              {popularCollections[1] && (
                <motion.div
                  className="col-span-1 lg:col-span-8 flex justify-center"
                  whileHover={{ rotateY: -6, rotateX: 4, scale: 1.05, z: 50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  <ProductCard
                    product={{
                      id: popularCollections[1].id,
                      name: getLocalizedName(popularCollections[1]),
                      slug: popularCollections[1].slug || getLocalizedName(popularCollections[1]).toLowerCase().replace(/\s+/g, '-'),
                      image: popularCollections[1].image || "https://essecdenim.com/cdn/shop/collections/image_a46df426-5410-4f04-9c4d-51c18f04339d.jpg?v=1752319305&width=750",
                      description: getLocalizedName(popularCollections[1])
                    }}
                    showQuickView={false}
                    showAddToCart={false}
                    showPrice={false}
                    homeshow={true}
                    className="w-full h-64 sm:h-80 md:h-[28rem] lg:h-[34rem]"
                  />
                </motion.div>
              )}
            </motion.div>
          </section>
        );

      case 'story':
        return (
          <section className="w-full h-screen flex items-center justify-center px-4">
            <SplitSection
              image={ourStoryImage}
              imageAlt="Our story image"
              primaryText={t("home.storyTitle", "Our Story")}
              secondaryText={localizedStoryDescription}
              ctaUrl={`/${localepar}/collections`}
            />
          </section>
        );

      case 'popular':
        return (
          <motion.section
            className="w-full h-screen flex items-center justify-center px-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MostPopularCollections collections={allpopularCollections} />
          </motion.section>
        );

      case 'bestsellers':
        return (
          <motion.section
            className="w-full h-screen flex items-center justify-center px-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <BestSellers data={bestSellers.length > 0 ? bestSellers : undefined} />
          </motion.section>
        );

      case 'newarrivals':
        return (
          <motion.section
            className="w-full h-screen flex items-center justify-center px-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <NewArrivals data={newArrivals} />
          </motion.section>
        );

      case 'sizeguide':
        return (
          <motion.section
            className="w-full h-screen flex items-center justify-center px-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SplitSection
              image={`${API_BASE_URL}/${effectiveHomedata.image}`}
              imageAlt="Size guide image"
              primaryText={t("home.sizeGuideTitle", "SIZE GUIDE")}
              secondaryText={t(
                "home.sizeGuideSubtitle",
                "For more assistance on size, write us on Instagram or email (height and weight) and jeans model. We will provide the perfect size for you."
              )}
              btnText={t("home.sizeGuideButton", "Full size guide")}
              ctaUrl={`/${localepar}/size-guide`}
            />
          </motion.section>
        );

      default:
        return null;
    }
  };

  if (!isSlideMode) {
    return (
      <PerformanceProfiler id="HomePage">
        <div className="w-full relative">
          <HeroBanner
            image={heroImageUrl}
            imageAlt="Luxury fashion and car hero"
            primaryText={t("home.heroTitle", "Find the best VENEFICUS for your closet")}
            secondryText={t("home.heroSubtitle", "Over 200 different models available. Choose the right one for you")}
            btnText={t("home.heroButton", "Shop now!")}
          />
          <div className="w-full px-4 py-16">
            <MostPopularCollections collections={allpopularCollections} />
          </div>
          <div className="w-full px-4 py-16">
            <SplitSection
              image={ourStoryImage}
              imageAlt="Our story image"
              primaryText={t("home.storyTitle", "Our Story")}
              secondaryText={localizedStoryDescription}
              ctaUrl={`/${localepar}/collections`}
            />
          </div>
          <div className="w-full px-4 py-16">
            <BestSellers data={bestSellers.length > 0 ? bestSellers : undefined} />
          </div>
          <div className="w-full px-4 py-16">
            <NewArrivals data={newArrivals} />
          </div>
          <div className="w-full px-4 py-16">
            <SplitSection
              image={`${API_BASE_URL}/${effectiveHomedata.image}`}
              imageAlt="Size guide image"
              primaryText={t("home.sizeGuideTitle", "SIZE GUIDE")}
              secondaryText={t(
                "home.sizeGuideSubtitle",
                "For more assistance on size, write us on Instagram or email (height and weight) and jeans model. We will provide the perfect size for you."
              )}
              btnText={t("home.sizeGuideButton", "Full size guide")}
              ctaUrl={`/${localepar}/size-guide`}
            />
          </div>
          <ModeToggle isSlideMode={isSlideMode} onToggle={() => setIsSlideMode(true)} />
        </div>
      </PerformanceProfiler>
    );
  }

  return (
    <PerformanceProfiler id="HomePage">
      <div
        ref={containerRef}
        className="fixed inset-0 overflow-hidden bg-[var(--background)]"
        style={{ height: '100vh', width: '100vw', top: 0, left: 0, zIndex: 9999 }}
      >
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[var(--background)] via-[var(--card-bg)] to-[var(--background)] opacity-60" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(204,154,6,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(204,154,6,0.05),transparent_50%)] pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-screen"
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>

        <ModeToggle isSlideMode={isSlideMode} onToggle={() => setIsSlideMode(false)} />
      </div>
    </PerformanceProfiler>
  );
}
