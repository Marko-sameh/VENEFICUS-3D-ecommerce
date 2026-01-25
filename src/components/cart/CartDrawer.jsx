// 'use client';

// import { useEffect } from 'react';
// import { X } from 'lucide-react';
// import { CartItems } from './CartItems';
// import { CartSummary } from './CartSummary';
// import { useCart } from '@/hooks/useCart';

// /**
//  * CartDrawer component - Slide-out cart panel
//  * Accessible via cart icon in header, follows design system
//  * Implements proper ARIA attributes for accessibility
//  */
// export function CartDrawer({ isOpen, onClose }) {
//     const { items, isEmpty } = useCart();

//     useEffect(() => {
//         if (isOpen) {
//             // Prevent background scrolling when drawer is open
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'unset';
//         }

//         return () => {
//             document.body.style.overflow = 'unset';
//         };
//     }, [isOpen]);

//     if (!isOpen) return null;

//     return (
//         <div
//             className="fixed inset-0 z-50 overflow-hidden"
//             aria-modal="true"
//             role="dialog"
//             aria-label="Shopping cart"
//         >
//             {/* Overlay */}
//             <div
//                 className="absolute inset-0 bg-black bg-opacity-50"
//                 onClick={onClose}
//                 aria-hidden="true"
//             />

//             {/* Drawer */}
//             <div className="absolute right-0 inset-y-0 flex max-w-full">
//                 <div className="h-full w-screen max-w-md flex flex-col bg-[var(--background)] shadow-xl">
//                     {/* Header */}
//                     <div className="px-4 py-6 border-b border-[var(--border-color)] flex items-center justify-between">
//                         <h2
//                             className="text-2xl font-[var(--font-heading-weight)]"
//                             style={{ fontFamily: 'var(--font-heading-family)' }}
//                             id="cart-drawer-title"
//                         >
//                             Shopping Cart
//                         </h2>
//                         <button
//                             onClick={onClose}
//                             className="text-[var(--text-light)] hover:text-[var(--text-primary)]"
//                             aria-label="Close cart"
//                         >
//                             <X className="h-6 w-6" />
//                         </button>
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
//                         {isEmpty ? (
//                             <div className="h-64 flex flex-col items-center justify-center">
//                                 <p className="text-[var(--text-secondary)] mb-6">Your cart is empty</p>
//                                 <button
//                                     onClick={onClose}
//                                     className="px-6 py-2 bg-[var(--main-color)] text-[var(--text-white)] rounded-md hover:bg-[var(--main-color-hover)] transition-colors"
//                                 >
//                                     Continue Shopping
//                                 </button>
//                             </div>
//                         ) : (
//                             <>
//                                 <CartItems isDrawer={true} />
//                                 <CartSummary cart={{ items }} isDrawer={true} />
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }



// 'use client';

// import { useEffect } from 'react';
// import { X } from 'lucide-react';
// import { CartItems } from './CartItems';
// import { CartSummary } from './CartSummary';
// import { useCart } from '@/hooks/useCart';
// import { motion, AnimatePresence } from 'framer-motion';

// export function CartDrawer({ isOpen, onClose }) {
//     const { items, isEmpty } = useCart();

//     useEffect(() => {
//         if (isOpen) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'unset';
//         }
//         return () => {
//             document.body.style.overflow = 'unset';
//         };
//     }, [isOpen]);

//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <div
//                     className="fixed inset-0 z-50 overflow-hidden"
//                     aria-modal="true"
//                     role="dialog"
//                     aria-label="Shopping cart"
//                 >
//                     {/* Overlay */}
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 0.5 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="absolute inset-0 bg-black"
//                         onClick={onClose}
//                         aria-hidden="true"
//                     />

