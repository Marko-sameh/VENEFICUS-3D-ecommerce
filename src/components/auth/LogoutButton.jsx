'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

/**
 * Logout Button Component
 * Handles Google OAuth logout
 */
export const LogoutButton = ({ 
    className = '',
    children = 'Sign Out',
    variant = 'outline'
}) => {
    const { logout, isLoading } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <Button
            onClick={handleLogout}
            disabled={isLoading}
            variant={variant}
            className={className}
            style={{
                fontFamily: 'var(--font-body-family)',
                borderColor: 'var(--border-color)'
            }}
        >
            {isLoading ? 'Signing out...' : children}
        </Button>
    );
};