import React from 'react';

const LoadingSpinner = ({
    size = 'medium',
    color = 'var(--main-color)',
    className = '',
    'aria-label': ariaLabel = 'Loading...',
    hideFromScreenReader = false
}) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    const strokeWidth = {
        small: 2,
        medium: 2.5,
        large: 3
    };

    return (
        <div
            className={`inline-flex items-center justify-center ${className}`}
            role={hideFromScreenReader ? 'presentation' : 'status'}
            aria-label={hideFromScreenReader ? undefined : ariaLabel}
            aria-hidden={hideFromScreenReader}
        >
            <svg
                className={`${sizeClasses[size]} animate-spin`}
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="var(--gray-light)"
                    strokeWidth={strokeWidth[size]}
                    className="opacity-25"
                />

                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke={color}
                    strokeWidth={strokeWidth[size]}
                    strokeLinecap="round"
                    strokeDasharray="31.416"
                    strokeDashoffset="23.562"
                    className="animate-spin"
                    style={{
                        transformOrigin: '12px 12px',
                        animation: 'spin 1s linear infinite'
                    }}
                />
            </svg>

            {!hideFromScreenReader && (
                <span className="sr-only">
                    {ariaLabel}
                </span>
            )}
        </div>
    );
};


export default LoadingSpinner;