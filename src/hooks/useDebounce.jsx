'use client';

import { useEffect, useState } from 'react';

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Sanitize value to prevent code injection
        const sanitizedValue = typeof value === 'string' ? String(value).replace(/<[^>]*>/g, '') : value;
        // Validate delay to ensure it's a safe number
        const safeDelay = typeof delay === 'number' && delay >= 0 ? delay : 300;

        // Set debounced value after delay
        const handler = setTimeout(() => {
            setDebouncedValue(sanitizedValue);
        }, safeDelay);

        // Cleanup timeout on value change or unmount
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Usage example:
// const debouncedSearchTerm = useDebounce(searchTerm, 300);