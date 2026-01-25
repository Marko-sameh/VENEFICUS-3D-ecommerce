// // // src/components/home/FeaturedProducts.jsx
// // 'use client';

// // import Link from 'next/link';
// // import { useState, useRef, useEffect } from 'react';
// // import { ArrowRight, ArrowLeft } from 'lucide-react';
// // import LazyImage from '../common/LazyImage';
// // // import { LazyImage } from '../common/LazyImage';

// // export default function FeaturedProducts({
// //     title,
// //     subtitle,
// //     description,
// //     imageUrl,
// //     link,
// //     products,
// //     variant = 'default' // 'default' or 'compact'
// // }) {
// //     const [currentIndex, setCurrentIndex] = useState(0);
// //     const containerRef = useRef(null);
// //     const timeoutRef = useRef(null);

// //     const nextSlide = () => {
// //         setCurrentIndex((prevIndex) =>
// //             prevIndex === products.length - 1 ? 0 : prevIndex + 1
// //         );
// //     };

// //     const prevSlide = () => {
// //         setCurrentIndex((prevIndex) =>
// //             prevIndex === 0 ? products.length - 1 : prevIndex - 1
// //         );
// //     };

// //     // Auto-rotate slides
// //     useEffect(() => {
// //         timeoutRef.current = setTimeout(() => {
// //             nextSlide();
// //         }, 5000);

// //         return () => {
// //             if (timeoutRef.current) {
// //                 clearTimeout(timeoutRef.current);
// //             }
// //         };
// //     }, [currentIndex, products.length]);

// //     // Pause auto-rotate on hover
// //     const handleMouseEnter = () => {
// //         if (timeoutRef.current) {
// //             clearTimeout(timeoutRef.current);
// //         }
// //     };

// //     const handleMouseLeave = () => {
// //         timeoutRef.current = setTimeout(() => {
// //             nextSlide();
// //         }, 5000);
// //     };

// //     return (
// //         <section
// //             className={`relative overflow-hidden mb-16 ${variant === 'compact' ? 'py-8' : 'py-16'
// //                 }`}
// //             onMouseEnter={handleMouseEnter}
// //             onMouseLeave={handleMouseLeave}
// //             aria-label={title}
// //         >
// //             {/* SEO: Structured Data for Featured Products */}
// //             <script
// //                 type="application/ld+json"
// //                 dangerouslySetInnerHTML={{
// //                     __html: JSON.stringify({
// //                         "@context": "https://schema.org",
// //                         "@type": "CollectionPage",
// //                         "name": title,
// //                         "description": description,
// //                         "mainEntity": {
// //                             "@type": "ItemList",
// //                             "itemListElement": products.map((product, index) => ({
// //                                 "@type": "ListItem",
// //                                 "position": index + 1,
// //                                 "item": {
// //                                     "@type": "Product",
// //                                     "name": product.name,
// //                                     "image": product.mainImage,
// //                                     "url": `/products/${product.slug}`
// //                                 }
// //                             }))
// //                         }
// //                     })
// //                 }}
// //             />

// //             <div className="container mx-auto px-4">
// //                 <div className={`grid ${variant === 'compact' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
// //                     } gap-8 items-center`}>
// //                     {/* Text Content */}
// //                     <div className={`${variant === 'compact' && 'order-2 md:order-1'
// //                         }`}>
// //                         {subtitle && (
// //                             <p
// //                                 className="text-sm uppercase tracking-widest mb-2"
// //                                 style={{
// //                                     color: 'var(--main-color)',
// //                                     fontFamily: 'var(--font-body-family)'
// //                                 }}
// //                             >
// //                                 {subtitle}
// //                             </p>
// //                         )}

// //                         <h2
// //                             className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
// //                             style={{
// //                                 color: 'var(--text-primary)',
// //                                 fontFamily: 'var(--font-heading-family)'
// //                             }}
// //                         >
// //                             {title}
// //                         </h2>

// //                         {description && (
// //                             <p
// //                                 className="text-lg mb-6 max-w-2xl"
// //                                 style={{
// //                                     color: 'var(--text-secondary)',
// //                                     fontFamily: 'var(--font-body-family)'
// //                                 }}
// //                             >
// //                                 {description}
// //                             </p>
// //                         )}

// //                         <div className="flex flex-wrap gap-4">
// //                             <Link
// //                                 href={link}
// //                                 className="px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors duration-300 font-medium"
// //                                 style={{
// //                                     backgroundColor: 'var(--background)',
// //                                     color: 'var(--text-primary)',
// //                                     fontFamily: 'var(--font-body-family)'
// //                                 }}
// //                             >
// //                                 اكتشف المجموعة
// //                             </Link>

