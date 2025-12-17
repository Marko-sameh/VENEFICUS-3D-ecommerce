'use client';

import { useUnifiedCartStore } from '@/store/unifiedCartStore';
import { ShoppingBag } from 'lucide-react';

export function CartIndicator({ className = '' }) {
    const { itemCount, toggleDrawer } = useUnifiedCartStore();

    return (
        <button
            onClick={toggleDrawer}
            className={`relative p-2 text-[var(--text-primary)] hover:text-[var(--main-color)] transition-colors ${className}`}
            aria-label={`Shopping cart with ${itemCount} items`}
        >
            <ShoppingBag className="w-6 h-6" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--main-color)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </button>
    );
}