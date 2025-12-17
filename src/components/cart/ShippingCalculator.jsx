'use client';

import { useCallback, memo } from 'react';
import { MapPin, Truck } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

/**
 * Optimized ShippingCalculator component - Calculate shipping costs
 * Uses centralized cart store for state management
 */
export const ShippingCalculator = memo(function ShippingCalculator() {
    const {
        shippingCost,
        shippingExpanded,
        shippingCountry,
        shippingState,
        shippingLoading,
        shippingError,
        calculateShipping,
        setShippingExpanded,
        setShippingCountry,
        setShippingState
    } = useCart();

    const handleCalculate = useCallback(() => {
        calculateShipping();
    }, [calculateShipping]);

    const toggleExpanded = useCallback(() => {
        setShippingExpanded(!shippingExpanded);
    }, [shippingExpanded, setShippingExpanded]);

    return (
        <div className="mt-4">
            <button
                type="button"
                onClick={toggleExpanded}
                className="flex items-center text-[var(--main-color)] hover:underline w-full"
                aria-expanded={shippingExpanded}
                aria-controls="shipping-calculator-content"
            >
                <Truck className="h-4 w-4 mr-2" />
                <span className="text-sm" style={{ fontFamily: 'var(--font-body-family)' }}>
                    {shippingCost > 0
                        ? `Shipping: $${shippingCost.toFixed(2)}`
                        : 'Calculate shipping'}
                </span>
            </button>

            {shippingExpanded && (
                <div id="shipping-calculator-content" className="mt-3 space-y-3">
                    <div>
                        <label
                            htmlFor="country"
                            className="block text-sm text-[var(--text-secondary)] mb-1"
                            style={{ fontFamily: 'var(--font-body-family)' }}
                        >
                            Country
                        </label>
                        <div className="relative">
                            <select
                                id="country"
                                value={shippingCountry}
                                onChange={(e) => setShippingCountry(e.target.value)}
                                className="w-full pl-3 pr-10 py-2 text-base border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--main-color)] focus:border-[var(--main-color)]"
                                style={{ fontFamily: 'var(--font-body-family)' }}
                            >
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="UK">United Kingdom</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-2">
                                <MapPin className="h-4 w-4 text-[var(--text-light)]" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="state"
                            className="block text-sm text-[var(--text-secondary)] mb-1"
                            style={{ fontFamily: 'var(--font-body-family)' }}
                        >
                            State
                        </label>
                        <select
                            id="state"
                            value={shippingState}
                            onChange={(e) => setShippingState(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 text-base border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--main-color)] focus:border-[var(--main-color)]"
                            style={{ fontFamily: 'var(--font-body-family)' }}
                        >
                            <option value="">Select a state</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DC">District of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            {/* Add other states as needed */}
                        </select>
                    </div>

                    {shippingError && (
                        <p className="text-red-600 text-sm" role="alert">
                            {shippingError}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={handleCalculate}
                        disabled={shippingLoading || !shippingState}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--text-white)] ${shippingLoading || !shippingState
                            ? 'bg-[var(--gray)] cursor-not-allowed'
                            : 'bg-[var(--main-color)] hover:bg-[var(--main-color-hover)]'
                            }`}
                        style={{ fontFamily: 'var(--font-body-family)' }}
                    >
                        {shippingLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Calculating...
                            </span>
                        ) : 'Calculate Shipping'}
                    </button>
                </div>
            )}
        </div>
    );
});