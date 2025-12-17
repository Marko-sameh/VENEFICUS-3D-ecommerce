// // // src/components/home/HeroBanner.tsx
// // import { Button } from '@/components/ui/Button';
// // import LazyImage from '../common/LazyImage';

// // export function HeroBanner({ imag = "", primaryText = "", secondryText = "", btnText = "" }) {
// //     return (
// //         <section className=" w-full rounded-lg shadow-md mb-10">
// //             <div className="flex flex-col md:flex-row items-center gap-8 ">
// //                 {/* Image Section */}
// //                 <div className="w-full h-[550px] md:w-1/2 shadow-lg">
// //                     <LazyImage
// //                         src={imag}
// //                         alt="Premium denim collection"
// //                         fill={true}
// //                         className="rounded-lg shadow-md w-[100%] h-[550px]"
// //                         sizes='(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw'
// //                     />
// //                 </div>

// //                 {/* Text Section */}
// //                 <div className="w-full md:w-1/2">
// //                     <h2 className="text-3xl md:text-5xl font-bold text-[var(--main-color)] mb-4">
// //                         {primaryText}
// //                     </h2>
// //                     <p className="text-lg text-[var(--text-secondary)] mb-6 max-w-md">
// //                         {secondryText}
// //                     </p>
// //                     <Button
// //                         variant="solid"
// //                         href="/products"
// //                         className="bg-[var(--main-color)] hover:bg-[var(--main-color-hover)]"
// //                     >
// //                         {btnText}
// //                     </Button>
// //                 </div>
// //             </div>
// //         </section>
// //     );
// // }


// // src/components/home/HeroBanner.jsx
// import { Button } from '@/components/ui/Button';
// import LazyImage from '@/components/common/LazyImage';
// import { JsonLd } from '@/components/seo/JsonLd';

// export function HeroBanner({
//     image = "",
//     imageAlt = "Veneficus Premium Collection - Luxury Fashion",
//     primaryText = "Premium Fashion Collection",
//     secondaryText = "Discover our exclusive designs crafted with the finest materials and attention to detail",
//     btnText = "",
//     ctaUrl = "/products"
// }) {
//     const aspectRatio = 0.8;

//     return (
//         <>
//             <JsonLd
//                 item={{
//                     '@context': 'https://schema.org',
//                     '@type': 'WebSite',
//                     name: 'Veneficus',
//                     description: primaryText,
//                     image: image,
//                     potentialAction: {
//                         '@type': 'ViewAction',
//                         target: ctaUrl,
//                         name: btnText
//                     }
//                 }}
//             />

//             <section
//                 className="w-full rounded-lg mb-10"
//                 aria-label="Hero Banner - Premium Fashion Collection"
//             >
//                 <div className="flex flex-col md:flex-row items-center gap-8">
//                     {/* <div className="w-full relative" style={{ paddingTop: `${aspectRatio * 100}%` }}>
//                         <LazyImage
//                             src={image}
//                             alt={imageAlt}
//                             fill={true}
//                             className="rounded-lg shadow-md w-[100%] h-[550px]"
//                             sizes='(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw'
//                             priority={true}
//                         />
//                     </div> */}
//                     <div className="w-full h-[550px] md:w-1/2 shadow-lg">
//                         <LazyImage
//                             src={image}
//                             alt={imageAlt}
//                             fill={true}
//                             className="rounded-lg shadow-md w-[100%] h-[550px]"
//                             sizes='(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw'
//                             priority={true}
//                         />
//                     </div>
//                     <div className="w-full md:w-1/2 px-4 md:px-0">
//                         <h1
//                             className="
//     text-2xl md:text-6xl 
//     font-bold 
//     bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FFB300] 
//     bg-clip-text text-transparent
//     drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]
//     md:drop-shadow-[3px_3px_6px_rgba(0,0,0,0.5)]
//     tracking-wide
//     mb-6
//     animate-fadeInUp
//   "
//                         >
//                             {primaryText}
//                         </h1>


//                         <p className="text-lg text-[var(--text-secondary)] mb-6 max-w-md">
//                             {secondaryText}
//                         </p>

