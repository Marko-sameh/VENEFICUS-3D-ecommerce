// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { cartService } from '@/services/cartService';
// import { userService } from '@/services/userService';
// import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
// import { JsonLd } from '@/components/seo/JsonLd';
// import { CheckoutForm } from '@/components/checkout/CheckoutForm';
// import { OrderSummary } from '@/components/checkout/OrderSummary';
// import { ProgressSteps } from '@/components/checkout/ProgressSteps';

// export async function generateMetadata() {
//     return {
//         title: 'Checkout | VENEFICUS',
//         description: 'Complete your purchase securely at VENEFICUS. Enter shipping details, select payment method, and review your order.',
//         openGraph: {
//             title: 'Checkout | VENEFICUS',
//             description: 'Complete your purchase securely at VENEFICUS. Enter shipping details, select payment method, and review your order.',
//             url: '/checkout',
//             siteName: 'VENEFICUS',
//             images: [
//                 {
//                     url: '/images/og-checkout.jpg',
//                     width: 1200,
//                     height: 630,
//                     alt: 'VENEFICUS Checkout Process'
//                 }
//             ],
//             type: 'website'
//         },
//         twitter: {
//             card: 'summary_large_image',
//             title: 'Checkout | VENEFICUS',
//             description: 'Complete your purchase securely at VENEFICUS. Enter shipping details, select payment method, and review your order.',
//             images: ['/images/og-checkout.jpg']
//         }
//     };
// }

// export default async function CheckoutPage() {
//     // Temporary mockup data
//     const isLoggedIn = true;
//     const session = {
//         user: {
//             id: 'user_123',
//             name: 'John Doe',
//             email: 'john.doe@example.com'
//         }
//     };

//     // Mock cart data
//     const cart = {
//         id: 'cart_123',
//         items: [
//             {
//                 id: 'item_1',
//                 productId: 'prod_1',
//                 name: 'Mystical Crystal Pendant',
//                 price: 89.99,
//                 quantity: 1,
//                 image: '/images/products/crystal-pendant.jpg',
//                 variant: 'Silver Chain'
//             },
//             {
//                 id: 'item_2',
//                 productId: 'prod_2',
//                 name: 'Ancient Tarot Deck',
//                 price: 45.00,
//                 quantity: 2,
//                 image: '/images/products/tarot-deck.jpg',
//                 variant: 'Deluxe Edition'
//             }
//         ],
//         subtotal: 179.99,
//         shipping: 12.99,
//         tax: 15.36,
//         total: 208.34
//     };

//     // Mock user data
//     const user = {
//         id: 'user_123',
//         name: 'John Doe',
//         email: 'john.doe@example.com',
//         phone: '+1 (555) 123-4567'
//     };

//     // Mock addresses
//     const addresses = [
//         {
//             id: 'addr_1',
//             type: 'shipping',
//             firstName: 'John',
//             lastName: 'Doe',
//             company: '',
//             address1: '123 Mystic Avenue',
//             address2: 'Apt 4B',
//             city: 'Salem',
//             state: 'MA',
//             zipCode: '01970',
//             country: 'US',
//             isDefault: true
//         }
//     ];

//     // Mock payment methods
//     const paymentMethods = [
//         {
//             id: 'pm_1',
//             type: 'card',
//             brand: 'visa',
//             last4: '4242',
//             expiryMonth: 12,
//             expiryYear: 2025,
//             isDefault: true
//         }
//     ];

//     try {
//         // Check if cart is empty
//         if (!cart || cart.items.length === 0) {
//             return (
//                 <div className="container mx-auto px-4 py-12">
//                     <div
//                         className="max-w-md mx-auto bg-[var(--card-bg)] rounded-lg p-8 text-center"
//                         style={{
//                             borderColor: 'var(--border-color)',
//                             backgroundColor: 'var(--background)'
//                         }}
//                     >
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-16 w-16 mx-auto text-[var(--gray)]"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="1.5"
//                                 d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
//                             />
//                         </svg>

//                         <h2
//                             className="text-xl font-bold mt-4 mb-2"
//                             style={{
//                                 color: 'var(--text-primary)',
//                                 fontFamily: 'var(--font-heading-family)'
//                             }}
//                         >
//                             Your Cart is Empty
//                         </h2>

//                         <p
//                             className="text-[var(--text-secondary)] mb-6"
//                             style={{ fontFamily: 'var(--font-body-family)' }}
//                         >
//                             There are no items in your cart. Add some products to proceed to checkout.
//                         </p>

