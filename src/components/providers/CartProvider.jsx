'use client';

import { useEffect } from 'react';
import { useUnifiedCartStore } from '@/store/unifiedCartStore';
import { useUserStore } from '@/store/userStore';

export function CartProvider({ children }) {
    const init = useUnifiedCartStore(state => state.init);
    const { initializeAuth } = useUserStore();

    useEffect(() => {
        // Initialize auth first, then cart
        initializeAuth();
        init();
    }, [init, initializeAuth]);

    return children;
}