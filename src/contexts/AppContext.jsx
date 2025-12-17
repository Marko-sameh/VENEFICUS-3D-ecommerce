'use client';

import { createContext, useContext } from 'react';
import { ToastProvider } from './ToastContext';
import { LanguageProvider } from './LanguageContext';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { CartProvider } from '@/hooks/useCart';

// Global app context for shared state
const AppContext = createContext(null);

export function AppProvider({ children }) {
    const value = {
        // Add global app state here if needed
    };

    return (
        <AppContext.Provider value={value}>
            <I18nProvider>
                <ToastProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </ToastProvider>
            </I18nProvider>
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}