'use client';

import { useUnifiedCartStore } from '@/store/unifiedCartStore';

export function CartDebug() {
    const { items, itemCount, total, isVisible } = useUnifiedCartStore();

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-sm z-50 max-w-xs">
            <h3 className="font-bold mb-2">Cart Debug</h3>
            <div>Items: {itemCount}</div>
            <div>Total: ${total}</div>
            <div>Visible: {isVisible ? 'Yes' : 'No'}</div>
            <div>Cart Items:</div>
            <ul className="text-xs">
                {items.map((item, index) => (
                    <li key={index}>
                        {item.product?.name || item.name} - Qty: {item.quantity} - ${item.piece_price || item.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}