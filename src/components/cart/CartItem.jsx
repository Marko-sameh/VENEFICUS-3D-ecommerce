// 'use client';

// import Image from 'next/image';
// import { Trash2, Minus, Plus } from 'lucide-react';
// import { useState } from 'react';
// import { updateCartItem, removeItem } from '@/services/cartService';

// /**
//  * CartItem component - Individual item in the cart
//  * Implements proper product schema for SEO
//  * Follows VENEFICUS design system
//  */
// export function CartItem({ item, isDrawer = false, onUpdate, onRemove }) {
//     const [quantity, setQuantity] = useState(item.quantity);
//     const [isUpdating, setIsUpdating] = useState(false);
//     const [error, setError] = useState(null);

//     const handleQuantityChange = async (newQuantity) => {
//         if (newQuantity < 1) return;

//         setIsUpdating(true);
//         setError(null);

//         try {
//             await updateCartItem(item.id, newQuantity);
//             setQuantity(newQuantity);
//             onUpdate?.();
//         } catch (err) {
//             setError('Failed to update quantity. Please try again.');
//             
//         } finally {
//             setIsUpdating(false);
//         }
//     };

//     const handleRemove = async () => {
//         try {
//             await removeItem(item.id);
//             onRemove?.();
//         } catch (err) {
//             
//         }
//     };

//     return (
//         <article
//             className={`flex ${isDrawer ? 'py-4' : 'py-6'} border-b border-[var(--border-color)]`}
//             itemScope
//             itemType="https://schema.org/Product"
//         >
//             <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-[var(--border-color)]">
//                 <Image
//                     src={item?.product?.images[0] || '/images/placeholder.jpg'}
//                     alt={item?.product?.imageAlt || item?.product?.name}
//                     width={96}
//                     height={96}
//                     className="h-full w-full object-cover"
//                     itemProp="image"
//                 />
//             </div>

//             <div className="ml-4 flex flex-1 flex-col">
//                 <div>
//                     <div className="flex justify-between">
//                         <div className="pr-4">
//                             <h3 className="text-[var(--text-primary)] font-[var(--font-body-weight-bold)]" style={{ fontFamily: 'var(--font-body-family)' }}>
//                                 <a
//                                     href={`/products/${item?.product?.slug}`}
//                                     className="hover:text-[var(--main-color)]"
//                                     itemProp="name"
//                                 >
//                                     {item?.product?.name}
//                                 </a>
//                             </h3>
//                             {item?.product?.variant && (
//                                 <p className="mt-1 text-[var(--text-secondary)] text-sm" style={{ fontFamily: 'var(--font-body-family)' }}>
//                                     {item.product.variant.size && `Size: ${item.product.variant.size} `}
//                                     {item.product.variant.color && `Color: ${item.product.variant.color}`}
//                                 </p>
//                             )}
//                         </div>
//                         <div className="ml-4 flow-root">
//                             <button
//                                 type="button"
//                                 className="-m-2 p-2 inline-flex items-center justify-center text-[var(--text-light)] hover:text-[var(--text-primary)]"
//                                 onClick={handleRemove}
//                                 aria-label={`Remove ${item?.product?.name} from cart`}
//                             >
//                                 <span className="sr-only">Remove</span>
//                                 <Trash2 className="h-5 w-5" aria-hidden="true" />
//                             </button>
//                         </div>
//                     </div>

//                     <div className="mt-4 flex items-center">
//                         <div className="flex border border-[var(--border-color)] rounded">
//                             <button
//                                 type="button"
//                                 className="px-2 py-1 text-[var(--text-secondary)] hover:bg-[var(--gray-light)] disabled:opacity-50"
//                                 onClick={() => handleQuantityChange(quantity - 1)}
//                                 disabled={isUpdating || quantity <= 1}
//                                 aria-label={`Decrease quantity of ${item?.product?.name}`}
//                             >
//                                 <Minus className="h-4 w-4" />
//                             </button>
//                             <span className="px-3 py-1 text-center min-w-[1.5rem]" aria-live="polite">
//                                 {isUpdating ? '...' : quantity}
//                             </span>
//                             <button
//                                 type="button"
//                                 className="px-2 py-1 text-[var(--text-secondary)] hover:bg-[var(--gray-light)] disabled:opacity-50"
//                                 onClick={() => handleQuantityChange(quantity + 1)}
//                                 disabled={isUpdating}
//                                 aria-label={`Increase quantity of ${item?.product?.name}`}
//                             >
//                                 <Plus className="h-4 w-4" />
//                             </button>
//                         </div>

//                         <p className="ml-4 text-[var(--text-primary)] font-[var(--font-body-weight-bold)]" style={{ fontFamily: 'var(--font-body-family)' }}>
//                             ${(item.product.price * quantity).toFixed(2)}
//                             <meta itemProp="offers" itemScope itemType="https://schema.org/Offer" />
//                             <meta itemProp="price" content={(item.product.price * quantity).toFixed(2)} />
//                             <meta itemProp="priceCurrency" content="USD" />
//                         </p>
//                     </div>

//                     {error && (
//                         <p className="mt-2 text-red-600 text-sm" role="alert">
//                             {error}
//                         </p>
//                     )}
//                 </div>
//             </div>
//         </article>
//     );
// }


import { Trash2, Minus, Plus } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { useUnifiedCartStore } from '@/store/unifiedCartStore';
import LazyImage from '../common/LazyImage';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { replaceImageUrl } from '@/lib/config';

