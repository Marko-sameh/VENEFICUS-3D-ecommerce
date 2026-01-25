import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { CustomInput } from '../ui/input';
import LoadingSpinner from '../common/LoadingSpinner';
import { useEffect, useState } from 'react';
import { addAddress, updateAddress } from '@/services/addressService';
import { useToast } from '@/components/ui/use-toast';

export function AddressForm({ address, onSave, onCancel }) {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        company: "",
        address1: "",
        additional_info: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US",
        phone: "",
        isDefault: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (address) {
            setFormData({
                firstName: address.firstName || "",
                lastName: address.lastName || "",
                company: address.company || "",
                address1: address.address1 || address.street || "",
                additional_info: address.additional_info || "",
                city: address.city || "",
                state: address.state || address.region || "",
                postalCode: address.postalCode || address.postal_code || "",
                country: address.country || "US",
                phone: address.phone || "",
                isDefault: address.isDefault || false,
            });
        }
    }, [address]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const userData = localStorage.getItem("veneficus_user_data");
            const user = userData ? JSON.parse(userData) : null;

            if (!user?.id) {
                toast({
                    title: "Error",
                    description: "Please log in to save addresses",
                    variant: "destructive"
                });
                return;
            }

            const addressData = {
                user_id: user.id,
                street: formData.address1,
                region: formData.state,
                city: formData.city,
                country: formData.country,
                phone: formData.phone,
                additional_info: formData.additional_info,
                firstName: formData.firstName,
                lastName: formData.lastName,
                company: formData.company,
                postalCode: formData.postalCode,
                isDefault: formData.isDefault
            };

            let savedAddress;
            if (address?.id) {
                await updateAddress(address.id, addressData);
                savedAddress = {
                    ...address,
                    ...formData,
                    fullName: `${formData.firstName} ${formData.lastName}`.trim(),
                };
                toast({
                    title: "Success",
                    description: "Address updated successfully"
                });
            } else {
                const response = await addAddress(addressData);
                savedAddress = {
                    ...formData,
                    ...response,
                    fullName: `${formData.firstName} ${formData.lastName}`.trim(),
                };
                toast({
                    title: "Success",
                    description: "Address added successfully"
                });
            }

            if (onSave) onSave(savedAddress);
        } catch (error) {
            toast({
                title: "Error",
                description: error?.message || "Failed to save address",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* <div className="space-y-2">
                    <Label htmlFor="firstName" style={{ color: 'var(--text-primary)' }}>
                        First Name
                    </Label>
                    <CustomInput
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
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
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
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
                        value={formData.company}
                        onChange={handleInputChange}
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div> */}

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address1" style={{ color: 'var(--text-primary)' }}>
                        Address Line
                    </Label>
                    <CustomInput
                        id="address1"
                        name="address1"
                        value={formData.address1}
                        onChange={handleInputChange}
                        required
                        placeholder="Street address, P.O. box, company name"
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="additional_info" style={{ color: 'var(--text-primary)' }}>
                        Additional Info (Optional)
                    </Label>
                    <CustomInput
                        id="additional_info"
                        name="additional_info"
                        value={formData.additional_info}
                        onChange={handleInputChange}
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
                        value={formData.city}
                        onChange={handleInputChange}
                        required
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
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter state"
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                {/* <div className="space-y-2">
                    <Label htmlFor="postalCode" style={{ color: 'var(--text-primary)' }}>
                        ZIP Code
                    </Label>
                    <CustomInput
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div> */}

                <div className="space-y-2">
                    <Label htmlFor="country" style={{ color: 'var(--text-primary)' }}>
                        Country
                    </Label>
                    <CustomInput
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter country"
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone" style={{ color: 'var(--text-primary)' }}>
                        Phone
                    </Label>
                    <CustomInput
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                {/* <div className="flex items-start space-x-2 md:col-span-2">
                    <CustomInput
                        id="isDefault"
                        name="isDefault"
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={handleInputChange}
                        className="mt-1"
                        style={{ borderColor: 'var(--border-color)' }}
                    />
                    <div>
                        <Label
                            htmlFor="isDefault"
                            className="font-medium"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Use as default address
                        </Label>
                        <p className="text-sm" style={{ color: 'var(--text-light)' }}>
                            This address will be used for future orders and as your billing address.
                        </p>
                    </div>
                </div> */}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    style={{ borderColor: 'var(--border-color)' }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        backgroundColor: 'var(--main-color)',
                        fontFamily: 'var(--font-body-family)'
                    }}
                >
                    {isSubmitting ? (
                        <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Saving...
                        </>
                    ) : address ? 'Update Address' : 'Add Address'}
                </Button>
            </div>
        </form>
    );
}
