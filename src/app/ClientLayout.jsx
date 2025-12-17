"use client";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { I18nProvider } from "@/components/providers/I18nProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Loading from "@/components/common/Loading";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { FloatingMessageProvider } from "@/contexts/FloatingMessageContext";

import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        const handleLoad = () => setIsLoading(false);

        if (document.readyState === 'complete') {
            setIsLoading(false);
        } else {
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <ErrorBoundary>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
                <AuthProvider>
                    <div className="antialiased">
                        <I18nProvider>
                            <CartProvider>
                                <AppProvider>
                                    <FloatingMessageProvider>
                                        <Header />
                                        <div className={`w-[100%] overflow-hidden ${!pathname.match(/^\/(en|it)\/?$/) ? 'my-[7rem]' : ""}`}>
                                            {children}
                                        </div>
                                        <Footer />
                                    </FloatingMessageProvider>
                                </AppProvider>
                            </CartProvider>
                        </I18nProvider>
                    </div>
                </AuthProvider>
            </GoogleOAuthProvider>
        </ErrorBoundary>
    );
}
