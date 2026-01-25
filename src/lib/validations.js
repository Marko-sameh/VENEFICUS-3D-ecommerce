/**
 * Client-side validation schemas for VENEFICUS
 * Uses Yup for schema-based validation
 */

import * as yup from "yup";
import { EMAIL_REGEX, PASSWORD_REGEX } from "./constants";

/**
 * Email validation schema
 */
export const emailSchema = yup
  .string()
  .required("Email is required")
  .matches(EMAIL_REGEX, "Please enter a valid email address");

/**
 * Password validation schema
 */
export const passwordSchema = yup
  .string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(
    PASSWORD_REGEX,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

/**
 * Login form validation schema
 */
export const loginSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Register form validation schema
 */
export const registerSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  acceptTerms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = yup.object({
  email: emailSchema,
});

/**
 * Reset password form validation schema
 */
export const resetPasswordSchema = yup.object({
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

/**
 * Address form validation schema
 */
export const addressSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  company: yup.string(),
  address1: yup.string().required("Address is required"),
  address2: yup.string(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postalCode: yup
    .string()
    .required("Postal code is required")
    .matches(/^[0-9a-zA-Z-]+$/, "Please enter a valid postal code"),
  country: yup.string().required("Country is required"),
  phone: yup
    .string()
    .matches(/^[0-9+\-\s()]+$/, "Please enter a valid phone number")
    .required("Phone number is required"),
});

/**
 * Checkout form validation schema
 */
export const checkoutSchema = yup.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  shippingMethod: yup.string().required("Please select a shipping method"),
  paymentMethod: yup.string().required("Please select a payment method"),
  saveAddress: yup.boolean(),
});

/**
 * Review form validation schema
 */
export const reviewSchema = yup.object({
  rating: yup
    .number()
    .required("Please select a rating")
    .min(1, "Please select at least 1 star")
    .max(5, "Please select at most 5 stars"),
  title: yup
    .string()
    .required("Review title is required")
    .min(5, "Review title must be at least 5 characters"),
  comment: yup
    .string()
    .required("Review comment is required")
    .min(10, "Review comment must be at least 10 characters"),
});