/**
 * CartItem component - Individual item in the cart
 * Uses centralized cart logic for optimal performance
 */
export function CartItem({ item = {}, isDrawer = false }) {
    const { handleRemove, isItemUpdating, addItem } = useUnifiedCartStore();
    const [error, setError] = useState(null);
    const params = useParams();
    const locale = params?.locale || 'en';

    const getTranslatedName = (product) => {
        if (!product) return 'Unnamed Product';

        // Try translations first
        if (product.translations && Array.isArray(product.translations)) {
            const translation = product.translations.find(t => t.locale === locale);
            if (translation?.name) return translation.name;
        }

        // Fallback to direct name or default
        return product.name || 'Unnamed Product';
    };

    const isUpdating = isItemUpdating(item.id);
    const { price, quantity, totalPrice } = useMemo(() => {
        const itemPrice = item.product?.discounted_price ? item.product.discounted_price : item.product?.price || item.piece_price || 0;
        const qty = parseInt(item.quantity || 0);
        return {
            price: parseFloat(itemPrice),
            quantity: qty,
            totalPrice: (parseFloat(itemPrice) * qty).toFixed(2)
        };
    }, [item.product?.discounted_price, item.product?.price, item.piece_price, item.quantity]);

    const onQuantityChange = useCallback(async (newQuantity) => {
        if (newQuantity < 1) return;
        setError(null);
        try {
            await addItem(item.product, newQuantity - quantity, {
                colorId: item.color_id,
                sizeId: item.size_id
            });
        } catch (err) {
            setError(err.message);
        }
    }, [addItem, item.product, item.color_id, item.size_id, quantity]);

    const onRemove = useCallback(async () => {
        setError(null);
        try {
            await handleRemove(item.id);
        } catch (err) {
            setError(err.message);
        }
    }, [handleRemove, item.id]);

    return (
        <article
            className={`flex ${isDrawer ? 'py-4' : 'py-6'} border-b border-[var(--border-color)]`}
            itemScope
            itemType="https://schema.org/Product"
        >
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-[var(--border-color)]">
                <LazyImage
                    src={replaceImageUrl(item?.product?.image ? `${process.env.NEXT_PUBLIC_API_URL}/${item.product.image}` : '/images/placeholder.jpg')}
                    alt={item?.product?.name || 'Product image'}
                    fill
                    className="h-full w-full object-cover"
                    itemProp="image"
                />
            </div>

            <div className="ml-4 flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between">
                        <div className="pr-4">
                            <h3
                                className="text-[var(--text-primary)] font-[var(--font-body-weight-bold)]"
                                style={{ fontFamily: 'var(--font-body-family)' }}
                            >
                                <Link
                                    href={item?.product?.id ? `/products/${item.product.id}` : '#'}
                                    className="hover:text-[var(--main-color)]"
                                    itemProp="name"
                                >
                                    {getTranslatedName(item?.product)}
                                </Link>
                            </h3>
                            {(item?.size?.name || item?.color?.name) && (
                                <div className="mt-1 flex items-center gap-2">
                                    <p
                                        className="text-[var(--text-secondary)] text-sm"
                                        style={{ fontFamily: 'var(--font-body-family)' }}
                                    >
                                        {item.size?.name && `Size: ${item.size.name} `}
                                        {item.color?.name && `Color: ${item.color.name}`}
                                    </p>
                                    {item?.color?.hex_code && (
                                        <div
                                            className="w-4 h-4 rounded-full border border-gray-300"
                                            style={{ backgroundColor: item.color.hex_code }}
                                            title={item.color.name}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="ml-4 flow-root">
                            <button
                                type="button"
                                className="-m-2 p-2 inline-flex items-center justify-center text-[var(--text-light)] hover:text-[var(--text-primary)] disabled:opacity-50"
                                onClick={onRemove}
                                disabled={isUpdating}
                                aria-label={`Remove ${item?.product?.name || 'product'} from cart`}
                            >
                                <span className="sr-only">Remove</span>
                                <Trash2 className="h-5 w-5 text-[var(--main-color)]" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center">
                        <div className="flex border border-[var(--border-color)] rounded">
                            <button
                                type="button"
                                className="px-2 py-1 text-[var(--text-secondary)] hover:bg-[var(--gray-light)] disabled:opacity-50"
                                onClick={() => onQuantityChange(quantity - 1)}
                                disabled={isUpdating || quantity <= 1}
                                aria-label={`Decrease quantity of ${item?.product?.name || 'product'}`}
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-1 text-center min-w-[1.5rem]" aria-live="polite">
                                {isUpdating ? '...' : quantity}
                            </span>
                            <button
                                type="button"
                                className="px-2 py-1 text-[var(--text-secondary)] hover:bg-[var(--gray-light)] disabled:opacity-50"
                                onClick={() => onQuantityChange(quantity + 1)}
                                disabled={isUpdating}
                                aria-label={`Increase quantity of ${item?.product?.name || 'product'}`}
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>

                        <p
                            className="ml-4 text-[var(--text-primary)] font-[var(--font-body-weight-bold)]"
                            style={{ fontFamily: 'var(--font-body-family)' }}
                        >
                            ${totalPrice}
                            <meta itemProp="offers" itemScope itemType="https://schema.org/Offer" />
                            <meta itemProp="price" content={totalPrice} />
                            <meta itemProp="priceCurrency" content="USD" />
                        </p>
                    </div>

                    {error && (
                        <p className="mt-2 text-red-600 text-sm" role="alert">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}
