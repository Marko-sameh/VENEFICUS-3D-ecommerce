import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { CustomInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { useUserSettings } from '@/hooks/useUserSettings';

export function PaymentForm({ paymentMethod, onChange, onSubmit, isSubmitting }) {
    const { 
        paymentForm, 
        setPaymentForm, 
        handlePaymentFormChange, 
        handlePaymentFormSubmit, 
        getCardType 
    } = useUserSettings();

    useEffect(() => {
        setPaymentForm({
            cardNumber: paymentMethod?.cardNumber || '',
            expiry: paymentMethod?.expiry || '',
            cvv: paymentMethod?.cvv || '',
            name: paymentMethod?.name || ''
        });
    }, [paymentMethod, setPaymentForm]);

    const cardType = getCardType(paymentForm.cardNumber);

    return (
        <form onSubmit={handlePaymentFormSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle
                        className="text-lg"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Payment Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" style={{ color: 'var(--text-primary)' }}>
                            Name on Card
                        </Label>
                        <CustomInput
                            id="name"
                            name="name"
                            value={paymentForm.name}
                            onChange={(e) => handlePaymentFormChange(onChange)('name', e.target.value)}
                            required
                            style={{
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cardNumber" style={{ color: 'var(--text-primary)' }}>
                            Card Number
                        </Label>
                        <div className="relative">
                            <CustomInput
                                id="cardNumber"
                                name="cardNumber"
                                value={paymentForm.cardNumber}
                                onChange={(e) => handlePaymentFormChange(onChange)('cardNumber', e.target.value)}
                                required
                                maxLength={19}
                                style={{
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)'
                                }}
                                className="pr-12"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {cardType ? (
                                    <div
                                        className="w-8 h-5 bg-gray-200"
                                        style={{
                                            backgroundImage: `url(/images/${cardType.toLowerCase()}.svg)`,
                                            backgroundSize: 'contain',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                    />
                                ) : (
                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiry" style={{ color: 'var(--text-primary)' }}>
                                Expiration Date
                            </Label>
                            <CustomInput
                                id="expiry"
                                name="expiry"
                                value={paymentForm.expiry}
                                onChange={(e) => handlePaymentFormChange(onChange)('expiry', e.target.value)}
                                placeholder="MM/YY"
                                required
                                maxLength={5}
                                style={{
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cvv" style={{ color: 'var(--text-primary)' }}>
                                CVV
                            </Label>
                            <CustomInput
                                id="cvv"
                                name="cvv"
                                type="password"
                                value={paymentForm.cvv}
                                onChange={(e) => handlePaymentFormChange(onChange)('cvv', e.target.value)}
                                placeholder="123"
                                required
                                style={{
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-start space-x-2">
                        <CustomInput
                            id="savePaymentMethod"
                            name="savePaymentMethod"
                            type="checkbox"
                            checked={paymentMethod?.save || false}
                            onChange={(e) => onChange({ ...paymentMethod, save: e.target.checked })}
                            className="mt-1"
                            style={{ borderColor: 'var(--border-color)' }}
                        />
                        <div>
                            <Label
                                htmlFor="savePaymentMethod"
                                className="font-medium"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                Save this payment method for future purchases
                            </Label>
                            <p className="text-sm" style={{ color: 'var(--text-light)' }}>
                                Your card details will be securely stored for faster checkout.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        backgroundColor: 'var(--main-color)',
                        fontFamily: 'var(--font-body-family)'
                    }}
                >
                    {isSubmitting ? 'Processing...' : 'Save Payment Method'}
                </Button>
            </div>
        </form>
    );
}