// //                             <div className="flex items-center space-x-2 space-x-reverse">
// //                                 <button
// //                                     onClick={prevSlide}
// //                                     className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
// //                                     aria-label="السلايد السابق"
// //                                 >
// //                                     <ArrowLeft size={20} />
// //                                 </button>
// //                                 <button
// //                                     onClick={nextSlide}
// //                                     className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
// //                                     aria-label="السلايد التالي"
// //                                 >
// //                                     <ArrowRight size={20} />
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     </div>

// //                     {/* Image/Products Carousel */}
// //                     <div className={`${variant === 'compact' && 'order-1 md:order-2'}`}>
// //                         <div className="relative">
// //                             {products && products.length > 0 ? (
// //                                 <div className="overflow-hidden rounded-xl">
// //                                     <div
// //                                         className="flex transition-transform duration-500 ease-in-out"
// //                                         style={{ transform: `translateX(-${currentIndex * 100}%)` }}
// //                                     >
// //                                         {products.map((product, index) => (
// //                                             <div
// //                                                 key={index}
// //                                                 className="w-full flex-shrink-0"
// //                                                 aria-hidden={currentIndex !== index}
// //                                             >
// //                                                 <Link
// //                                                     href={`/products/${product.slug}`}
// //                                                     className="block relative group"
// //                                                 >
// //                                                     <LazyImage
// //                                                         src={product.mainImage}
// //                                                         alt={product.altText || `${product.name} - ${title}`}
// //                                                         width={800}
// //                                                         height={600}
// //                                                         className="w-full h-auto object-cover rounded-xl"
// //                                                     />

// //                                                     {/* Product overlay on hover */}
// //                                                     <div
// //                                                         className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 rounded-xl"
// //                                                         style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
// //                                                     />

// //                                                     <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
// //                                                         <div
// //                                                             className="bg-white p-4 rounded-lg shadow-lg"
// //                                                             style={{ backgroundColor: 'var(--background)' }}
// //                                                         >
// //                                                             <h3
// //                                                                 className="text-lg font-bold mb-1"
// //                                                                 style={{ color: 'var(--text-primary)' }}
// //                                                             >
// //                                                                 {product.name}
// //                                                             </h3>
// //                                                             <p
// //                                                                 className="text-sm"
// //                                                                 style={{ color: 'var(--text-secondary)' }}
// //                                                             >
// //                                                                 {product.price} جنيه
// //                                                             </p>
// //                                                         </div>
// //                                                     </div>
// //                                                 </Link>
// //                                             </div>
// //                                         ))}
// //                                     </div>
// //                                 </div>
// //                             ) : (
// //                                 <div className="rounded-xl overflow-hidden">
// //                                     <LazyImage
// //                                         src={imageUrl}
// //                                         alt={title}
// //                                         width={1200}
// //                                         height={800}
// //                                         className="w-full h-auto object-cover rounded-xl"
// //                                     />
// //                                 </div>
// //                             )}

// //                             {/* Dots indicator */}
// //                             {products && products.length > 1 && (
// //                                 <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 space-x-reverse">
// //                                     {products.map((_, index) => (
// //                                         <button
// //                                             key={index}
// //                                             onClick={() => setCurrentIndex(index)}
// //                                             className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'w-4 bg-black' : 'bg-gray-400'
// //                                                 }`}
// //                                             aria-label={`الذهاب إلى السلايد ${index + 1}`}
// //                                             style={{
// //                                                 backgroundColor: index === currentIndex ? 'var(--main-color)' : 'var(--gray)'
// //                                             }}
// //                                         />
// //                                     ))}
// //                                 </div>
// //                             )}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </section>
// //     );
// // }

// // // Usage example with structured data
// // // FeaturedProducts.propTypes = {
// // //     title: PropTypes.string.isRequired,
// // //     subtitle: PropTypes.string,
// // //     description: PropTypes.string,
// // //     imageUrl: PropTypes.string,
// // //     link: PropTypes.string.isRequired,
// // //     products: PropTypes.arrayOf(PropTypes.shape({
// // //         id: PropTypes.number.isRequired,
// // //         name: PropTypes.string.isRequired,
// // //         slug: PropTypes.string.isRequired,
// // //         mainImage: PropTypes.string.isRequired,
// // //         altText: PropTypes.string,
// // //         price: PropTypes.string
// // //     })),
// // //     variant: PropTypes.oneOf(['default', 'compact'])
// // // };

