"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { CustomInput } from './input';
import { Button } from './Button';



// Flexible Modal Component
const Modal = ({
    title = "Modal Title",
    buttonText = "Open Modal",
    onSubmit,
    isOpen: controlledIsOpen,
    onClose: controlledOnClose,
    children,
    maxWidth = "max-w-md",
    showTriggerButton = true
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const modalRef = useRef(null);

    // Use controlled state if provided, otherwise use internal state
    const modalIsOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;
    const closeModal = controlledOnClose || (() => setIsOpen(false));

    // Handle form submission
    const handleFormSubmit = async (data) => {
        try {
            if (onSubmit) {
                await onSubmit(data);
            } else {
                // Form submitted successfully
                // TODO: Integrate with proper notification system
            }
            closeModal();
        } catch (error) {
            
        }
    };

    // Handle keyboard navigation and focus trap
    useEffect(() => {
        if (!modalIsOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                return;
            }

            if (e.key !== 'Tab') return;

            const focusableElements = modalRef.current?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (!focusableElements?.length) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Focus the first focusable element
        // Focus management
        requestAnimationFrame(() => {
            const firstFocusable = modalRef.current?.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            firstFocusable?.focus();
        });

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [modalIsOpen, closeModal]);

    return (
        <>
            {/* Trigger Button - Only show if not controlled externally */}
            {controlledIsOpen === undefined && showTriggerButton && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="block text-white bg-[var(--main-color)] hover:bg-[var(--main-color-hover)] focus:ring-4 focus:outline-none focus:ring-[var(--main-color)]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-200"
                    type="button"
                    aria-haspopup="dialog"
                >
                    {buttonText}
                </button>
            )}

            {/* Modal Overlay */}
            {modalIsOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    />
                    <div
                        className="fixed inset-0 z-50 flex justify-center items-center p-4"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                closeModal();
                            }
                        }}
                    >
                        {/* Modal Container */}
                        <div
                            ref={modalRef}
                            className={`relative w-full ${maxWidth} max-h-full`}
                        >
                            {/* Modal Content */}
                            <div className="relative bg-white rounded-lg shadow-lg ">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-[var(--main-color)] border-[var(--main-color)]">
                                    <h3
                                        id="modal-title"
                                        className="text-lg font-semibold"
                                    >
                                        {title}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="text-[var(--main-color)] bg-transparent  hover:text-[var(--main-color-hover)] rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center  transition-colors duration-200"
                                        aria-label="Close modal"
                                    >
                                        <svg
                                            className="w-3 h-3"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 14"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                            />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-4 md:p-5">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

// Example usage component
const ModalExample = () => {
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

    // Form for custom modal
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
        mode: 'onChange'
    });

    const watchedFields = watch();

    const handleUserSubmit = async (data) => {
        try {
            // Simulate API call
            // Form submitted successfully
            // TODO: Integrate with API and notification system
            reset();
            setIsCustomModalOpen(false);
        } catch (error) {
            
        }
    };

    // Helper function to check if field is valid
    const isFieldValid = (fieldName) => {
        return watchedFields[fieldName] && !errors[fieldName];
    };

    return (
        <div className="p-8 bg-[var(--background)] dark:bg-gray-900 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-[var(--foreground)] dark:text-white mb-8 text-center">
                    Modal Examples with CustomInput
                </h1>

                <div className="grid gap-8 md:grid-cols-2">

                    {/* Simple Modal */}
                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h2 className="text-xl font-semibold text-[var(--foreground)] dark:text-white mb-4">
                            Simple Modal
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Basic modal with simple content
                        </p>
                        <Modal
                            title="Simple Modal"
                            buttonText="Open Simple Modal"
                        >
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                This is a simple modal with basic content.
                            </p>
                            <button
                                onClick={() => alert('Button clicked!')}
                                className="text-white bg-[var(--main-color)] hover:bg-[var(--main-color-hover)] px-4 py-2 rounded-lg"
                            >
                                Click Me
                            </button>
                        </Modal>
                    </div>

                    {/* Custom Form Modal */}
                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h2 className="text-xl font-semibold text-[var(--foreground)] dark:text-white mb-4">
                            Custom Form Modal
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Modal with your CustomInput components
                        </p>
                        <button
                            onClick={() => setIsCustomModalOpen(true)}
                            className="text-white bg-[var(--main-color)] hover:bg-[var(--main-color-hover)] focus:ring-4 focus:outline-none focus:ring-[var(--main-color)]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-200"
                        >
                            Open Custom Form
                        </button>

                        <Modal
                            title="User Registration"
                            isOpen={isCustomModalOpen}
                            onClose={() => setIsCustomModalOpen(false)}
                            maxWidth="max-w-2xl"
                        >
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                <CustomInput
                                    label="First Name"
                                    name="firstName"
                                    placeholder="John"
                                    register={register('firstName', {
                                        required: 'First name is required',
                                        minLength: { value: 2, message: 'First name must be at least 2 characters' }
                                    })}
                                    error={errors.firstName}
                                    success={isFieldValid('firstName')}
                                    successMessage="Perfect!"
                                />

                                <CustomInput
                                    label="Last Name"
                                    name="lastName"
                                    placeholder="Doe"
                                    register={register('lastName', {
                                        required: 'Last name is required',
                                        minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                                    })}
                                    error={errors.lastName}
                                    success={isFieldValid('lastName')}
                                    successMessage="Great!"
                                />

                                <CustomInput
                                    label="Email Address"
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
                                    successMessage="Valid email!"
                                />

                                <CustomInput
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    placeholder="+1234567890"
                                    register={register('phone', {
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^[\+]?[1-9][\d]{0,15}$/,
                                            message: 'Please enter a valid phone number'
                                        }
                                    })}
                                    error={errors.phone}
                                    success={isFieldValid('phone')}
                                    successMessage="Valid phone!"
                                />

                                <CustomInput
                                    label="Company"
                                    name="company"
                                    placeholder="Your Company"
                                    register={register('company', {
                                        required: 'Company is required'
                                    })}
                                    error={errors.company}
                                    success={isFieldValid('company')}
                                    successMessage="Good company!"
                                />
                            </div>

                            {/* Custom Submit Button */}
                            <div className="mt-6 flex justify-end space-x-3">
                                <Button variant='secondary' onClick={() => setIsCustomModalOpen(false)} >
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit(handleUserSubmit)}>Register User</Button>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalExample;