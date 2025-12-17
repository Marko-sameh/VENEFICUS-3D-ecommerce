'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserSettings } from '@/hooks/useUserSettings';

export function CreditCardForm({ onSave, onCancel, initialData = {} }) {
    const { 
        creditCardForm, 
        handleCreditCardFormChange, 
        handleCreditCardFormSubmit, 
        initializeCreditCardForm 
    } = useUserSettings();

    useEffect(() => {
        initializeCreditCardForm(initialData);
    }, [initialData, initializeCreditCardForm]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => handleCreditCardFormSubmit(e, onSave)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Cardholder Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={creditCardForm.name}
                            onChange={handleCreditCardFormChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Card Number
                        </label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={creditCardForm.cardNumber}
                            onChange={handleCreditCardFormChange}
                            className="w-full p-2 border rounded"
                            placeholder="1234 5678 9012 3456"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Expiry Date
                            </label>
                            <input
                                type="text"
                                name="expiry"
                                value={creditCardForm.expiry}
                                onChange={handleCreditCardFormChange}
                                className="w-full p-2 border rounded"
                                placeholder="MM/YY"
                                maxLength="5"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                CVV
                            </label>
                            <input
                                type="text"
                                name="cvv"
                                value={creditCardForm.cvv}
                                onChange={handleCreditCardFormChange}
                                className="w-full p-2 border rounded"
                                placeholder="123"
                                maxLength="4"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-4">
                        <Button type="submit" className="flex-1">
                            Save Payment Method
                        </Button>
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}