// // FeaturedProducts.defaultProps = {
// //     variant: 'default'
// // };




// 'use client';

// import Link from 'next/link';
// import { useState, useRef, useEffect, useCallback, memo } from 'react';
// import { ArrowRight, ArrowLeft } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import LazyImage from '../common/LazyImage';

// const FeaturedProducts = memo(function FeaturedProducts({
//     title,
//     subtitle,
//     description,
//     imageUrl,
//     link,
//     products = [],
//     variant = 'default'
// }) {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const timeoutRef = useRef(null);
//     const touchStartX = useRef(0);
//     const touchEndX = useRef(0);

//     const nextSlide = useCallback(() => {
//         setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
//     }, [products.length]);

//     const prevSlide = useCallback(() => {
//         setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
//     }, [products.length]);

//     // Auto-rotate slides
//     useEffect(() => {
//         if (products.length <= 1) return;
//         timeoutRef.current = setTimeout(nextSlide, 3000);
//         return () => clearTimeout(timeoutRef.current);
//     }, [nextSlide, currentIndex, products.length]);

//     // Touch swipe for mobile
//     const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
//     const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
//     const handleTouchEnd = () => {
//         if (touchStartX.current - touchEndX.current > 75) nextSlide();
//         if (touchEndX.current - touchStartX.current > 75) prevSlide();
//     };

//     const handleMouseEnter = () => clearTimeout(timeoutRef.current);
//     const handleMouseLeave = () => (timeoutRef.current = setTimeout(nextSlide, 6000));

//     return (
//         <section
//             className={`relative overflow-hidden ${variant === 'compact' ? 'py-10' : 'py-20'}`}
//             onMouseEnter={handleMouseEnter}
//             onMouseLeave={handleMouseLeave}
//             onTouchStart={handleTouchStart}
//             onTouchMove={handleTouchMove}
//             onTouchEnd={handleTouchEnd}
//             aria-label={title}
//         >
//             <div className="container mx-auto px-4">
//                 <div
//                     className={`grid ${variant === 'compact' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
//                         } gap-10 items-center`}
//                 >
//                     {/* TEXT SECTION */}
//                     <motion.div
//                         initial={{ opacity: 0, y: 30 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.6 }}
//                         viewport={{ once: true }}
//                         className={`${variant === 'compact' ? 'order-2 md:order-1' : ''}`}
//                     >
//                         {subtitle && (
//                             <p
//                                 className="text-sm uppercase tracking-widest mb-3"
//                                 style={{ color: 'var(--main-color)', fontFamily: 'var(--font-body-family)' }}
//                             >
//                                 {subtitle}
//                             </p>
//                         )}

//                         <h2
//                             className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
//                             style={{
//                                 color: 'var(--text-primary)',
//                                 fontFamily: 'var(--font-heading-family)',
//                                 textTransform: 'uppercase',
//                                 letterSpacing: '0.05em',
//                             }}
//                         >
//                             {title}
//                         </h2>

//                         {description && (
//                             <p
//                                 className="text-lg mb-6 max-w-2xl"
//                                 style={{
//                                     color: 'var(--text-secondary)',
//                                     fontFamily: 'var(--font-body-family)',
//                                     lineHeight: '1.7',
//                                 }}
//                             >
//                                 {description}
//                             </p>
//                         )}

//                         <div className="flex flex-wrap gap-4">
//                             <Link
//                                 href={link}
//                                 className="px-8 py-3 border border-[var(--main-color)] text-[var(--main-color)] hover:bg-[var(--main-color)] hover:text-white transition-all duration-300 rounded-full text-sm font-semibold uppercase tracking-wider"
//                             >
//                                 Discover Collection
//                             </Link>

//                             <div className="flex items-center gap-2">
//                                 <button
//                                     onClick={prevSlide}
//                                     className="p-3 rounded-full border border-[var(--border-color)] hover:bg-[var(--gray-light)] transition-colors"
//                                     aria-label="Previous Slide"
//                                 >
//                                     <ArrowLeft size={18} />
//                                 </button>
//                                 <button
//                                     onClick={nextSlide}
//                                     className="p-3 rounded-full border border-[var(--border-color)] hover:bg-[var(--gray-light)] transition-colors"
//                                     aria-label="Next Slide"
//                                 >
//                                     <ArrowRight size={18} />
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>

