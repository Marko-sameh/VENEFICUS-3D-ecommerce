// import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LazyImage from '@/components/common/LazyImage';
import { useUserStore } from '@/store/userStore';

export function UserProfile({ loyaltyPoints }) {
    const { user, logout } = useUserStore();

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };
    return (
        <Card className="overflow-hidden">
            <div className="h-32 bg-[var(--main-color-light)]" />
            <CardHeader className="pt-0 pb-4">
                <div className="flex items-end -mt-12 mb-4">
                    {user?.avatar && (
                        <LazyImage
                            src={user.avatar}
                            alt={user.name}
                            width={80}
                            height={80}
                            className="rounded-full border-4 border-[var(--background)]"
                        />
                    )}
                    <div className="ml-4">
                        <CardTitle className="text-2xl" style={{ color: 'var(--text-primary)' }}>
                            {user.name}
                        </CardTitle>
                        {user.loyaltyLevel && (
                            <div className="flex items-center mt-1">
                                {/* <StarRating rating={4.5} size="sm" /> */}
                                <span
                                    className="ml-2 text-sm"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    {user.loyaltyLevel} Member
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between mt-2">
                    <Button variant="outline" size="sm" disabled>
                        Google Account
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        Sign Out
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3
                            className="text-lg font-semibold mb-3"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Contact Information
                        </h3>
                        <div className="space-y-2">
                            <p style={{ color: 'var(--text-secondary)' }}>
                                <span className="font-medium">Email:</span> {user.email}
                            </p>
                            {user.phone && (
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    <span className="font-medium">Phone:</span> {user.phone}
                                </p>
                            )}
                            <p className="text-sm text-[var(--text-light)]">
                                Signed in with Google
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card >
    );
}