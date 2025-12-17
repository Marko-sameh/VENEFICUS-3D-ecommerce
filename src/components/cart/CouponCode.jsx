'use client';

import { useCallback, memo } from 'react';
import { Check, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

/**
 * Optimized CouponCode component - Apply discount codes
 * Uses centralized cart store for state management
 */
export const CouponCode = memo(function CouponCode() {
    const {
        appliedCoupon,
        couponCode,
        couponStatus,
        couponError,
        applyCouponCode,
        removeCoupon,
        setCouponCode
    } = useCart();

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!couponCode.trim()) return;
        await applyCouponCode(couponCode);
    }, [couponCode, applyCouponCode]);

    const handleRemove = useCallback(() => {
        removeCoupon();
    }, [removeCoupon]);

    return (
        <div className="mt-6">
            <h3
                className="text-sm font-[var(--font-body-weight-bold)] mb-2"
                style={{ fontFamily: 'var(--font-body-family)' }}
            >
                Discount Code
            </h3>

            {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-[var(--gray-light)] rounded-md">
                    <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-[var(--text-primary)]">{appliedCoupon.message}</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="text-[var(--text-light)] hover:text-[var(--text-primary)]"
                        aria-label={`Remove ${appliedCoupon.code} coupon`}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="flex">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter code"
                            className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[var(--main-color)]"
                            style={{ fontFamily: 'var(--font-body-family)' }}
                            disabled={couponStatus === 'loading'}
                        />
                        <button
                            type="submit"
                            disabled={couponStatus === 'loading' || !couponCode.trim()}
                            className={`px-4 py-2 bg-[var(--main-color)] text-[var(--text-white)] rounded-r-md ${couponStatus === 'loading' || !couponCode.trim()
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-[var(--main-color-hover)]'
                                } transition-colors`}
                            style={{ fontFamily: 'var(--font-body-family)' }}
                        >
                            {couponStatus === 'loading' ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Applying...
                                </span>
                            ) : 'Apply'}
                        </button>
                    </div>

                    {couponError && (
                        <p className="mt-2 text-red-600 text-sm" role="alert">
                            {couponError}
                        </p>
                    )}
                </form>
            )}
        </div>
    );
});