'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

/**
 * User Provider component that initializes authentication on app load
 */
export function UserProvider({ children }) {
    const { initializeAuth } = useUserStore();

    useEffect(() => {
        // Initialize authentication state on app load
        initializeAuth();
    }, [initializeAuth]);

    return children;
}