import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ShippingForm } from './ShippingForm';
import { BillingForm } from './BillingForm';
import { useUserSettings } from '@/hooks/useUserSettings';
import { getAddresses } from '@/services/addressService';

export function AddressSelector({
    shippingAddress,
    onShippingAddressChange,
    billingAddress,
    onBillingAddressChange,
}) {
    const {
        addresses,
        setAddresses,
        addressSelector,
        handleSelectShippingAddress,
        handleSelectBillingAddress,
        handleUseShippingAddress,
        setIsAddingShipping,
        setIsAddingBilling, getuser
    } = useUserSettings();
    
    const [refreshKey, setRefreshKey] = useState(0);
    const userdata = getuser();
    
    const fetchAndNormalizeAddresses = async () => {
        try {
            const fetchedAddresses = await getAddresses();
            const normalized = fetchedAddresses.map(addr => ({
                id: addr.id,
                firstName: addr.first_name || addr.firstName || '',
                lastName: addr.last_name || addr.lastName || '',
                fullName: addr.full_name || addr.fullName || `${addr.first_name || addr.firstName || ''} ${addr.last_name || addr.lastName || ''}`.trim(),
                company: addr.company || '',
                address1: addr.street || addr.address1 || '',
                address2: addr.additional_info || addr.address2 || '',
                city: addr.city || '',
                state: addr.region || addr.state || '',
                postalCode: addr.postal_code || addr.postalCode || '',
                country: addr.country || '',
                phone: addr.phone || '',
                isDefault: addr.is_default || addr.isDefault || false
            }));
            setAddresses(normalized);
        } catch (error) {
            setAddresses([]);
        }
    };
    
    useEffect(() => {
        fetchAndNormalizeAddresses();
    }, [refreshKey, setAddresses]);

    const { isAddingShipping, isAddingBilling, useShippingAddress } = addressSelector;

    const handleShippingSubmit = () => {
        setIsAddingShipping(false);
        setRefreshKey(prev => prev + 1);
    };

    const handleBillingSubmit = () => {
        setIsAddingBilling(false);
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="space-y-6">
            {/* Shipping Address Section */}
            <div>
                <h3
                    className="text-lg font-medium mb-4"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Shipping Address
                </h3>

                {isAddingShipping ? (
                    <ShippingForm
                        address={shippingAddress || {}}
                        onChange={onShippingAddressChange}
                        onSubmit={handleShippingSubmit}
                    />
                ) : (
                    <div>
                        {addresses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${shippingAddress?.id === address?.id
                                            ? 'border-[var(--main-color)] bg-[var(--gray-light)]'
                                            : 'border-[var(--border-color)]'
                                            }`}
                                        onClick={() => {
                                            try {
                                                handleSelectShippingAddress(address, onShippingAddressChange, onBillingAddressChange);
                                            } catch (error) {
                                                
                                            }
                                        }}
                                        style={{
                                            borderColor: shippingAddress?.id === address.id
                                                ? 'var(--main-color)'
                                                : 'var(--border-color)'
                                        }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4
                                                    className="font-medium"
                                                    style={{ color: 'var(--text-primary)' }}
                                                >
                                                    {address.fullName || `${address.firstName} ${address.lastName}`}
                                                </h4>
                                                <p
                                                    className="text-sm mt-1"
                                                    style={{ color: 'var(--text-light)' }}
                                                >
                                                    {address.address1}
                                                    {address.address2 && <><br />{address.address2}</>}
                                                    <br />
                                                    {address.city}, {address.state} {address.postalCode}
                                                    <br />
                                                    {address.country}
                                                    <br />
                                                    {address.phone}
                                                </p>
                                            </div>
                                            {address.isDefault && (
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
                                You haven't saved any addresses yet.
                            </p>
                        )}

                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setIsAddingShipping(true)}
                                style={{ borderColor: 'var(--border-color)' }}
                            >
                                Add New Address
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Billing Address Section */}
            <div>
                <h3
                    className="text-lg font-medium mb-4"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Billing Address
                </h3>

                <div className="flex items-center mb-4">
                    <input
                        id="useShippingAddress"
                        type="checkbox"
                        checked={useShippingAddress}
                        onChange={(e) => handleUseShippingAddress(e.target.checked, shippingAddress, onBillingAddressChange)}
                        className="mr-2"
                        style={{ borderColor: 'var(--border-color)' }}
                    />
                    <label
                        htmlFor="useShippingAddress"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Use shipping address as billing address
                    </label>
                </div>

                {!useShippingAddress && (
                    isAddingBilling ? (
                        <BillingForm
                            address={billingAddress || {}}
                            onChange={onBillingAddressChange}
                            onSubmit={handleBillingSubmit}
                            useShippingAddress={useShippingAddress}
                        />
                    ) : (
                        <div>
                            {addresses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {addresses.map((address) => (
                                        <div
                                            key={address.id}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all ${billingAddress?.id === address.id
                                                ? 'border-[var(--main-color)] bg-[var(--gray-light)]'
                                                : 'border-[var(--border-color)]'
                                                }`}
                                            onClick={() => handleSelectBillingAddress(address, onBillingAddressChange)}
                                            style={{
                                                borderColor: billingAddress?.id === address.id
                                                    ? 'var(--main-color)'
                                                    : 'var(--border-color)'
                                            }}
                                        >
                                            <div>
                                                <h4
                                                    className="font-medium"
                                                    style={{ color: 'var(--text-primary)' }}
                                                >
                                                    {address.fullName || `${address.firstName} ${address.lastName}`}
                                                </h4>
                                                <p
                                                    className="text-sm mt-1"
                                                    style={{ color: 'var(--text-light)' }}
                                                >
                                                    {address.address1}
                                                    {address.address2 && <><br />{address.address2}</>}
                                                    <br />
                                                    {address.city}, {address.state} {address.postalCode}
                                                    <br />
                                                    {address.country}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p
                                    className="text-[var(--text-light)] mb-4"
                                    style={{ fontFamily: 'var(--font-body-family)' }}
                                >
                                    You haven't saved any addresses yet.
                                </p>
                            )}

                            <Button
                                variant="outline"
                                onClick={() => setIsAddingBilling(true)}
                                style={{ borderColor: 'var(--border-color)' }}
                            >
                                Add New Address
                            </Button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
