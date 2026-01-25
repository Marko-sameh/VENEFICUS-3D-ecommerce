"use client";
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { CustomInput } from '@/components/ui/input';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/components/ui/use-toast';

export function AccountSettings({ user }) {
    const { settings, isSubmitting, handleSubmit, handleSelectChange, handleToggle } = useUserSettings();
    const { updateProfile } = useUserStore();
    const { toast } = useToast();

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const profileData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone')
        };

        try {
            await updateProfile(profileData);
            toast({
                title: "Success",
                description: "Profile updated successfully"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-8">
            {/* Profile Information */}
            <form onSubmit={handleProfileUpdate} className="space-y-6">
                <h2
                    className="text-xl font-semibold mb-4"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Profile Information
                </h2>

                <div className="space-y-4 bg-[var(--card-bg)] p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" style={{ color: 'var(--text-primary)' }}>
                                Full Name
                            </Label>
                            <CustomInput
                                id="name"
                                name="name"
                                defaultValue={user?.name || ''}
                                required
                                style={{
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" style={{ color: 'var(--text-primary)' }}>
                                Email Address
                            </Label>
                            <CustomInput
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={user?.email || ''}
                                required
                                style={{
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" style={{ color: 'var(--text-primary)' }}>
                                Phone Number
                            </Label>
                            <CustomInput
                                id="phone"
                                name="phone"
                                type="tel"
                                defaultValue={user?.phone || ''}
                                style={{
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            style={{
                                backgroundColor: 'var(--main-color)',
                                fontFamily: 'var(--font-body-family)'
                            }}
                        >
                            Update Profile
                        </Button>
                    </div>
                </div>
            </form>


        </div>
    );
}