//                         <a
//                             href="/shop"
//                             className="inline-block px-4 py-2 bg-[var(--main-color)] text-[var(--text-white)] rounded-md hover:bg-[var(--main-color-hover)]"
//                             style={{ fontFamily: 'var(--font-body-family)' }}
//                         >
//                             Continue Shopping
//                         </a>
//                     </div>
//                 </div>
//             );
//         }

//         return (
//             <div className="container mx-auto px-4 py-8">
//                 <JsonLd
//                     item={{
//                         '@context': 'https://schema.org',
//                         '@type': 'CheckoutPage',
//                         name: 'Checkout',
//                         description: 'Complete your purchase at VENEFICUS',
//                         breadcrumb: {
//                             '@type': 'BreadcrumbList',
//                             itemListElement: [
//                                 {
//                                     '@type': 'ListItem',
//                                     position: 1,
//                                     name: 'Home',
//                                     item: '/'
//                                 },
//                                 {
//                                     '@type': 'ListItem',
//                                     position: 2,
//                                     name: 'Cart',
//                                     item: '/cart'
//                                 },
//                                 {
//                                     '@type': 'ListItem',
//                                     position: 3,
//                                     name: 'Checkout',
//                                     item: '/checkout'
//                                 }
//                             ]
//                         },
//                         potentialAction: {
//                             '@type': 'OrderAction',
//                             name: 'Place Order',
//                             target: {
//                                 '@type': 'EntryPoint',
//                                 urlTemplate: '/api/checkout',
//                                 actionPlatform: [
//                                     'http://schema.org/DesktopWebPlatform',
//                                     'http://schema.org/IOSPlatform',
//                                     'http://schema.org/AndroidPlatform'
//                                 ]
//                             }
//                         }
//                     }}
//                 />

//                 <div className="mb-8">
//                     <h1
//                         className="text-3xl font-bold mb-2"
//                         style={{
//                             color: 'var(--text-primary)',
//                             fontFamily: 'var(--font-heading-family)'
//                         }}
//                     >
//                         Checkout
//                     </h1>
//                     <p
//                         className="text-[var(--text-secondary)]"
//                         style={{ fontFamily: 'var(--font-body-family)' }}
//                     >
//                         Complete your purchase in 4 easy steps
//                     </p>
//                 </div>

//                 <ProgressSteps
//                     steps={[
//                         { id: 'cart', name: 'Cart', href: '/cart', status: 'complete' },
//                         { id: 'information', name: 'Information', href: '#', status: 'current' },
//                         { id: 'shipping', name: 'Shipping', href: '#', status: 'upcoming' },
//                         { id: 'payment', name: 'Payment', href: '#', status: 'upcoming' }
//                     ]}
//                 />

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
//                     <div className="lg:col-span-2">
//                         <CheckoutForm
//                             cart={cart}
//                             user={user}
//                             addresses={addresses}
//                             paymentMethods={paymentMethods}
//                             isLoggedIn={isLoggedIn}
//                         />
//                     </div>

//                     <div className="lg:col-span-1">
//                         <OrderSummary cart={cart} />
//                     </div>
//                 </div>
//             </div>
//         );
//     } catch (error) {

//         return (
//             <div className="container mx-auto px-4 py-12">
//                 <div className="max-w-md mx-auto bg-[var(--card-bg)] rounded-lg p-8 text-center">
//                     <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">
//                         Something went wrong
//                     </h2>
//                     <p className="text-[var(--text-secondary)] mb-6">
//                         We encountered an error loading the checkout page. Please try again.
//                     </p>
//                     <a
//                         href="/cart"
//                         className="inline-block px-4 py-2 bg-[var(--main-color)] text-[var(--text-white)] rounded-md hover:bg-[var(--main-color-hover)]"
//                     >
//                         Back to Cart
//                     </a>
//                 </div>
//             </div>
//         );
//     }
// }



import { JsonLd } from "@/components/seo/JsonLd";
import { CheckoutClient } from "./CheckoutClient";

export const revalidate = 0;

export async function generateMetadata() {
    return {
        title: "Checkout | VENEFICUS",
        description: "Complete your purchase securely at VENEFICUS. Enter shipping details, select payment method, and review your order.",
        openGraph: {
            title: "Checkout | VENEFICUS",
            description: "Complete your purchase securely at VENEFICUS.",
            url: "/checkout",
            siteName: "VENEFICUS",
            type: "website"
        },
        twitter: {
            card: "summary_large_image",
            title: "Checkout | VENEFICUS",
            description: "Complete your purchase securely at VENEFICUS."
        }
    };
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-[var(--background)]">
            <JsonLd item={{
                "@context": "https://schema.org",
                "@type": "CheckoutPage",
                name: "Checkout",
                description: "Complete your purchase at VENEFICUS"
            }} />
            <CheckoutClient />
        </div>
    );
}