//                         {btnText && <Button
//                             variant="default"
//                             href={ctaUrl}
//                             className=""
//                             aria-label={`Explore ${primaryText}`}
//                         >
//                             {btnText}
//                         </Button>}
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// }



// "use client";
// import { Button } from '@/components/ui/Button';
// import LazyImage from '@/components/common/LazyImage';
// import { JsonLd } from '@/components/seo/JsonLd';

// export function HeroBanner({
//     image = "",
//     imageAlt = "Veneficus Premium Collection - Luxury Fashion",
//     primaryText = "Find the best VENEFICUS for your closet",
//     secondaryText = "Discover our exclusive designs crafted with the finest materials and attention to detail",
//     btnText = "Shop now",
//     ctaUrl = "/products"
// }) {
//     return (
//         <>
//             <JsonLd
//                 item={{
//                     '@context': 'https://schema.org',
//                     '@type': 'WebSite',
//                     name: 'Veneficus',
//                     description: primaryText,
//                     image: image,
//                     potentialAction: {
//                         '@type': 'ViewAction',
//                         target: ctaUrl,
//                         name: btnText
//                     }
//                 }}
//             />

//             <section
//                 className="relative w-full h-[600px] md:h-[650px] rounded-lg overflow-hidden"
//                 aria-label="Hero Banner - Premium Fashion Collection"
//             >
//                 {/* Background Image */}
//                 <LazyImage
//                     src={image}
//                     alt={imageAlt}
//                     fill={true}
//                     className="object-cover w-full h-full"
//                     priority={true}
//                 />

//                 {/* Overlay Gradient */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

//                 {/* Text Overlay */}
//                 <div className="absolute inset-0 flex items-center justify-end text-right px-6 md:px-16">
//                     <div className="max-w-lg">
//                         <h1
//                             className="
//                                 text-3xl md:text-6xl 
//                                 font-bold 
//                                 bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FFB300] 
//                                 bg-clip-text text-transparent
//                                 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.6)]
//                                 tracking-wide
//                                 mb-6
//                                 animate-fadeInUp
//                             "
//                         >
//                             {primaryText}
//                         </h1>

//                         <p className="text-lg text-white/90 mb-6">
//                             {secondaryText}
//                         </p>

//                         {btnText && (
//                             <Button
//                                 variant="solid"
//                                 href={ctaUrl}
//                                 className="bg-[#FFD700] hover:bg-[#FFC107] text-black font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
//                                 aria-label={`Explore ${primaryText}`}
//                             >
//                                 {btnText}
//                             </Button>
//                         )}
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// }
// "use client";
// import { Button } from '@/components/ui/Button';
// import LazyImage from '@/components/common/LazyImage';
// import { JsonLd } from '@/components/seo/JsonLd';

// export function HeroBanner({
//     image = "",
//     imageAlt = "Veneficus Premium Collection - Luxury Fashion",
//     primaryText = "Find the best VENEFICUS for your closet",
//     secondaryText = "Discover our exclusive designs crafted with the finest materials and attention to detail",
//     btnText = "Shop now",
//     ctaUrl = "/products"
// }) {
//     return (
//         <>
//             <JsonLd
//                 item={{
//                     '@context': 'https://schema.org',
//                     '@type': 'WebSite',
//                     name: 'Veneficus',
//                     description: primaryText,
//                     image: image,
//                     potentialAction: {
//                         '@type': 'ViewAction',
//                         target: ctaUrl,
//                         name: btnText
//                     }
//                 }}
//             />

//             <section
//                 className="relative w-full h-[100vh] md:h-[650px] rounded-lg overflow-hidden"
//                 aria-label="Hero Banner - Premium Fashion Collection"
//             >
//                 {/* Background Image */}
//                 <LazyImage
//                     src={image}
//                     alt={imageAlt}
//                     fill={true}
//                     className="object-cover w-full h-full"
//                     priority={true}
//                 />

//                 {/* Overlay Gradient */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

