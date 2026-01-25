// "use client";

// import { useState, useEffect } from 'react';
// import { ProfileForm } from '@/components/account/ProfileForm';
// import { OrderHistory } from '@/components/account/OrderHistory';
// import AddressBook from '@/components/account/AddressBook';
// import { PasswordChange } from '@/components/account/PasswordChange';
// import LazyImage from '@/components/common/LazyImage';
// import Link from 'next/link';
// import { useUserStore } from '@/store/userStore';
// import { useOrdersStore } from '@/store/ordersStore';
// import { useAddressStore } from '@/store/addressStore';

// export default function ProfileClient({ initialData }) {
//     const { user, setUser, updateProfile } = useUserStore();
//     const { orders, setOrders } = useOrdersStore();
//     const { addresses, setAddresses } = useAddressStore();

//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//         // Initialize stores with server data
//         if (initialData) {
//             setUser(initialData.user);
//             setOrders(initialData.orders);
//             setAddresses(initialData.addresses);
//         }
//     }, [initialData, setUser, setOrders, setAddresses]);

//     const currentUser = user || initialData.user;
//     const currentOrders = orders || initialData.orders;
//     const currentAddresses = addresses || initialData.addresses;

//     const handleProfileUpdate = async (updatedData) => {
//         setIsLoading(true);
//         try {
//             await updateProfile(updatedData);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <>
//             <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading-family)', color: 'var(--text-primary)' }}>
//                 My Profile
//             </h1>

//             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//                 {/* Sidebar */}
//                 <aside className="lg:col-span-1">
//                     <div className="bg-[var(--card-bg)] rounded-lg p-4" style={{ borderColor: 'var(--border-color)' }}>
//                         <div className="flex items-center mb-6">
//                             {currentUser.avatar ? (
//                                 <LazyImage
//                                     src={currentUser.avatar}
//                                     alt={currentUser.name}
//                                     width={64}
//                                     height={64}
//                                     className="w-16 h-16 rounded-full object-cover"
//                                 />
//                             ) : (
//                                 <div className="w-16 h-16 rounded-full bg-[var(--gray-light)] flex items-center justify-center text-[var(--text-primary)] font-bold">
//                                     {currentUser.name.charAt(0)}
//                                 </div>
//                             )}
//                             <div className="ml-4">
//                                 <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>
//                                     {currentUser.name}
//                                 </h2>
//                                 <p className="text-sm" style={{ color: 'var(--text-light)' }}>
//                                     {currentUser.email}
//                                 </p>
//                             </div>
//                         </div>

//                         <nav>
//                             <ul className="space-y-2">
//                                 <li>
//                                     <Link href="/profile" className="block p-2 rounded-md bg-[var(--main-color-light)] font-medium" style={{ color: 'var(--text-primary)' }}>
//                                         Profile Information
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link href="/orders" className="block p-2 rounded-md hover:bg-[var(--gray-light)]" style={{ color: 'var(--text-secondary)' }}>
//                                         Order History
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link href="/addresses" className="block p-2 rounded-md hover:bg-[var(--gray-light)]" style={{ color: 'var(--text-secondary)' }}>
//                                         Addresses
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link href="/settings" className="block p-2 rounded-md hover:bg-[var(--gray-light)]" style={{ color: 'var(--text-secondary)' }}>
//                                         Account Settings
//                                     </Link>
//                                 </li>
//                             </ul>
//                         </nav>
//                     </div>
//                 </aside>

//                 {/* Main Content */}
//                 <main className="lg:col-span-3">
//                     <div className="space-y-8">
//                         {/* Profile Information */}
//                         <section>
//                             <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
//                                 Profile Information
//                             </h2>
//                             <ProfileForm user={currentUser} onUpdate={handleProfileUpdate} />
//                         </section>

//                         {/* Recent Orders */}
//                         <section>
//                             <div className="flex justify-between items-center mb-4">
//                                 <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
//                                     Recent Orders
//                                 </h2>
//                                 <Link href="/account/orders" className="text-[var(--main-color)] hover:underline">
//                                     View All Orders
//                                 </Link>
//                             </div>
//                             <OrderHistory orders={currentOrders} limit={3} />
//                         </section>

//                         {/* Addresses */}
//                         <section>
//                             <div className="flex justify-between items-center mb-4">
//                                 <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
//                                     Saved Addresses
//                                 </h2>
//                                 <Link href="/account/addresses" className="text-[var(--main-color)] hover:underline">
//                                     Manage Addresses
//                                 </Link>
//                             </div>
//                             <AddressBook initialAddresses={currentAddresses} />
//                         </section>

