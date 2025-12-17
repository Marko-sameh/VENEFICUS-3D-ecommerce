// 'use client';

// import React, { createContext, useContext, useEffect } from 'react';
// // import { useAuthStore } from '@/store';
// // import { validateToken } from '@/lib/auth';
// import { authService } from '@/services/authService';
// import { useAuthStore } from '@/store/authStore';

// // Create the context
// const AuthContext = createContext(null);

// // Auth Provider component
// export function AuthProvider({ children }) {
//     const {
//         user,
//         token,
//         isAuthenticated,
//         refreshSession,
//         clearError
//     } = useAuthStore();

//     // Check authentication on mount
//     useEffect(() => {
//         const initAuth = async () => {
//             if (token && !validateToken(token)) {
//                 try {
//                     await refreshSession();
//                 } catch (error) {
//                     
//                 }
//             }
//         };

//         initAuth();
//     }, [token, refreshSession]);

//     // Check if user is authenticated
//     const checkAuth = () => {
//         return isAuthenticated();
//     };

//     // Get authentication token
//     const getToken = () => {
//         return token;
//     };

//     // Get current user
//     const getCurrentUser = () => {
//         return user;
//     };

//     // Logout user
//     const logout = () => {
//         useAuthStore.getState().logout();
//     };

//     // Clear auth error
//     const clearAuthError = () => {
//         clearError();
//     };

//     const value = {
//         user,
//         token,
//         isAuthenticated: checkAuth,
//         getToken,
//         getCurrentUser,
//         logout,
//         clearError: clearAuthError
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// }

// // Custom hook to use auth context
// export function useAuth() {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// }




'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';

// Create the context
const AuthContext = createContext(null);

// Auth Provider component
export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize authentication on mount
    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
        setIsLoading(false);
    }, []);

    // Logout user
    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
    };

    const value = {
        isAuthenticated,
        isLoading,
        logout,
        getToken: authService.getToken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}