'use client';

import { memo } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useUnifiedCartStore } from '@/store/unifiedCartStore';

/**
 * Optimized CartCounter component - Shows cart item count
 * Uses selective subscription to prevent unnecessary re-renders
 */
export const CartCounter = memo(function CartCounter() {
    const { itemCount, toggleDrawer } = useUnifiedCartStore();

    return (
        <div className="relative" aria-live="polite">
            <button
                onClick={toggleDrawer}
                className="h-8 w-8 flex items-center justify-center cursor-pointer"
                aria-label={`Open cart (${itemCount} items)`}
            >
                <ShoppingCart className="h-6 w-6" aria-hidden="true" />
                {itemCount > 0 && (
                    <span
                        className="absolute -top-2 -right-2 bg-[var(--main-color)] text-[var(--text-white)] text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md transition-all duration-300"
                        style={{
                            fontFamily: 'var(--font-body-family)'
                        }}
                        aria-hidden="true"
                    >
                        {itemCount > 99 ? '99+' : itemCount}
                    </span>
                )}
            </button>
        </div>
    );
});