
"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { CustomInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserSettings } from "@/hooks/useUserSettings";
import LoadingSpinner from "../common/LoadingSpinner";

export function ProfileForm({ user, onUpdate }) {
    const {
        profileForm,
        initializeProfileForm,
        handleProfileFormChange,
        handleProfileFormSubmit,
        isSubmittingProfile
    } = useUserSettings();

    useEffect(() => {
        initializeProfileForm(user);
    }, [user, initializeProfileForm]);

    return (
        <form
            onSubmit={(e) => handleProfileFormSubmit(e, onUpdate)}
            className="space-y-8 bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)]"
        >
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <CustomInput
                    label="Full Name"
                    id="name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileFormChange}
                    required
                />

                {/* Email */}
                <div>
                    <CustomInput
                        label="Email Address"
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileFormChange}
                        required
                        disabled={user?.isSocialLogin}
                    />
                    {user?.isSocialLogin && (
                        <p className="text-xs italic mt-1" style={{ color: "var(--text-light)" }}>
                            Email cannot be changed for social login accounts.
                        </p>
                    )}
                </div>
            </div>


            {/* Newsletter */}
            <div className="flex items-start space-x-3 bg-[var(--gray-light)] p-3 rounded-lg">
                <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    checked={profileForm.newsletter}
                    onChange={handleProfileFormChange}
                    className="mt-1 w-4 h-4 border border-[var(--border-color)] rounded-sm text-[var(--main-color)] focus:ring-[var(--main-color)]"
                />
                <div>
                    <Label htmlFor="newsletter" style={{ color: "var(--text-primary)" }}>
                        Subscribe to Newsletter
                    </Label>
                    <p className="text-sm" style={{ color: "var(--text-light)" }}>
                        Get updates about new products, special offers, and more.
                    </p>
                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isSubmittingProfile}
                    className="px-6 py-2 rounded-lg font-medium shadow-sm"
                    style={{
                        backgroundColor: "var(--main-color)",
                        color: "var(--text-white)",
                    }}
                >
                    {isSubmittingProfile ? (
                        <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </div>
        </form>
    );
}
