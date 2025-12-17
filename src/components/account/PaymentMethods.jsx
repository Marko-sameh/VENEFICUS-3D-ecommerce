import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCardForm } from './CreditCardForm';
import { useUserSettings } from '@/hooks/useUserSettings';

export function PaymentMethods({ paymentMethods: initialPaymentMethods, onPaymentMethodUpdate }) {
    const {
        paymentMethods,
        setPaymentMethods,
        isAddingPaymentMethod,
        handleAddPaymentMethod,
        handleRemovePaymentMethod,
        handleSetDefaultPaymentMethod,
        handleSavePaymentMethod
    } = useUserSettings();

    const memoizedPaymentMethods = useMemo(() => paymentMethods, [paymentMethods]);

    useEffect(() => {
        if (initialPaymentMethods) {
            setPaymentMethods(initialPaymentMethods);
        }
    }, [initialPaymentMethods, setPaymentMethods]);

    if (isAddingPaymentMethod) {
        return (
            <CreditCardForm
                onSave={(paymentMethod) => handleSavePaymentMethod(paymentMethod, onPaymentMethodUpdate)}
                onCancel={() => setPaymentMethods(memoizedPaymentMethods)}
            />
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle
                    className="text-lg"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Payment Methods
                </CardTitle>
                <Button
                    onClick={handleAddPaymentMethod}
                    style={{ backgroundColor: 'var(--main-color)' }}
                >
                    Add Payment Method
                </Button>
            </CardHeader>

            <CardContent>
                {!memoizedPaymentMethods || memoizedPaymentMethods.length === 0 ? (
                    <div className="text-center py-8">
                        <p
                            className="mb-4"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            You haven't added any payment methods yet.
                        </p>
                        <Button
                            onClick={handleAddPaymentMethod}
                            style={{ backgroundColor: 'var(--main-color)' }}
                        >
                            Add Your First Payment Method
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {(memoizedPaymentMethods || []).map(method => (
                            <div
                                key={method.id}
                                className="p-4 border rounded-lg relative"
                                style={{
                                    borderColor: 'var(--border-color)',
                                    backgroundColor: method.isDefault ? 'var(--gray-light)' : 'var(--background)'
                                }}
                            >
                                {method.isDefault && (
                                    <span
                                        className="absolute top-2 right-2 px-2 py-1 text-xs rounded-full"
                                        style={{
                                            backgroundColor: 'var(--main-color-light)',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        Default
                                    </span>
                                )}

                                <div className="flex justify-between items-start">
                                    <div className="flex items-center">
                                        <div
                                            className="w-8 h-5 rounded bg-gray-200 mr-3"
                                            style={{
                                                backgroundImage: method.icon && /^https?:\/\//.test(method.icon) ? `url(${method.icon})` : 'none',
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat'
                                            }}
                                        />
                                        <div>
                                            <h3
                                                className="font-medium"
                                                style={{ color: 'var(--text-primary)' }}
                                            >
                                                {method.type} •••• {method.last4}
                                            </h3>
                                            <p
                                                className="text-sm mt-1"
                                                style={{ color: 'var(--text-light)' }}
                                            >
                                                Expires {method.expiry || `${method.expiryMonth}/${method.expiryYear}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSetDefaultPaymentMethod(method.id, onPaymentMethodUpdate)}
                                            disabled={method.isDefault}
                                            style={{ borderColor: 'var(--border-color)' }}
                                        >
                                            {method.isDefault ? 'Default' : 'Set Default'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRemovePaymentMethod(method.id, onPaymentMethodUpdate)}
                                            style={{ borderColor: 'var(--border-color)' }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}