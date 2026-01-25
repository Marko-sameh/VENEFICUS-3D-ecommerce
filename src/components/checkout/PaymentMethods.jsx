import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { PaymentForm } from './PaymentForm';
import { useUserSettings } from '@/hooks/useUserSettings';

export function PaymentMethods({ paymentMethods, selectedMethod, onSelectMethod }) {
    const { 
        paymentForm, 
        setPaymentForm, 
        isAddingPaymentMethod, 
        handleAddPaymentMethod, 
        handleSelectPaymentMethod,
        handleSaveNewPaymentMethod
    } = useUserSettings();

    const memoizedPaymentMethods = useMemo(() => paymentMethods, [paymentMethods]);
    const memoizedSelectedMethod = useMemo(() => selectedMethod, [selectedMethod]);

    if (isAddingPaymentMethod) {
        return (
            <PaymentForm
                paymentMethod={paymentForm}
                onChange={setPaymentForm}
                onSubmit={() => handleSaveNewPaymentMethod(onSelectMethod)}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3
                    className="text-lg font-medium mb-4"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Payment Method
                </h3>

                {memoizedPaymentMethods && memoizedPaymentMethods.length > 0 ? (
                    <div className="space-y-4 mb-4">
                        {memoizedPaymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${memoizedSelectedMethod?.id === method.id
                                    ? 'border-[var(--main-color)] bg-[var(--gray-light)]'
                                    : 'border-[var(--border-color)]'
                                    }`}
                                onClick={() => handleSelectPaymentMethod(method, onSelectMethod)}
                                style={{
                                    borderColor: memoizedSelectedMethod?.id === method.id
                                        ? 'var(--main-color)'
                                        : 'var(--border-color)'
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center">
                                        <div
                                            className="w-8 h-5 rounded bg-gray-200 mr-3"
                                            style={{
                                                backgroundImage: `url(/images/${method.type.toLowerCase()}.svg)`,
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        />
                                        <div>
                                            <h4
                                                className="font-medium"
                                                style={{ color: 'var(--text-primary)' }}
                                            >
                                                {method.type} •••• {method.last4}
                                            </h4>
                                            <p
                                                className="text-sm mt-1"
                                                style={{ color: 'var(--text-light)' }}
                                            >
                                                Expires {method.expiry}
                                            </p>
                                        </div>
                                    </div>

                                    {method.isDefault && (
                                        <span
                                            className="text-xs px-2 py-1 rounded-full"
                                            style={{
                                                backgroundColor: 'var(--main-color-light)',
                                                color: 'var(--text-primary)'
                                            }}
                                        >
                                            Default
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p
                        className="text-[var(--text-light)] mb-4"
                        style={{ fontFamily: 'var(--font-body-family)' }}
                    >
                        You haven't added any payment methods yet.
                    </p>
                )}

                <Button
                    variant="outline"
                    onClick={handleAddPaymentMethod}
                    style={{ borderColor: 'var(--border-color)' }}
                >
                    Add New Payment Method
                </Button>
            </div>

            <div>
                <h3
                    className="text-lg font-medium mb-4"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Secure Payment
                </h3>

                <div className="p-4 bg-[var(--gray-light)] rounded-lg">
                    <div className="flex items-center mb-2">
                        <svg
                            className="w-5 h-5 mr-2 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                        <span style={{ color: 'var(--text-primary)' }}>
                            Secure SSL Encryption
                        </span>
                    </div>
                    <p
                        className="text-sm"
                        style={{ color: 'var(--text-light)' }}
                    >
                        Your payment information is securely processed with 256-bit SSL encryption. We never store your full credit card number.
                    </p>
                </div>
            </div>
        </div>
    );
}