//                     {/* IMAGE SLIDER */}
//                     <motion.div
//                         initial={{ opacity: 0, scale: 0.98 }}
//                         whileInView={{ opacity: 1, scale: 1 }}
//                         transition={{ duration: 0.7 }}
//                         viewport={{ once: true }}
//                         className={`${variant === 'compact' ? 'order-1 md:order-2' : ''}`}
//                     >
//                         <div className="relative overflow-hidden rounded-2xl shadow-lg bg-[var(--card-bg)]">
//                             <AnimatePresence mode="wait">
//                                 {products.length > 0 ? (
//                                     <motion.div
//                                         key={currentIndex}
//                                         initial={{ opacity: 0, x: 40 }}
//                                         animate={{ opacity: 1, x: 0 }}
//                                         exit={{ opacity: 0, x: -40 }}
//                                         transition={{ duration: 0.6, ease: 'easeOut' }}
//                                     >
//                                         <Link href={`/products/${products[currentIndex].slug}`} className="block">
//                                             <LazyImage
//                                                 src={products[currentIndex].mainImage}
//                                                 alt={products[currentIndex].name}
//                                                 fill
//                                                 className="w-full h-[500] object-cover rounded-2xl"
//                                             />
//                                             {/* Product overlay on hover */}
//                                             <div
//                                                 className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 rounded-xl"
//                                                 style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
//                                             />

//                                             <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                                                 <div
//                                                     className="bg-white p-4 rounded-lg shadow-lg"
//                                                     style={{ backgroundColor: 'var(--background)' }}
//                                                 >
//                                                     <h3
//                                                         className="text-lg font-bold mb-1"
//                                                         style={{ color: 'var(--text-primary)' }}
//                                                     >
//                                                         {products[currentIndex].name}
//                                                     </h3>
//                                                     <p
//                                                         className="text-sm"
//                                                         style={{ color: 'var(--text-secondary)' }}
//                                                     >
//                                                         {products[currentIndex].price} جنيه
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </Link>
//                                     </motion.div>
//                                 ) : (
//                                     <LazyImage
//                                         src={imageUrl}
//                                         alt={title}
//                                         width={1000}
//                                         height={700}
//                                         className="w-full h-auto object-cover rounded-2xl"
//                                     />
//                                 )}
//                             </AnimatePresence>

//                             {/* Dots */}
//                             {products.length > 1 && (
//                                 <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
//                                     {products.map((_, i) => (
//                                         <button
//                                             key={i}
//                                             onClick={() => setCurrentIndex(i)}
//                                             className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'w-5 bg-[var(--main-color)]' : 'bg-[var(--gray)]'
//                                                 }`}
//                                         />
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </motion.div>
//                 </div>
//             </div>
//         </section>
//     );
// });

// export default FeaturedProducts;



'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import LazyImage from '../common/LazyImage';

// Memoized product slide component
const ProductSlide = memo(({ product, isActive, title }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        className="absolute inset-0"
    >
        <Link
            href={`/products/${product.slug}`}
            className="block relative h-full group"
            aria-label={`عرض ${product.name}`}
        >
            <div className="relative h-full overflow-hidden">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="h-full"
                >
                    <LazyImage
                        src={product.mainImage}
                        alt={product.altText || `${product.name} - ${title}`}
                        width={1200}
                        height={1400}
                        className="w-full h-full object-cover"
                        priority={isActive}
                    />
                </motion.div>

                {/* Luxury gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Product info overlay */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="absolute bottom-0 left-0 right-0 p-8 md:p-12"
                >
                    <div className="backdrop-blur-md bg-white/90 p-6 md:p-8 border border-white/20 shadow-2xl">
                        <h3
                            className="text-xl md:text-2xl font-serif font-light tracking-wide mb-2"
                            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading-family)' }}
                        >
                            {product.name}
                        </h3>
                        <p
                            className="text-sm md:text-base tracking-wider"
                            style={{ color: '#c6a664', fontFamily: 'var(--font-body-family)' }}
                        >
                            {product.price} جنيه
                        </p>
                    </div>
                </motion.div>
            </div>
        </Link>
    </motion.div>
));

ProductSlide.displayName = 'ProductSlide';

// Memoized navigation button
const NavButton = memo(({ direction, onClick, label }) => (
    <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="p-3 md:p-4 backdrop-blur-sm bg-white/10 border border-white/30 hover:bg-white/20 transition-all duration-300"
        aria-label={label}
        style={{ borderRadius: '2px' }}
    >
        {direction === 'prev' ? (
            <ChevronLeft size={20} className="text-white drop-shadow-lg" />
        ) : (
            <ChevronRight size={20} className="text-white drop-shadow-lg" />
        )}
    </motion.button>
));