//                 {/* Text Overlay */}
//                 <div className="absolute inset-0 flex items-center justify-end text-right px-6 md:px-16">
//                     <div className="max-w-lg">
//                         <h1
//                             className="
//                                 text-3xl md:text-6xl 
//                                 font-bold 
//                                 bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FFB300] 
//                                 bg-clip-text text-transparent
//                                 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.6)]
//                                 tracking-wide
//                                 mb-6
//                                 animate-fadeInUp
//                             "
//                         >
//                             {primaryText}
//                         </h1>

//                         <p className="text-lg text-white/90 mb-6">
//                             {secondaryText}
//                         </p>

//                         {btnText && (
//                             <Button
//                                 variant="solid"
//                                 href={ctaUrl}
//                                 className="bg-[#FFD700] hover:bg-[#FFC107] text-black font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
//                                 aria-label={`Explore ${primaryText}`}
//                             >
//                                 {btnText}
//                             </Button>
//                         )}
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// }


// "use client";
// import { Button } from '@/components/ui/Button';
// import LazyImage from '@/components/common/LazyImage';
// import { JsonLd } from '@/components/seo/JsonLd';
// import Link from 'next/link';

// export function HeroBanner({
//     image = "",
//     imageAlt = "Veneficus Premium Collection - Luxury Fashion",
//     primaryText = "Find the best VENEFICUS for your closet",
//     secondaryText = "Discover our exclusive designs crafted with the finest materials and attention to detail",
//     btnText = "Shop now",
//     ctaUrl = "/products"
// }) {
//     return (
//         <>
//             <JsonLd
//                 item={{
//                     '@context': 'https://schema.org',
//                     '@type': 'WebSite',
//                     name: 'Veneficus',
//                     description: primaryText,
//                     image: image,
//                     potentialAction: {
//                         '@type': 'ViewAction',
//                         target: ctaUrl,
//                         name: btnText
//                     }
//                 }}
//             />

//             <section
//                 className="relative w-full h-[100vh]  overflow-hidden"
//                 aria-label="Hero Banner - Premium Fashion Collection"
//             >
//                 {/* Background Image */}
//                 <LazyImage
//                     src={image}
//                     alt={imageAlt}
//                     fill={true}
//                     className="w-full h-full object-fill"
//                     priority={true}
//                 />

//                 {/* Gradient Overlay - from left (beige) to right (black) */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/99 to-black"></div>

//                 {/* Content Container */}
//                 <div className="absolute inset-0 flex items-center justify-end px-6 md:px-16 lg:px-24">
//                     <div className="max-w-2xl w-[35%] text-left">
//                         {/* Main Heading */}
//                         <h1 className="text-3xl md:text-3xl lg:text-6xl font-bold text-[var(--main-color)] mb-6 leading-tight">
//                             {primaryText}
//                         </h1>

//                         {/* Subheading */}
//                         <p className="text-base md:text-lg text-white mb-8 leading-relaxed">
//                             {secondaryText}
//                         </p>

//                         {/* CTA Button */}
//                         {btnText && (
//                             <Link href={ctaUrl}>
//                                 <Button

//                                     href={ctaUrl}
//                                     className="  font-semibold "
//                                     aria-label={`Explore ${primaryText}`}
//                                 >
//                                     {btnText}
//                                 </Button>
//                             </Link>
//                         )}
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// }



// "use client";
// import { Button } from '@/components/ui/Button';
// import LazyImage from '@/components/common/LazyImage';
// import { JsonLd } from '@/components/seo/JsonLd';
// import Link from 'next/link';

// export function HeroBanner({
//     image = "",
//     imageAlt = "Veneficus Premium Collection - Luxury Fashion",
//     primaryText = "Find the best VENEFICUS for your closet",
//     secondaryText = "Discover our exclusive designs crafted with the finest materials and attention to detail",
//     btnText = "Shop now",
//     ctaUrl = "/products"
// }) {
//     return (
//         <>
//             <JsonLd
//                 item={{
//                     '@context': 'https://schema.org',
//                     '@type': 'WebSite',
//                     name: 'Veneficus',
//                     description: primaryText,
//                     image: image,
//                     potentialAction: {
//                         '@type': 'ViewAction',
//                         target: ctaUrl,
//                         name: btnText
//                     }
//                 }}
//             />

