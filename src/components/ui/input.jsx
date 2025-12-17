"use client";
import React, { useId } from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Label } from './label';
import { Button } from './Button';
import DOMPurify from 'isomorphic-dompurify';
import { useTranslation } from '@/hooks/useTranslation';

export const CustomInput = ({
    label,
    type = 'text',
    placeholder,
    register,
    error,
    success,
    successMessage,
    required = false,
    autoComplete,
    'aria-describedby': ariaDescribedBy,
    value,
    onChange,
    ...props
}) => {
    const { t } = useTranslation();
    const [isFocused, setIsFocused] = useState(false);
    const fallbackId = useId();
    const inputId = props.name || (label && DOMPurify.sanitize(label.toLowerCase().replace(/\s+/g, '_'))) || fallbackId;
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;

    // تحديد ما إذا كانت الـ label يجب أن تكون في الأعلى
    const shouldLabelFloat = isFocused || (value && value.length > 0) || (register?.value);

    const getInputClasses = () => {
        const baseClasses = "peer w-full px-4 pt-6 pb-2 text-sm rounded-lg border-2 transition-all duration-200 focus:outline-none placeholder-transparent bg-transparent";

        if (error) {
            return `${baseClasses} border-red-500 text-red-900 focus:border-red-600 focus:ring-2 focus:ring-red-200`;
        }
        if (success) {
            return `${baseClasses} border-green-500 text-green-900 focus:border-green-600 focus:ring-2 focus:ring-green-200`;
        }
        return `${baseClasses} text-[var(--text-primary)] border-[var(--border-color)] focus:border-[var(--gray)] hover:border-[var(--gray)] focus:ring-1 focus:ring-[var(--gray)] focus:ring-opacity-20`;
    };

    const getLabelClasses = () => {
        const baseClasses = "absolute left-4 transition-all duration-200 pointer-events-none select-none";
        const floatingClasses = "top-2 text-xs";
        const defaultClasses = "top-4 text-sm";

        if (error) {
            return `${baseClasses} ${shouldLabelFloat ? floatingClasses : defaultClasses} text-red-600`;
        }
        if (success) {
            return `${baseClasses} ${shouldLabelFloat ? floatingClasses : defaultClasses} text-green-600`;
        }

        const colorClass = shouldLabelFloat ? 'text-[var(--main-color)]' : 'text-[var(--text-light)]';
        return `${baseClasses} ${shouldLabelFloat ? floatingClasses : defaultClasses} ${colorClass}`;
    };

    const getContainerClasses = () => {
        const baseClasses = "relative mb-6 w-full";
        if (error) {
            return `${baseClasses} [&>input]:bg-red-50`;
        }
        if (success) {
            return `${baseClasses} [&>input]:bg-green-50`;
        }
        return `${baseClasses} [&>input]:bg-[var(--background)]`;
    };

    // تحديد aria-describedby بناءً على حالة الخطأ أو النجاح
    const getAriaDescribedBy = () => {
        const descriptions = [];
        if (ariaDescribedBy) descriptions.push(ariaDescribedBy);
        if (error) descriptions.push(errorId);
        if (success && successMessage) descriptions.push(successId);
        return descriptions.length > 0 ? descriptions.join(' ') : undefined;
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        if (props.onFocus) props.onFocus(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (props.onBlur) props.onBlur(e);
    };

    return (
        <div className={getContainerClasses()}>
            <input
                type={type}
                id={inputId}
                className={getInputClasses()}
                placeholder={placeholder || " "}
                required={required}
                autoComplete={autoComplete}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={getAriaDescribedBy()}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...register}
                {...props}
            />

            <Label
                htmlFor={inputId}
                className={getLabelClasses()} >

                {label}
                {required && (
                    <span className="text-[var(--main-color)] ml-1" aria-label="required">
                        *
                    </span>
                )}
            </Label>

            {error && (
                <p
                    id={errorId}
                    className="mt-2 text-sm text-red-600 w-full flex items-center gap-1"
                    role="alert"
                    aria-live="polite"
                >
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="sr-only">{t('common.error', 'Error')}: </span>
                    {error.message}
                </p>
            )}

            {success && successMessage && (
                <p
                    id={successId}
                    className="mt-2 text-sm text-green-600 w-full flex items-center gap-1"
                    role="status"
                    aria-live="polite"
                >
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="sr-only">{t('common.success', 'Success')}: </span>
                    {successMessage}
                </p>
            )}
        </div>
    );
};

