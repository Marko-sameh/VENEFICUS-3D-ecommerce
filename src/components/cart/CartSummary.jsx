// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { CouponCode } from './CouponCode';
// import { ShippingCalculator } from './ShippingCalculator';

// /**
//  * CartSummary component - Shows order summary and actions
//  * Implements proper schema.org markup for SEO
//  * Follows VENEFICUS design system
//  */
// export function CartSummary({ cart, isDrawer = false }) {
//     const [appliedCoupon, setAppliedCoupon] = useState(null);
//     const [shippingCost, setShippingCost] = useState(0);
//     const [isProcessing, setIsProcessing] = useState(false);

//     const subtotal = cart.items.reduce(
//         (sum, item) => sum + item.product.price * item.quantity,
//         0
//     );

//     const taxRate = 0.08; // 8% tax
//     const tax = subtotal * taxRate;
//     const total = subtotal + shippingCost + tax;

//     const handleCheckout = () => {
//         setIsProcessing(true);
//         // In a real app, this would redirect to checkout
//         setTimeout(() => {
//             window.location.href = '/checkout';
//         }, 500);
//     };

//     return (
//         <div
//             className={`bg-[var(--card-bg)] rounded-lg p-6 ${isDrawer ? '' : 'sticky top-24'}`}
//             style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
//         >
//             <h2
//                 className="text-xl font-[var(--font-heading-weight)] mb-6"
//                 style={{ fontFamily: 'var(--font-heading-family)' }}
//             >
//                 Order Summary
//             </h2>

//             <div className="space-y-4">
//                 <div className="flex justify-between text-[var(--text-secondary)]">
//                     <span>Subtotal</span>
//                     <span>${subtotal.toFixed(2)}</span>
//                 </div>

//                 <div className="flex justify-between text-[var(--text-secondary)]">
//                     <span>Tax (8%)</span>
//                     <span>${tax.toFixed(2)}</span>
//                 </div>

//                 <ShippingCalculator onShippingCalculated={setShippingCost} />

//                 {appliedCoupon && (
//                     <div className="flex justify-between text-[var(--text-secondary)]">
//                         <span>Discount ({appliedCoupon.code})</span>
//                         <span>- ${appliedCoupon.discount.toFixed(2)}</span>
//                     </div>
//                 )}

//                 <div className="border-t border-[var(--border-color)] pt-4 font-[var(--font-body-weight-bold)] flex justify-between text-[var(--text-primary)]">
//                     <span>Total</span>
//                     <span>${total.toFixed(2)}</span>
//                 </div>
//             </div>

//             <div className="mt-6 space-y-4">
//                 <CouponCode onCouponApplied={setAppliedCoupon} />

//                 <button
//                     onClick={handleCheckout}
//                     disabled={isProcessing}
//                     className={`w-full py-3 px-4 rounded-md text-[var(--text-white)] font-[var(--font-body-weight-bold)] transition-colors ${isProcessing
//                         ? 'bg-[var(--main-color-hover)]'
//                         : 'bg-[var(--main-color)] hover:bg-[var(--main-color-hover)]'
//                         }`}
//                     style={{ fontFamily: 'var(--font-body-family)' }}
//                     aria-busy={isProcessing}
//                 >
//                     {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
//                 </button>

//                 <div className="text-center">
//                     <Link
//                         href="/"
//                         className="text-[var(--main-color)] hover:underline"
//                         style={{ fontFamily: 'var(--font-body-family)' }}
//                     >
//                         Continue Shopping
//                     </Link>
//                 </div>
//             </div>

//             {!isDrawer && (
//                 <div className="mt-6 text-sm text-[var(--text-light)]">
//                     <p>Free shipping on orders over $50</p>
//                     <p>30-day return policy</p>
//                 </div>
//             )}
//         </div>
//     );
// }


'use client';

import Link from 'next/link';
import { useMemo, memo, lazy, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CouponCode } from './CouponCode';
import { useUnifiedCartStore } from '@/store/unifiedCartStore';
import { useUserStore } from '@/store/userStore';

const ShippingCalculator = lazy(() => import('./ShippingCalculator').then(m => ({ default: m.ShippingCalculator })));

/**
 * Optimized CartSummary component
 * Uses selective subscriptions and memoized calculations
 */
export const CartSummary = memo(function CartSummary({ isDrawer = false }) {
    const {
        items,
        itemCount,
        getCartCalculations,
        appliedCoupon,
        shippingCost,
        isProcessing
    } = useUnifiedCartStore();
    
    const params = useParams();
    const router = useRouter();
    const locale = params?.locale || 'en';
    const isEmpty = itemCount === 0;
    const calculations = useMemo(() => getCartCalculations(), [getCartCalculations]);
    
    const handleCheckout = () => {
        if (isEmpty) return;
        router.push(`/${locale}/checkout`);
    };

    return (
        <div
            className={`bg-[var(--card-bg)] rounded-lg p-6 ${isDrawer ? '' : 'sticky top-24'}`}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
            <h2
                className="text-xl font-[var(--font-heading-weight)] mb-6"
                style={{ fontFamily: 'var(--font-heading-family)' }}
            >
                Order Summary
            </h2>

            <div className="space-y-4">
                <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Subtotal</span>
                    <span>${calculations.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Tax ({useUserStore.getState().getTax()}%)</span>
                    <span>${calculations.tax.toFixed(2)}</span>
                </div>

                <Suspense fallback={<div className="text-sm text-[var(--text-secondary)]">Loading shipping options...</div>}>
                    <ShippingCalculator />
                </Suspense>

                {appliedCoupon && (
                    <div className="flex justify-between text-[var(--text-secondary)]">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>- ${calculations.discount.toFixed(2)}</span>
                    </div>
                )}

                <div className="border-t border-[var(--border-color)] pt-4 font-[var(--font-body-weight-bold)] flex justify-between text-[var(--text-primary)]">
                    <span>Total</span>
                    <span>${calculations.finalTotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <CouponCode />

                <button
                    onClick={handleCheckout}
                    disabled={isEmpty || isProcessing}
                    className={`w-full py-3 px-4 rounded-md text-[var(--text-white)] font-[var(--font-body-weight-bold)] transition-colors ${isEmpty || isProcessing
                        ? 'bg-[var(--gray)] cursor-not-allowed'
                        : 'bg-[var(--main-color)] hover:bg-[var(--main-color-hover)]'
                        }`}
                    style={{ fontFamily: 'var(--font-body-family)' }}
                >
                    {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <div className="text-center">
                    <Link
                        href="/"
                        className="text-[var(--main-color)] hover:underline"
                        style={{ fontFamily: 'var(--font-body-family)' }}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>

            {!isDrawer && (
                <div className="mt-6 text-sm text-[var(--text-light)]">
                    <p>Free shipping on orders over $50</p>
                    <p>30-day return policy</p>
                </div>
            )}
        </div>
    );
});
