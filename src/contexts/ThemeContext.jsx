'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useUiStore } from '@/store';

// Create the context
const ThemeContext = createContext(null);

// Theme Provider component
export function ThemeProvider({ children }) {
    const { theme, isDarkMode, setTheme } = useUiStore();

    // Initialize theme on mount
    useEffect(() => {
        const root = document.documentElement;

        // Set initial theme
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            if (theme === 'system') {
                root.classList.toggle('dark', e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    // Toggle between light and dark mode
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    // Set theme explicitly
    const setThemeMode = (mode) => {
        setTheme(mode);
    };

    const value = {
        theme,
        isDarkMode,
        toggleTheme,
        setTheme: setThemeMode
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook to use theme context
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}