//                     {/* Drawer */}
//                     <div className="absolute right-0 inset-y-0 flex max-w-full">
//                         <motion.div
//                             initial={{ x: '100%' }}
//                             animate={{ x: 0 }}
//                             exit={{ x: '100%' }}
//                             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//                             className="h-full w-screen max-w-md flex flex-col 
//                                        bg-[var(--background)] backdrop-blur-lg 
//                                        border-l border-[var(--border-color)] shadow-2xl"
//                         >
//                             {/* Header */}
//                             <div className="px-4 py-6 border-b border-[var(--border-color)] flex items-center justify-between">
//                                 <h2
//                                     className="text-2xl font-[var(--font-heading-weight)] tracking-wide text-[var(--main-color)]"
//                                     id="cart-drawer-title"
//                                 >
//                                     Shopping Cart
//                                 </h2>
//                                 <motion.button
//                                     onClick={onClose}
//                                     whileHover={{ rotate: 90 }}
//                                     transition={{ type: 'spring', stiffness: 200 }}
//                                     className="text-[var(--text-light)] hover:text-[var(--text-primary)]"
//                                     aria-label="Close cart"
//                                 >
//                                     <X className="h-6 w-6" />
//                                 </motion.button>
//                             </div>

//                             {/* Content */}
//                             <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
//                                 {isEmpty ? (
//                                     <div className="h-64 flex flex-col items-center justify-center text-center">
//                                         <p className="text-[var(--text-secondary)] mb-6 text-lg">Your cart is empty</p>
//                                         <button
//                                             onClick={onClose}
//                                             className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-[var(--text-white)] rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-800 transition-all"
//                                         >
//                                             Continue Shopping
//                                         </button>
//                                     </div>
//                                 ) : (
//                                     <>
//                                         <CartItems isDrawer={false} />
//                                         <CartSummary cart={{ items }} isDrawer={true} />
//                                     </>
//                                 )}
//                             </div>
//                         </motion.div>
//                     </div>
//                 </div>
//             )}
//         </AnimatePresence>
//     );
// }



// 'use client';

// import { useEffect } from 'react';
// import { X } from 'lucide-react';
// import { CartItems } from './CartItems';
// import { CartSummary } from './CartSummary';
// import { useCart } from '@/hooks/useCart';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useUserSettings } from '@/hooks/useUserSettings';

// export function CartDrawer({ isOpen, onClose }) {
//     const { items, isEmpty } = useCart();
//     const { checkout } = useUserSettings();
//     const { isGuest } = checkout;


//     useEffect(() => {
//         if (isOpen) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'unset';
//         }
//         return () => {
//             document.body.style.overflow = 'unset';
//         };
//     }, [isOpen]);


//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <div
//                     className="fixed inset-0 z-50 overflow-hidden"
//                     aria-modal="true"
//                     role="dialog"
//                     aria-label="Shopping cart"
//                 >
//                     {/* Overlay */}
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 0.5 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 1.5 }}
//                         className="absolute inset-0 bg-black"
//                         onClick={onClose}
//                         aria-hidden="true"
//                     />

//                     {/* Drawer */}
//                     <div className="absolute right-0 inset-y-0 flex max-w-full">
//                         <motion.div
//                             key="drawer"
//                             initial={{ x: '100%' }}
//                             animate={{ x: 0 }}
//                             exit={{ x: '100%' }}   // 👈 هنا بانيميشن الخروج
//                             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//                             className="h-full w-screen max-w-md flex flex-col 
//                                        bg-[var(--background)] backdrop-blur-lg 
//                                        border-l border-[var(--border-color)] shadow-2xl"
//                         >


//                             {/* Header */}
//                             <div className="px-4 py-6 border-b border-[var(--border-color)] flex items-center justify-between">
//                                 <h2
//                                     className="text-2xl font-[var(--font-heading-weight)] tracking-wide text-[var(--main-color)]"
//                                     id="cart-drawer-title"
//                                 >
//                                     Shopping Cart
//                                 </h2>
//                                 <motion.button
//                                     onClick={onClose}
//                                     whileHover={{ rotate: 90 }}
//                                     transition={{ type: 'spring', stiffness: 200 }}
//                                     className="text-[var(--text-light)] hover:text-[var(--text-primary)]"
//                                     aria-label="Close cart"
//                                 >
//                                     <X className="h-6 w-6" />
//                                 </motion.button>
//                             </div>

