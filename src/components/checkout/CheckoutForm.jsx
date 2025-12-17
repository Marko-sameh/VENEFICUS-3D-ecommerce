'use client';

import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { AddressSelector } from './AddressSelector';
import { PaymentMethods } from './PaymentMethods';
import { ProgressSteps } from './ProgressSteps';
import { formatAddress } from '@/lib';
import { useUnifiedCheckout } from '@/hooks/useUnifiedCheckout';

export function CheckoutForm({ user, isLoggedIn }) {
    const {
        currentStep,
        customer,
        shippingAddress,
        billingAddress,
        shippingMethod,
        paymentMethod,
        handleNextStep,
        handlePrevStep,
        handlePlaceOrder,
        setCustomerInfo,
        setShippingAddress,
        setBillingAddress,
        setShippingMethod,
        setPaymentMethod,
        isProcessing
    } = useUnifiedCheckout();


    // Initialize customer info from user data
    useEffect(() => {
        if (user && !customer.email) {
            setCustomerInfo({
                email: user.email || '',
                firstName: user.firstName || user.name?.split(' ')[0] || '',
                lastName: user.lastName || user.name?.split(' ')[1] || '',
                phone: user.phone || '',
                isGuest: false
            });
        }
    }, [user, customer.email, setCustomerInfo]);

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">

                        <AddressSelector
                            shippingAddress={shippingAddress}
                            onShippingAddressChange={setShippingAddress}
                            billingAddress={billingAddress}
                            onBillingAddressChange={setBillingAddress}
                        />
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                            Review Order
                        </h3>

                        <div className="space-y-4">
                            {/* Shipping Address */}
                            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <svg className="w-5 h-5" style={{ color: 'var(--main-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Shipping Address</h4>
                                </div>
                                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {shippingAddress && formatAddress(shippingAddress).split('\n').map((line, i) => (
                                        <div key={i}>{typeof line === 'string' ? line : ''}</div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Method */}
                            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <svg className="w-5 h-5" style={{ color: 'var(--main-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Shipping Method</h4>
                                </div>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {shippingMethod?.name || shippingMethod || 'Standard Shipping'}
                                </p>
                            </div>

                            {/* Billing Address */}
                            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <svg className="w-5 h-5" style={{ color: 'var(--main-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h10M7 19h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                    </svg>
                                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Billing Address</h4>
                                </div>
                                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {billingAddress && formatAddress(billingAddress).split('\n').map((line, i) => (
                                        <div key={i}>{typeof line === 'string' ? line : ''}</div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <svg className="w-5 h-5" style={{ color: 'var(--main-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h10M7 19h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                    </svg>
                                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Payment Method</h4>
                                </div>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    cash
                                </p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-[var(--background)] rounded-lg p-6">
            <div className="mt-8">
                {renderStep()}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                {currentStep > 1 && (
                    <Button
                        variant="outline"
                        onClick={handlePrevStep}
                        style={{ borderColor: 'var(--border-color)' }}
                    >
                        Back
                    </Button>
                )}

                {currentStep < 1 ? (
                    <Button
                        className="ml-auto"
                        style={{
                            backgroundColor: 'var(--main-color)',
                            fontFamily: 'var(--font-body-family)'
                        }}
                        onClick={handleNextStep}
                    >
                        Continue to {currentStep === 1 ? 'Review' : ''}
                    </Button>
                ) : (
                    // <Button
                    //     className="ml-auto"
                    //     style={{
                    //         backgroundColor: 'var(--main-color)',
                    //         fontFamily: 'var(--font-body-family)'
                    //     }}
                    //     onClick={handlePlaceOrder}
                    //     disabled={isProcessing}
                    // >
                    //     {isProcessing ? (
                    //         <>
                    //             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    //                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    //                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    //             </svg>
                    //             Processing...
                    //         </>
                    //     ) : 'Place Order'}
                    // </Button>
                    <></>
                )}
            </div>
        </div>
    );
}
