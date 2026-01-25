'use client';

import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
    // Initialize state with value from localStorage or initial value
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            
            return initialValue;
        }
    });

    // Update localStorage when value changes
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            
        }
    };

    // Listen for changes from other tabs
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        
        const handleStorageChange = (event) => {
            if (event.key === key) {
                try {
                    const newValue = event.newValue ? JSON.parse(event.newValue) : null;
                    setStoredValue(newValue);
                } catch (error) {
                    
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue];
};

// Specific hooks for common use cases
export const useCartLocalStorage = () => {
    return useLocalStorage('guestCart', { items: [], total: 0, itemCount: 0 });
};

export const useWishlistLocalStorage = () => {
    return useLocalStorage('guestWishlist', []);
};

export const useTheme = () => {
    const [theme, setTheme] = useLocalStorage('theme', 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return { theme, setTheme, toggleTheme };
};

export const useCurrency = () => {
    return useLocalStorage('currency', 'USD');
};

export const useLanguage = () => {
    return useLocalStorage('language', 'en-US');
};