"use client";
import { useMemo } from 'react';
import { AddressForm } from './AddressForm';
import { useUserSettings } from '@/hooks/useUserSettings';

export function BillingForm({ address, onChange, onSubmit, isSubmitting, useShippingAddress }) {
    const { handleBillingUseShippingAddress } = useUserSettings();
    const handleUseShippingAddress = useMemo(() => 
        handleBillingUseShippingAddress(onChange), 
        [handleBillingUseShippingAddress, onChange]
    );

    return (
        <AddressForm
            address={address}
            onChange={onChange}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            type="billing"
            showUseShippingOption={true}
            useShippingAddress={useShippingAddress}
            onUseShippingAddressChange={handleUseShippingAddress}
        />
    );
}