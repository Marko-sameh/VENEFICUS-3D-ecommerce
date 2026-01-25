// 'use client';

// import React, { createContext, useContext, useEffect } from 'react';
// import { useUiStore } from '@/store';
// // import { formatCurrency } from '@/lib/formatters';
// import { loadLanguageResources } from '@/lib/i18n';

// // Supported languages
// export const SUPPORTED_LANGUAGES = {
//     en: { name: 'English', flag: '🇺🇸' },
//     ar: { name: 'العربية', flag: '🇸🇦', direction: 'rtl' },
//     fr: { name: 'Français', flag: '🇫🇷' },
//     es: { name: 'Español', flag: '🇪🇸' },
//     de: { name: 'Deutsch', flag: '🇩🇪' }
// };

// // Create the context
// const LanguageContext = createContext(null);

// // Language Provider component
// export function LanguageProvider({ children }) {
//     const { setSeo } = useUiStore();
//     const [language, setLanguage] = React.useState('en');
//     const [resources, setResources] = React.useState({});
//     const [isLoading, setIsLoading] = React.useState(false);
//     const [error, setError] = React.useState(null);

//     // Initialize language on mount
//     useEffect(() => {
//         const initLanguage = async () => {
//             const savedLang = localStorage.getItem('preferred-language') || 'en';
//             setIsLoading(true);
//             setError(null);

//             try {
//                 const resources = await loadLanguageResources(savedLang);
//                 setLanguage(savedLang);
//                 setResources(resources);

//                 // Update HTML attributes for SEO
//                 document.documentElement.lang = savedLang;
//                 document.documentElement.dir = SUPPORTED_LANGUAGES[savedLang]?.direction || 'ltr';

//                 // Update SEO metadata
//                 setSeo({
//                     title: resources?.seo?.title || 'VENEFICUS Website',
//                     description: resources?.seo?.description || 'Modern web development toolkit'
//                 });
//             } catch (err) {
//                 setError(err.message);
//                 // Fallback to English
//                 const resources = await loadLanguageResources('en');
//                 setLanguage('en');
//                 setResources(resources);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         initLanguage();
//     }, [setSeo]);

//     // Change language
//     const changeLanguage = async (lang) => {
//         if (!SUPPORTED_LANGUAGES[lang]) {
//             throw new Error(`Unsupported language: ${lang}`);
//         }

//         setIsLoading(true);
//         setError(null);

//         try {
//             const resources = await loadLanguageResources(lang);
//             setLanguage(lang);
//             setResources(resources);

//             // Save preference
//             localStorage.setItem('preferred-language', lang);

//             // Update HTML attributes
//             document.documentElement.lang = lang;
//             document.documentElement.dir = SUPPORTED_LANGUAGES[lang]?.direction || 'ltr';

//             // Update SEO metadata
//             setSeo({
//                 title: resources?.seo?.title || 'VENEFICUS Website',
//                 description: resources?.seo?.description || 'Modern web development toolkit'
//             });

//             return resources;
//         } catch (err) {
//             setError(err.message);
//             throw err;
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Translate function
//     const t = (key, variables = {}) => {
//         let translation = key.split('.').reduce((obj, k) => obj?.[k], resources);

//         if (!translation) {
//             
//             return key;
//         }

//         // Replace variables in translation
//         Object.entries(variables).forEach(([k, v]) => {
//             translation = translation.replace(`{{${k}}}`, v);
//         });

//         return translation;
//     };

//     // Format currency based on current language
//     const formatPrice = (amount, currency = 'USD') => {
//         return formatCurrency(amount, currency, language);
//     };

//     const value = {
//         language,
//         direction: SUPPORTED_LANGUAGES[language]?.direction || 'ltr',
//         resources,
//         isLoading,
//         error,
//         changeLanguage,
//         t,
//         formatPrice,
//         supportedLanguages: SUPPORTED_LANGUAGES
//     };

//     return (
//         <LanguageContext.Provider value={value}>
//             {children}
//         </LanguageContext.Provider>
//     );
// }

// // Custom hook to use language context
// export function useLanguage() {
//     const context = useContext(LanguageContext);
//     if (!context) {
//         throw new Error('useLanguage must be used within a LanguageProvider');
//     }
//     return context;
// }