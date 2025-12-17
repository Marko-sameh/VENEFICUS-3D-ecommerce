/**
 * CartItems component - Displays list of cart items
 * Uses unified cart system for optimal performance
 */

'use client';

import { memo } from 'react';
import { useUnifiedCartStore } from '@/store/unifiedCartStore';
import { CartItem } from './CartItem';

export const CartItems = memo(function CartItems({ isDrawer = false }) {
  const { items, itemCount } = useUnifiedCartStore();
  const isEmpty = items.length === 0;

  // Add keys to items for React rendering
  const itemsWithKeys = items.map((item, index) => ({
    ...item,
    key: `cart-${item.id}-${item.product_id}-${item.color_id}-${item.size_id}-${index}`
  }));

  if (isEmpty) {
    return (
      <div className="text-center py-8">
        <p className="text-[var(--text-secondary)]">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {itemsWithKeys.map((item) => (
        <CartItem
          key={item.key}
          item={item}
          isDrawer={isDrawer}
        />
      ))}
    </div>
  );
});