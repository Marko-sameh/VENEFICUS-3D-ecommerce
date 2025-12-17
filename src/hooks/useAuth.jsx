'use client';

import { useUserStore } from '@/store/userStore';

/**
 * Authentication hook that uses the unified user store
 * @deprecated Use useUserStore directly instead
 */
export const useAuth = () => {
    const { 
        isAuthenticated, 
        isLoading, 
        logout, 
        token,
        user,
        initializeAuth 
    } = useUserStore();

    const refreshAuth = () => {
        initializeAuth();
    };

    const getToken = () => token;

    return {
        isAuthenticated,
        isLoading,
        logout,
        refreshAuth,
        getToken,
        user
    };
};