NavButton.displayName = 'NavButton';

// Main component
export default function FeaturedProducts({
    title,
    subtitle,
    description,
    imageUrl,
    link,
    products,
    variant = 'default'
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const timeoutRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Memoized structured data
    const structuredData = useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": title,
        "description": description,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": products?.map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Product",
                    "name": product.name,
                    "image": product.mainImage,
                    "url": `/products/${product.slug}`
                }
            })) || []
        }
    }), [title, description, products]);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }, [products.length]);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    }, [products.length]);

    const goToSlide = useCallback((index) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    }, [currentIndex]);

    // Auto-rotate with cleanup
    useEffect(() => {
        if (!products || products.length <= 1) return;

        timeoutRef.current = setTimeout(nextSlide, 6000);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [currentIndex, products, nextSlide]);

    // Touch handlers for mobile swipe
    const handleTouchStart = useCallback((e) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);

    const handleTouchMove = useCallback((e) => {
        touchEndX.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback(() => {
        const swipeThreshold = 50;
        const diff = touchStartX.current - touchEndX.current;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }, [nextSlide, prevSlide]);

    const isCompact = variant === 'compact';
    const hasProducts = products && products.length > 0;

    return (
        <section
            className={`relative ${isCompact ? 'py-12 md:py-16' : 'py-16 md:py-24'}`}
            style={{ backgroundColor: 'var(--background)' }}
            aria-label={title}
        >
            {/* SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className={`grid ${isCompact ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-5'} gap-8 lg:gap-12 items-center`}>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                        className={`${isCompact ? 'order-2 lg:order-1' : 'lg:col-span-2'} space-y-6 md:space-y-8`}
                    >
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="text-xs md:text-sm uppercase tracking-[0.3em] font-light"
                                style={{ color: '#c6a664', fontFamily: 'var(--font-body-family)' }}
                            >
                                {subtitle}
                            </motion.p>
                        )}

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light leading-[1.1] tracking-tight"
                            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading-family)' }}
                        >
                            {title}
                        </motion.h2>

                        {description && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-base md:text-lg leading-relaxed max-w-xl font-light"
                                style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body-family)' }}
                            >
                                {description}
                            </motion.p>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4"
                        >
                            <Link href={link}>
                                <motion.div
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative px-8 py-4 overflow-hidden"
                                    style={{ border: '1px solid var(--text-primary)' }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-black"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: 0 }}
                                        transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
                                    />
                                    <span
                                        className="relative text-sm md:text-base tracking-wider uppercase font-light group-hover:text-white transition-colors duration-400"
                                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body-family)' }}
                                    >
                                        اكتشف المجموعة
                                    </span>
                                </motion.div>
                            </Link>

                            {hasProducts && products.length > 1 && (
                                <div className="flex items-center gap-2">
                                    <NavButton direction="prev" onClick={prevSlide} label="السلايد السابق" />
                                    <NavButton direction="next" onClick={nextSlide} label="السلايد التالي" />
                                </div>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Visual Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
                        className={`${isCompact ? 'order-1 lg:order-2' : 'lg:col-span-3'} relative`}
                    >
                        <div
                            className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            style={{ backgroundColor: '#f5f5f5' }}
                        >
                            {hasProducts ? (
                                <>
                                    {/* Product slides */}
                                    {products.map((product, index) => (
                                        <ProductSlide
                                            key={product.slug}
                                            product={product}
                                            isActive={currentIndex === index}
                                            title={title}
                                        />
                                    ))}

                                    {/* Dots indicator */}
                                    {products.length > 1 && (
                                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                            {products.map((_, index) => (
                                                <motion.button
                                                    key={index}
                                                    onClick={() => goToSlide(index)}
                                                    className="relative h-1 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: currentIndex === index ? '32px' : '8px',
                                                        backgroundColor: currentIndex === index ? '#c6a664' : 'rgba(255,255,255,0.5)'
                                                    }}
                                                    whileHover={{ scale: 1.2 }}
                                                    aria-label={`الذهاب إلى السلايد ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <LazyImage
                                    src={imageUrl}
                                    alt={title}
                                    width={1200}
                                    height={1400}
                                    className="w-full h-full object-cover"
                                    priority
                                />
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

FeaturedProducts.defaultProps = {
    variant: 'default'
};