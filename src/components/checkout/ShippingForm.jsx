import { useState } from 'react';
import { AddressForm } from './AddressForm';
import { addAddress } from '@/services/addressService';
import { useToast } from '@/components/ui/use-toast';
import { useUserStore } from '@/store/userStore';

export function ShippingForm({ address, onChange, onSubmit, isSubmitting }) {
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();
    const { setAddresses, addresses } = useUserStore();

    const handleSave = async () => {
        if (!address.address1 && !address.street) {
            toast({
                title: "Error",
                description: "Please fill in street address",
                variant: "destructive"
            });
            return;
        }
        if (!address.city) {
            toast({
                title: "Error",
                description: "Please fill in city",
                variant: "destructive"
            });
            return;
        }
        const country = address.country || 'US';
        if (!country) {
            toast({
                title: "Error",
                description: "Please fill in country",
                variant: "destructive"
            });
            return;
        }

        setSaving(true);
        try {
            const addressData = {
                user_id: "1",
                street: address.address1,
                region: address.state || address.region,
                city: address.city,
                country: country,
                phone: address.phone,
                additional_info: address.address2 || address.additional_info,
                firstName: address.firstName,
                lastName: address.lastName,
                company: address.company,
                postalCode: address.postalCode,
                isDefault: address.isDefault
            };

            await addAddress(addressData);
            
            toast({
                title: "Success",
                description: "Shipping address saved successfully"
            });
            
            if (onSubmit) onSubmit();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save address. Please try again.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <AddressForm
            address={address}
            onChange={onChange}
            onSubmit={handleSave}
            isSubmitting={saving || isSubmitting}
            type="shipping"
        />
    );
}