// Checkbox Component
export const CustomCheckbox = ({ label, register, error, linkText, linkHref = "#" }) => {
    const { t } = useTranslation();
    const checkboxId = useId();
    return (
        <>
            <div className="flex items-start mb-6">
                <div className="flex items-center h-5">
                    <input
                        id={register?.name ? `checkbox-${register.name}` : `checkbox-${fallbackId}`}
                        type="checkbox"
                        className="w-4 h-4 border border-[var(--main-color)] rounded-sm bg-[var(--main-color)] focus:ring-3 focus:ring-[var(--main-color)] dark:bg-[var(--main-color)] dark:border-[var(--main-color)] dark:focus:ring-[var(--main-color)] dark:ring-offset-[var(--main-color)]"
                        {...register}
                    />
                </div>
                <Label htmlFor={register?.name ? `checkbox-${register.name}` : `checkbox-${fallbackId}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {label}{' '}
                    <a href={linkHref} className="text-[var(--main-color)] hover:underline dark:text-[var(--main-color)]">
                        {linkText}
                    </a>.
                </Label>
            </div>
            {
                error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500 ml-2">
                        <span className="font-medium">{t('common.required', 'Required')}!</span> {error.message}
                    </p>
                )
            }
        </>
    );
};
const CustomTextarea = ({
    label,
    name,
    placeholder,
    rows = 4,
    register,
    error,
    success,
    successMessage,
}) => {
    const { t } = useTranslation();
    return (
        <div className="w-full">
            <label
                htmlFor={name}
                className="block text-sm font-bold text-[var(--text-primary)] mb-2"
            >
                {label}
            </label>

            <textarea
                id={name}
                name={name}
                placeholder={placeholder}
                rows={rows}
                {...register}
                className={`w-full p-3 border rounded-lg bg-white text-[var(--text-primary)] focus:outline-none transition-all
          ${error
                        ? "border-red-500 focus:ring-2 focus:ring-red-400"
                        : success
                            ? "border-green-500 focus:ring-2 focus:ring-green-400"
                            : "border-[var(--border-color)] focus:ring-2 focus:ring-[var(--main-color)]/50"
                    }`}
            />

            {/* Error message */}
            {error && (
                <p className="mt-1 text-sm text-red-500">{error.message}</p>
            )}

            {/* Success message */}
            {success && successMessage && !error && (
                <p className="mt-1 text-sm text-green-600">{successMessage}</p>
            )}
        </div>
    );
};
// Main Form Component
const CustomForm = () => {
    const { t } = useTranslation();
    const { register, handleSubmit, watch, formState: { errors, isValid, touchedFields } } = useForm({
        mode: 'onChange'
    });

    const watchedFields = watch();

    const onSubmit = async (data) => {
        try {
            // Sanitize form data
            const sanitizedData = Object.keys(data).reduce((acc, key) => {
                acc[key] = typeof data[key] === 'string' ? DOMPurify.sanitize(data[key]) : data[key];
                return acc;
            }, {});
            
            // TODO: Replace with actual API call
            
        } catch (error) {
            
        }
    };

    const isFieldValid = (fieldName) => {
        return touchedFields[fieldName] && !errors[fieldName] && watchedFields[fieldName];
    };

    return (
        <div className="max-w-4xl w-[50%] mx-auto p-6 bg-[var(--card-bg)] min-h-screen">
            <h2 className="text-2xl font-bold text-[var(--foreground)]  mb-8 text-center">
                Registration Form
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <CustomInput
                        label="First name"
                        name="firstName"
                        placeholder="John"
                        register={register('firstName', {
                            required: 'First name is required',
                            minLength: { value: 2, message: 'First name must be at least 2 characters' }
                        })}
                        error={errors.firstName}
                        success={isFieldValid('firstName')}
                        successMessage="Looks good!"
                    />

                    <CustomInput
                        label="Last name"
                        name="lastName"
                        placeholder="Doe"
                        register={register('lastName', {
                            required: 'Last name is required',
                            minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                        })}
                        error={errors.lastName}
                        success={isFieldValid('lastName')}
                        successMessage="Perfect!"
                    />

                    <CustomInput
                        label="Company"
                        name="company"
                        placeholder="Your Company"
                        register={register('company', {
                            required: 'Company name is required',
                            minLength: { value: 2, message: 'Company name must be at least 2 characters' }
                        })}
                        error={errors.company}
                        success={isFieldValid('company')}
                        successMessage="Great company name!"
                    />

                    <CustomInput
                        label="Phone number"
                        name="phone"
                        type="tel"
                        placeholder="123-456-7890"
                        register={register('phone', {
                            required: 'Phone number is required',
                            pattern: {
                                value: /^[\+]?[1-9][\d]{0,15}$/,
                                message: 'Please enter a valid phone number'
                            }
                        })}
                        error={errors.phone}
                        success={isFieldValid('phone')}
                        successMessage="Valid phone number!"
                    />

                    <CustomInput
                        label="Website URL"
                        name="website"
                        type="url"
                        placeholder="https://yourwebsite.com"
                        register={register('website', {
                            required: 'Website URL is required',
                            pattern: {
                                value: /^https?:\/\/.+\..+/,
                                message: 'Please enter a valid URL'
                            }
                        })}
                        error={errors.website}
                        success={isFieldValid('website')}
                        successMessage="Valid website URL!"
                    />

                    <CustomInput
                        label="Unique visitors (per month)"
                        name="visitors"
                        type="number"
                        placeholder="1000"
                        register={register('visitors', {
                            required: 'Visitor count is required',
                            min: { value: 1, message: 'Must be at least 1 visitor' }
                        })}
                        error={errors.visitors}
                        success={isFieldValid('visitors')}
                        successMessage="Good traffic numbers!"
                    />
                </div>

                <CustomInput
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="john.doe@company.com"
                    register={register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address'
                        }
                    })}
                    error={errors.email}
                    success={isFieldValid('email')}
                    successMessage="Valid email address!"
                />

                <CustomInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="•••••••••"
                    register={register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters' },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message: 'Password must contain uppercase, lowercase, and number'
                        }
                    })}
                    error={errors.password}
                    success={isFieldValid('password')}
                    successMessage="Strong password!"
                />

                <CustomInput
                    label="Confirm password"
                    name="confirmPassword"
                    type="password"
                    placeholder="•••••••••"
                    register={register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value => value === watchedFields.password || 'Passwords do not match'
                    })}
                    error={errors.confirmPassword}
                    success={isFieldValid('confirmPassword') && watchedFields.confirmPassword === watchedFields.password}
                    successMessage="Passwords match!"
                />

                <CustomCheckbox
                    label="I agree with the"
                    linkText="terms and conditions"
                    register={register('terms', {
                        required: 'You must agree to the terms and conditions'
                    })}
                    error={errors.terms}
                />

                <Button type="submit">
                    Submit Registration
                </Button>
            </form>
        </div>
    );
};


export function ContactForm() {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, touchedFields },
    } = useForm({
        mode: "onChange",
    });

    const watchedFields = watch();

    const onSubmit = async (data) => {
        try {
            // Sanitize form data
            const sanitizedData = Object.keys(data).reduce((acc, key) => {
                acc[key] = typeof data[key] === 'string' ? DOMPurify.sanitize(data[key]) : data[key];
                return acc;
            }, {});
            
            // TODO: Replace with actual API call
            
        } catch (error) {
            
        }
    };

    const isFieldValid = (fieldName) => {
        return (
            touchedFields[fieldName] &&
            !errors[fieldName] &&
            watchedFields[fieldName]
        );
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-[var(--card-bg)] rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8 text-center">
                Contact Us
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <CustomInput
                    label="Name"
                    name="name"
                    placeholder="Your full name"
                    register={register("name", {
                        required: "Name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                    })}
                    error={errors.name}
                    success={isFieldValid("name")}
                    successMessage="Looks good!"
                />

                {/* Email */}
                <CustomInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    register={register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Please enter a valid email address",
                        },
                    })}
                    error={errors.email}
                    success={isFieldValid("email")}
                    successMessage="Valid email!"
                />

                {/* Message */}
                <CustomTextarea
                    label="Message"
                    name="message"
                    placeholder="Write your message..."
                    rows="5"
                    register={register("message", {
                        required: "Message is required",
                        minLength: { value: 10, message: "Message must be at least 10 characters" },
                    })}
                    error={errors.message}
                    success={isFieldValid("message")}
                    successMessage="Message looks good!"
                />

                <Button type="submit">Send Message</Button>
            </form>
        </div>
    );
};



export default CustomForm;