//                             <>
//                                 {/* Content */}
//                                 <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
//                                     {isEmpty ? (
//                                         <div className="h-64 flex flex-col items-center justify-center text-center">
//                                             <p className="text-[var(--text-secondary)] mb-6 text-lg">Your cart is empty</p>
//                                             <button
//                                                 onClick={onClose}
//                                                 className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-[var(--text-white)] rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-800 transition-all"
//                                             >
//                                                 Continue Shopping
//                                             </button>
//                                         </div>
//                                     ) : isGuest ? <div className="bg-[var(--main-color-light)] border border-[var(--main-color)] rounded-lg p-4 mb-6">
//                                         <div className="flex items-center space-x-3">
//                                             <svg className="w-5 h-5 text-[var(--main-color)]" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                                             </svg>
//                                             <div>
//                                                 <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
//                                                     You must sign in first
//                                                 </p>
//                                                 <p className="text-sm" style={{ color: 'var(--text-light)' }}>
//                                                     Please sign in to your account to continue with checkout
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                         : (
//                                             <>
//                                                 <CartItems isDrawer={false} />
//                                                 <CartSummary cart={{ items }} isDrawer={true} />
//                                             </>
//                                         )}
//                                 </div>
//                             </>
//                         </motion.div>
//                     </div>
//                 </div>
//             )}
//         </AnimatePresence>
//     );

// }




"use client";

import { useEffect, memo } from "react";
import { X } from "lucide-react";
import { CartItems } from "./CartItems";
import { CartSummary } from "./CartSummary";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import GoogleSignInButton from "../auth/GoogleSignInButton";
import { useUnifiedCartStore } from "@/store";


// ✅ Component for Empty Cart
const EmptyCart = ({ onClose }) => (
    <div className="h-64 flex flex-col items-center justify-center text-center">
        <p className="text-[var(--text-secondary)] mb-6 text-lg">
            Your cart is empty
        </p>
        <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-700 
                 text-[var(--text-white)] rounded-lg shadow-md 
                 hover:from-yellow-600 hover:to-yellow-800 transition-all"
        >
            Continue Shopping
        </button>
    </div>
);

// ✅ Component for Login Required
const LoginRequired = ({ onLoginSuccess }) => (
    <div className="h-64 flex flex-col items-center justify-center text-center p-6">
        <div className="bg-[var(--main-color-light)] border border-[var(--main-color)] rounded-lg p-6 w-full">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                You must login first
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">
                Please sign in to your account to view your cart
            </p>
            <GoogleSignInButton onSuccess={onLoginSuccess} />
        </div>
    </div>
);

export const CartDrawer = memo(function CartDrawer({ isOpen, onClose }) {
    const { items, itemCount, isLoading } = useUnifiedCartStore();
    const isEmpty = items.length === 0;
    const { isAuthenticated, refreshAuth } = useAuth();

    const handleLoginSuccess = () => {
        refreshAuth();
        window.location.reload();
    };

    // ✅ prevent body scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 overflow-hidden h-[100vh]"
                    aria-modal="true"
                    role="dialog"
                    aria-label="Shopping cart"
                >
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-black"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <div className="absolute right-0 inset-y-0 flex max-w-full">
                        <motion.div
                            key="drawer"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="h-full w-screen max-w-md flex flex-col 
                         bg-[var(--background)] backdrop-blur-lg 
                         border-l border-[var(--border-color)] shadow-2xl"
                        >
                            {/* Header */}
                            <div className="px-4 py-6 border-b border-[var(--border-color)] flex items-center justify-between">
                                <h2
                                    className="text-2xl font-[var(--font-heading-weight)] tracking-wide text-[var(--main-color)]"
                                    id="cart-drawer-title"
                                >
                                    Shopping Cart {itemCount > 0 && `(${itemCount})`}
                                </h2>
                                <motion.button
                                    onClick={onClose}
                                    whileHover={{ rotate: 90 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="text-[var(--text-light)] hover:text-[var(--text-primary)]"
                                    aria-label="Close cart"
                                >
                                    <X className="h-6 w-6" />
                                </motion.button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-32">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--main-color)]"></div>
                                    </div>
                                ) : !isAuthenticated ? (
                                    <LoginRequired onLoginSuccess={handleLoginSuccess} />
                                ) : isEmpty ? (
                                    <EmptyCart onClose={onClose} />
                                ) : (
                                    <>
                                        <CartItems isDrawer={true} />
                                        <CartSummary isDrawer={true} />
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
});
