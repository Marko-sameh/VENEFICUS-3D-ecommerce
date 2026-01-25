"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/store/userStore";
import { AddressForm } from "./AddressForm";
import { useUserSettings } from "@/hooks/useUserSettings";

export default function AddressBook({ initialAddresses }) {
    const { addresses, setAddresses } = useUserStore();
    const { handleSetDefault, handleDelete } = useUserSettings();
    const [isAdding, setIsAdding] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    console.log(addresses);
    const handleAddAddress = () => {
        setEditingAddress(null);
        setIsAdding(true);
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setIsAdding(true);
    };

    const handleSaveAddress = (savedAddress) => {
        if (editingAddress) {
            const updatedAddresses = addresses.map(addr =>
                addr.id === editingAddress.id ? savedAddress : addr
            );
            setAddresses(updatedAddresses);
        } else {
            setAddresses([...addresses, savedAddress]);
        }
        setIsAdding(false);
        setEditingAddress(null);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingAddress(null);
    };

    const handleDeleteConfirm = async (id) => {
        try {
            await handleDelete(id);
            setDeletingId(null);
        } catch (error) {
            setDeletingId(null);
        }
    };

    if (isAdding) {
        return (
            <Card className="bg-[var(--card-bg)]">
                <CardHeader>
                    <CardTitle style={{ color: 'var(--text-primary)' }}>
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AddressForm
                        address={editingAddress}
                        onSave={handleSaveAddress}
                        onCancel={handleCancel}
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Saved Addresses
                </h2>
                <Button
                    onClick={handleAddAddress}
                    style={{ backgroundColor: 'var(--main-color)' }}
                >
                    Add New Address
                </Button>
            </div>

            <div className="grid gap-4">
                {addresses.map((address) => (

                    <Card key={address.id} className="bg-[var(--card-bg)]">
                        {console.log(address.id)}
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                            {address.fullName || `${address.firstName || ''} ${address.lastName || ''}`.trim()}
                                        </p>
                                        {address.isDefault && (
                                            <span
                                                className="px-2 py-1 text-xs rounded-full"
                                                style={{
                                                    backgroundColor: 'var(--main-color)',
                                                    color: 'var(--text-white)'
                                                }}
                                            >
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[var(--text-secondary)] mb-2">
                                        {address.address1 || address.street}
                                        {(address.additional_info) && <><br />{address.additional_info}</>}
                                        <br />
                                        {address.city}, {address.state || address.region} {address.postalCode}
                                        <br />
                                        {address.country}
                                        {address.phone && <><br />{address.phone}</>}
                                    </p>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditAddress(address)}
                                        style={{ borderColor: 'var(--border-color)' }}
                                    >
                                        Edit
                                    </Button>
                                    {/* {!address.isDefault && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleSetDefault(address.id)}
                                            style={{ borderColor: 'var(--border-color)' }}
                                        >
                                            Set Default
                                        </Button>
                                    )} */}
                                    {deletingId === address.id ? (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteConfirm(address.id)}
                                            >
                                                Confirm
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setDeletingId(null)}
                                                style={{ borderColor: 'var(--border-color)' }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => setDeletingId(address.id)}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {addresses.length === 0 && (
                    <Card className="bg-[var(--card-bg)]">
                        <CardContent className="p-8 text-center">
                            <p className="text-[var(--text-secondary)] mb-4">
                                No addresses saved yet.
                            </p>
                            <Button
                                onClick={handleAddAddress}
                                style={{ backgroundColor: 'var(--main-color)' }}
                            >
                                Add Your First Address
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