//                         {/* Password */}
//                         <section>
//                             <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
//                                 Password Security
//                             </h2>
//                             <PasswordChange userId={currentUser.id} />
//                         </section>
//                     </div>
//                 </main>
//             </div>
//         </>
//     );
// }



"use client";

import { useEffect, useRef } from "react";
import { OrderHistory } from "@/components/account/OrderHistory";
import AddressBook from "@/components/account/AddressBook";
import LazyImage from "@/components/common/LazyImage";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUserStore } from "@/store/userStore";
import { useOrdersStore } from "@/store/ordersStore";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { motion } from "framer-motion";

export default function ProfileClient({ initialData }) {
    const {
        user,
        addresses,
        isLoading,
        error,
        isInitialized,
        isAuthenticated,
        initializeAuth,
        initializeUser
    } = useUserStore();
    const { orders, fetchOrders } = useOrdersStore();
    const fetchedRef = useRef(false);

    useEffect(() => {
        initializeAuth();
        if (isAuthenticated) {
            initializeUser();
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated && user?.id && isInitialized && !fetchedRef.current) {
            fetchedRef.current = true;
            fetchOrders();
        }
    }, [isAuthenticated, user?.id, isInitialized, fetchOrders]);


    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-[var(--text-secondary)]">Loading profile...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 mb-4">Error loading profile: {error}</p>
                <button
                    onClick={() => initializeUser()}
                    className="px-4 py-2 bg-[var(--main-color)] text-white rounded-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="text-center py-12">
                <p className="text-[var(--text-secondary)] mb-4">Please sign in to view your profile.</p>
                <a href="/login" className="px-4 py-2 bg-[var(--main-color)] text-white rounded-md">
                    Sign In
                </a>
            </div>
        );
    }

    const currentUser = user;
    const currentOrders = orders.slice(0, 3);
    const currentAddresses = addresses;

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-6xl font-heading font-bold text-[var(--text-primary)] mb-4">
                    My Profile
                </h1>
                <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: 64 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="block mx-auto h-1 bg-gradient-to-r from-transparent via-[var(--main-color)] to-transparent"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-[var(--card-bg)] rounded-xl p-6 mb-8 flex items-center shadow-xl"
            >
                {currentUser?.avatar ? (
                    <LazyImage
                        src={currentUser.avatar}
                        alt={currentUser.name || 'User'}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-[var(--gray-light)] flex items-center justify-center text-[var(--main-color)] font-bold">
                        {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                )}
                <div className="ml-4">
                    <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                        {currentUser?.name || 'Unknown User'}
                    </h2>
                    <p className="text-sm" style={{ color: "var(--text-light)" }}>
                        {currentUser?.email || 'No email'}
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <Tabs defaultValue="profile" className="flex flex-col lg:flex-row gap-6">
                    <TabsList className="flex lg:flex-col w-full lg:w-1/4 bg-[var(--card-bg)] rounded-xl shadow-xl p-2">
                        <TabsTrigger value="profile">Profile Information</TabsTrigger>
                        <TabsTrigger value="orders">Order History</TabsTrigger>
                        <TabsTrigger value="addresses">Addresses</TabsTrigger>
                        {/* <TabsTrigger value="password">Password Security</TabsTrigger> */}
                    </TabsList>

                    {/* Tab Content */}
                    <div className="flex-1 space-y-6">
                        <TabsContent value="profile">
                            <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm">
                                {/* <h2
                                className="text-2xl font-bold mb-4"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Profile Information
                            </h2> */}
                                {/* <ProfileForm user={currentUser} onUpdate={handleProfileUpdate} /> */}
                                <div>
                                    <p>Name: {currentUser.name}</p>
                                    <p>Email: {currentUser.email}</p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="orders">
                            <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h2
                                        className="text-2xl font-bold"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        Recent Orders
                                    </h2>
                                </div>
                                <OrderHistory orders={currentOrders} limit={3} />
                            </div>
                        </TabsContent>

                        <TabsContent value="addresses">
                            <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm">
                                {/* <div className="flex justify-between items-center mb-4">
                                    <h2
                                        className="text-2xl font-bold"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        Saved Addresses
                                    </h2>
                                </div> */}
                                <AddressBook initialAddresses={currentAddresses} />
                            </div>
                        </TabsContent>

                        {/* <TabsContent value="password">
                        <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-sm">
                            <h2
                                className="text-2xl font-bold mb-4"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Password Security
                            </h2>
                            <PasswordChange userId={currentUser.id} />
                        </div>
                    </TabsContent> */}
                    </div>
                </Tabs>
            </motion.div>
        </div>
    );
}
