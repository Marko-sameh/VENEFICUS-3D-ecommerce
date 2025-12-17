import { useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { CustomInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { US_STATES } from '@/lib/constants';
import { useUserSettings } from '@/hooks/useUserSettings';

export function AddressForm({
    address,
    onChange,
    onSubmit,
    isSubmitting,
    type = 'shipping',
    showUseShippingOption = false,
    useShippingAddress = false,
    onUseShippingAddressChange
}) {
    const { handleUseShippingAddressForm } = useUserSettings();

    const handleChange = useCallback((e) => {
        if (!e?.target) return;
        const { name, value, type, checked } = e.target;
        if (!name) return;
        const newValue = type === "checkbox" ? checked : value;
        if (typeof onChange === 'function') {
            onChange({ ...address, [name]: newValue });
        }
    }, [onChange, address]);

    const handleSelectChange = useCallback((name, value) => {
        if (typeof onChange === 'function') {
            onChange({ ...address, [name]: value });
        }
    }, [onChange, address]);

    const handleSubmit = (e) => {
        e?.preventDefault?.();
        if (typeof onSubmit === 'function') {
            onSubmit();
        }
    };
    const handleUseShippingAddress = handleUseShippingAddressForm(onUseShippingAddressChange);

    if (type === 'billing' && useShippingAddress) {
        return (
            <div className="bg-[var(--gray-light)] p-4 rounded-lg">
                <div className="flex items-center">
                    <Checkbox
                        id="useShippingAddress"
                        checked={useShippingAddress}
                        onCheckedChange={handleUseShippingAddress}
                    />
                    <Label
                        htmlFor="useShippingAddress"
                        className="ml-2 font-medium"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Use shipping address as billing address
                    </Label>
                </div>
                <p
                    className="text-sm mt-2"
                    style={{ color: 'var(--text-light)' }}
                >
                    Your billing address will be the same as your shipping address.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {showUseShippingOption && (
                <div className="flex items-center mb-4">
                    <Checkbox
                        id="useShippingAddress"
                        checked={useShippingAddress}
                        onCheckedChange={handleUseShippingAddress}
                    />
                    <Label
                        htmlFor="useShippingAddress"
                        className="ml-2 font-medium"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Use shipping address as billing address
                    </Label>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="firstName" style={{ color: 'var(--text-primary)' }}>
                        First Name
                    </Label>
                    <CustomInput
                        id="firstName"
                        name="firstName"
                        value={address.firstName || ''}
                        onChange={handleChange}
                        required
                        disabled={false}
                        readOnly={false}
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName" style={{ color: 'var(--text-primary)' }}>
                        Last Name
                    </Label>
                    <CustomInput
                        id="lastName"
                        name="lastName"
                        value={address.lastName || ''}
                        onChange={handleChange}
                        required
                        disabled={false}
                        readOnly={false}
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="company" style={{ color: 'var(--text-primary)' }}>
                        Company (Optional)
                    </Label>
                    <CustomInput
                        id="company"
                        name="company"
                        value={address.company || ''}
                        onChange={handleChange}
                        disabled={false}
                        readOnly={false}
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address1" style={{ color: 'var(--text-primary)' }}>
                        Address Line 1
                    </Label>
                    <CustomInput
                        id="address1"
                        name="address1"
                        value={address.address1 || ''}
                        onChange={handleChange}
                        required
                        disabled={false}
                        readOnly={false}
                        placeholder="Street address, P.O. box, company name"
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address2" style={{ color: 'var(--text-primary)' }}>
                        Address Line 2 (Optional)
                    </Label>
                    <CustomInput
                        id="address2"
                        name="address2"
                        value={address.address2 || ''}
                        onChange={handleChange}
                        disabled={false}
                        readOnly={false}
                        placeholder="Apartment, suite, unit, building, floor, etc."
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="city" style={{ color: 'var(--text-primary)' }}>
                        City
                    </Label>
                    <CustomInput
                        id="city"
                        name="city"
                        value={address.city || ''}
                        onChange={handleChange}
                        required
                        disabled={false}
                        readOnly={false}
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="state" style={{ color: 'var(--text-primary)' }}>
                        State
                    </Label>
                    <CustomInput
                        id="state"
                        name="state"
                        value={address.state || ''}
                        onChange={handleChange}
                        required
                        disabled={false}
                        readOnly={false}
                        placeholder="Enter state"
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="postalCode" style={{ color: 'var(--text-primary)' }}>
                        ZIP Code
                    </Label>
                    <CustomInput
                        id="postalCode"
                        name="postalCode"
                        value={address.postalCode || ''}
                        onChange={handleChange}
                        required
                        disabled={false}
                        readOnly={false}
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="country" style={{ color: 'var(--text-primary)' }}>
                        Country
                    </Label>
                    <CustomInput
                        id="country"
                        name="country"
                        value={address.country || ''}
                        onChange={handleChange}
                        required
                        disabled={false}
                        readOnly={false}
                        placeholder="Enter country"
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                {type === 'shipping' && (
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="phone" style={{ color: 'var(--text-primary)' }}>
                            Phone
                        </Label>
                        <CustomInput
                            id="phone"
                            name="phone"
                            value={address.phone || ''}
                            onChange={handleChange}
                            required
                            disabled={false}
                            readOnly={false}
                            style={{
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        backgroundColor: 'var(--main-color)',
                        fontFamily: 'var(--font-body-family)'
                    }}
                >
                    {isSubmitting ? 'Saving...' : `Save ${type === 'billing' ? 'Billing' : 'Shipping'} Address`}
                </Button>
            </div>
        </form>
    );
}