//             <section
//                 className="relative w-full h-[100vh] overflow-hidden"
//                 aria-label="Hero Banner - Premium Fashion Collection"
//             >
//                 {/* Background Image */}
//                 <LazyImage
//                     src={image}
//                     alt={imageAlt}
//                     fill={true}
//                     className="w-full h-full object-cover md:object-fill"
//                     priority={true}
//                 />

//                 {/* Gradient Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/90 to-transparent md:from-transparent md:via-black/99 md:to-black"></div>

//                 {/* Content */}
//                 <div
//                     className="
//             absolute inset-0 flex flex-col justify-center md:justify-center 
//             items-center md:items-end 
//             text-start md:text-left 
//             px-0 sm:px-0 md:px-16 lg:px-24 
//             pb-0 md:pb-0
//           "
//                 >
//                     <div className="w-[20%] md:w-[35%] max-w-2xl">
//                         <h1
//                             className="
//                 text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
//                 font-bold text-[var(--main-color)] 
//                 mb-4 sm:mb-6 leading-tight
//               "
//                         >
//                             {primaryText}
//                         </h1>

//                         <p
//                             className="
//                 text-sm sm:text-base md:text-lg 
//                 text-white mb-6 sm:mb-8 leading-relaxed
//               "
//                         >
//                             {secondaryText}
//                         </p>

//                         {btnText && (
//                             <Link href={ctaUrl} aria-label={`Explore ${primaryText}`}>
//                                 <Button
//                                     href={ctaUrl}
//                                     className="
//                     font-semibold px-6 sm:px-8 py-3 
//                     text-sm sm:text-base 
//                     w-auto sm:w-auto md:w-auto
//                   "
//                                 >
//                                     {btnText}
//                                 </Button>
//                             </Link>
//                         )}
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// }



"use client";
import { Button } from '@/components/ui/Button';
import LazyImage from '@/components/common/LazyImage';
import { JsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function HeroBanner({
    image = "",
    imageAlt = "Veneficus Premium Collection - Luxury Fashion",
    primaryText = "Find the best VENEFICUS for your closet",
    secondaryText = "Discover our exclusive designs crafted with the finest materials and attention to detail",
    btnText = "Shop now",
    ctaUrl = "/products"
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <>
            <JsonLd
                item={{
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: 'Veneficus',
                    description: primaryText,
                    image: image,
                    potentialAction: {
                        '@type': 'ViewAction',
                        target: ctaUrl,
                        name: btnText
                    }
                }}
            />
            <section
                ref={ref}
                className="relative w-full h-[100vh] overflow-hidden"
                aria-label="Hero Banner - Premium Fashion Collection"
            >
                {/* Parallax Background */}
                <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%]">
                    <LazyImage
                        src={image}
                        alt={imageAlt}
                        fill={true}
                        className="w-full h-full object-cover md:object-fill scale-110"
                        priority={true}
                    />
                </motion.div>

                {/* Enhanced Gradient with Glass Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent md:from-transparent md:via-black/95 md:to-black backdrop-blur-[2px]"></div>

                {/* Animated Content */}
                <motion.div
                    style={{ opacity }}
                    className="absolute inset-0 flex flex-col justify-center items-start md:items-end px-6 sm:px-8 md:px-16 lg:px-24"
                >
                    <div className="w-[90%] sm:w-[70%] md:w-[35%] max-w-2xl text-start md:text-left space-y-6">
                        {/* Animated Heading with Stagger */}
                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--main-color)] leading-tight drop-shadow-2xl"
                        >
                            {primaryText}
                        </motion.h1>

                        {/* Animated Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed backdrop-blur-sm"
                        >
                            {secondaryText}
                        </motion.p>

                        {/* Animated CTA with Hover Effect */}
                        {btnText && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Link href={ctaUrl} aria-label={`Explore ${primaryText}`}>
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <Button className="font-semibold px-6 sm:px-8 py-3 text-sm sm:text-base shadow-2xl shadow-[var(--main-color)]/30">
                                            {btnText}
                                        </Button>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--main-color)] rounded-full blur-[150px] pointer-events-none"
                />
            </section>
        </>
    );
}