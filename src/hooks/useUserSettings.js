"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTranslation as useI18nextTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { setCookie, getCookie } from "@/lib/storage";
import "@/lib/i18n.client";
import { useUserStore } from "@/store/userStore";
import { useToast } from "@/components/ui/use-toast";
import { setDefaultAddress, deleteAddress } from "@/services/addressService";

export const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

export const AVAILABLE_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", region: "en-US" },
  { code: "EUR", name: "Euro", symbol: "€", region: "de-DE" },
];

const LANGUAGE_COOKIE_NAME = "veneficus-language";
const CURRENCY_COOKIE_NAME = "veneficus-currency";

// Optimized toast messages
const TOAST_MESSAGES = {
  success: {
    settings: {
      title: "Settings Updated",
      description: "Your account settings have been successfully updated.",
    },
    address: {
      title: "Default Address Changed",
      description: "Your default address has been updated.",
    },
    addressDeleted: {
      title: "Address Deleted",
      description: "The address was removed successfully.",
    },
    profile: {
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    },
    payment: {
      title: "Payment Method Saved",
      description: "Your payment method has been successfully saved.",
    },
    order: {
      title: "Order Placed Successfully",
      description: "Your order has been placed and is being processed.",
    },
  },
  error: {
    generic: {
      title: "Error",
      description: "An error occurred. Please try again.",
      variant: "destructive",
    },
    address: {
      title: "Error",
      description: "Could not update default address.",
      variant: "destructive",
    },
    addressDelete: {
      title: "Error",
      description: "Could not delete address.",
      variant: "destructive",
    },
    order: {
      title: "Order Failed",
      description: "Failed to place your order. Please try again.",
      variant: "destructive",
    },
  },
};

// Optimized translation hooks
export const useTranslation = (namespace = "common") => {
  const { t, i18n } = useI18nextTranslation(namespace);

  return useMemo(
    () => ({
      t: (key, fallback) => t(key, fallback),
      language: i18n.language,
      changeLanguage: i18n.changeLanguage,
      isRTL: i18n.language === "ar" || i18n.language === "he",
    }),
    [t, i18n.language, i18n.changeLanguage]
  );
};

export const useServerTranslation = (translations) => {
  return useMemo(() => {
    const t = (key, fallback = "") => {
      if (!translations) return fallback || key;
      const keys = key.split(".");
      let value = translations;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return fallback || key;
        }
      }

      return typeof value === "string" ? value : fallback || key;
    };
    return { t };
  }, [translations]);
};

export const useTranslatedData = (apiData, translationKeys = {}) => {
  const { t, language } = useTranslation();
  const [translatedData, setTranslatedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const memoizedKeys = useMemo(() => translationKeys, [translationKeys]);

  useEffect(() => {
    if (!apiData) {
      setTranslatedData(null);
      setIsLoading(false);
      return;
    }

    const translateData = (data) => {
      if (Array.isArray(data)) {
        return data.map((item) => translateData(item));
      }

      if (typeof data === "object" && data !== null) {
        const translated = { ...data };

        Object.keys(memoizedKeys).forEach((key) => {
          if (data[key]) {
            if (typeof data[key] === "object" && data[key][language]) {
              translated[key] = data[key][language];
            } else if (typeof data[key] === "string") {
              translated[key] = t(memoizedKeys[key], data[key]);
            }
          }
        });

        return translated;
      }

      return data;
    };

    try {
      const result = translateData(apiData);
      setTranslatedData(result);
    } catch (error) {
      setTranslatedData(apiData);
    } finally {
      setIsLoading(false);
    }
  }, [apiData, language, t, memoizedKeys]);

  return { data: translatedData, isLoading, language };
};

// Merged and optimized localization hook
export const useLocalization = () => {
  const { i18n } = useI18nextTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const prevLanguageRef = useRef(i18n.language);
  const [currency, setCurrencyState] = useState(AVAILABLE_CURRENCIES[0]);

  // Initialize both language and currency in one effect
  useEffect(() => {
    setMounted(true);

    const savedCurrency = getCookie(CURRENCY_COOKIE_NAME);
    const browserCurrency =
      navigator.languages?.[0]?.split("-")[1]?.toUpperCase() || "USD";
    const validCurrency =
      AVAILABLE_CURRENCIES.find(
        (c) => c.code === savedCurrency || c.code === browserCurrency
      ) || AVAILABLE_CURRENCIES[0];
    setCurrencyState(validCurrency);

    const savedLanguage = getCookie(LANGUAGE_COOKIE_NAME);
    if (
      savedLanguage &&
      AVAILABLE_LANGUAGES.some((lang) => lang.code === savedLanguage)
    ) {
      prevLanguageRef.current = savedLanguage;
      if (i18n.language !== savedLanguage) {
        i18n.changeLanguage(savedLanguage);
      }
    } else {
      prevLanguageRef.current = i18n.language;
    }
  }, [i18n]);

  const setLanguage = useCallback(
    (code) => {
      if (prevLanguageRef.current !== code) {
        prevLanguageRef.current = code;
        i18n.changeLanguage(code);
        setCookie(LANGUAGE_COOKIE_NAME, code, 30);
      }
    },
    [i18n]
  );

  const setCurrency = useCallback(
    (code) => {
      const newCurrency = AVAILABLE_CURRENCIES.find((c) => c.code === code);
      if (!newCurrency) return;

      setCookie(CURRENCY_COOKIE_NAME, code, 30);
      setCurrencyState(newCurrency);
      router.refresh();
    },
    [router]
  );

  const currentLanguage = useMemo(
    () =>
      AVAILABLE_LANGUAGES.find((lang) => lang.code === i18n.language) ||
      AVAILABLE_LANGUAGES[0],
    [i18n.language]
  );

  return {
    currentLanguage,
    availableLanguages: AVAILABLE_LANGUAGES,
    setLanguage,
    mounted,
    currency,
    availableCurrencies: AVAILABLE_CURRENCIES,
    setCurrency,
  };
};

export const useUserSettings = () => {
  const store = useUserStore();
  const { toast } = useToast();

  // Memoized handlers to prevent re-renders
  const handlers = useMemo(
    () => ({
      handleSubmit: async (e, onUpdate) => {
        e.preventDefault();
        try {
          await store.updateSettings(store.settings, onUpdate);
          toast(TOAST_MESSAGES.success.settings);
        } catch (error) {
          toast(TOAST_MESSAGES.error.generic);
        }
      },

      handleToggle: (name, checked) => store.updateSettingsField(name, checked),
      handleSelectChange: (e) =>
        store.updateSettingsField(e.target.name, e.target.value),

      handleSetDefault: async (id) => {
        try {
          const updatedAddresses = await setDefaultAddress(id);
          if (Array.isArray(updatedAddresses)) {
            store.setAddresses(updatedAddresses);
          } else {
            // Update the store manually if API doesn't return updated list
            const currentAddresses = store.addresses.map((addr) => ({
              ...addr,
              isDefault: addr.id === id,
            }));
            store.setAddresses(currentAddresses);
          }
          toast(TOAST_MESSAGES.success.address);
        } catch (error) {
          toast(TOAST_MESSAGES.error.address);
        }
      },

      handleDelete: async (id) => {
        try {
          await deleteAddress(id);
          const updatedAddresses = store.addresses.filter(
            (addr) => addr.id !== id
          );
          store.setAddresses(updatedAddresses);
          toast(TOAST_MESSAGES.success.addressDeleted);
        } catch (error) {
          toast(TOAST_MESSAGES.error.addressDelete);
        }
      },

      handleAddressFormChange: (address, onChange) => {
        return (e) => {
          if (!e || !e.target) return;
          const { name, value, type, checked } = e.target;
          const newValue = type === "checkbox" ? checked : value;
          if (onChange) {
            onChange({ ...address, [name]: newValue });
          }
        };
      },

      handleAddressFormSelectChange: (address, onChange) => {
        return (name, value) => {
          if (onChange) {
            onChange({ ...address, [name]: value });
          }
        };
      },

      handleAddressFormSubmit: async (formData, address, onSave) => {
        try {
          const userData = localStorage.getItem("veneficus_user_data");
          const user = userData ? JSON.parse(userData) : null;

          if (!user?.id) {
            throw new Error("Please log in to save addresses");
          }

          // Validate required fields before submission
          const requiredFields = ["address1", "city", "country"];
          const missingFields = requiredFields.filter(
            (field) => !formData[field]?.trim()
          );

          if (missingFields.length > 0) {
            throw new Error(
              `Please fill in required fields: ${missingFields.join(", ")}`
            );
          }

          const addressData = {
            user_id: user.id,
            street: formData.address1?.trim(),
            region: formData.state?.trim() || "",
            city: formData.city?.trim(),
            country: formData.country?.trim(),
            phone: formData.phone?.trim() || "",
            additional_info: formData.address2?.trim() || "",
            postalCode: formData.postalCode?.trim() || "",
            firstName: formData.firstName?.trim() || "",
            lastName: formData.lastName?.trim() || "",
            company: formData.company?.trim() || "",
            isDefault: formData.isDefault || false,
          };

          const normalizeAddress = (baseAddress) => ({
            ...baseAddress,
            ...formData,
            street: formData.address1,
            region: formData.state,
            additional_info: formData.address2,
            fullName: `${formData.firstName || ""} ${
              formData.lastName || ""
            }`.trim(),
          });

          let savedAddress;
          if (address?.id) {
            const { updateAddress } = await import("@/services/addressService");
            await updateAddress(address.id, addressData);
            savedAddress = normalizeAddress({ ...address, id: address.id });
            toast({
              title: "Success",
              description: "Address updated successfully",
            });
          } else {
            const { addAddress } = await import("@/services/addressService");
            const newAddress = await addAddress(addressData);
            if (!newAddress) {
              throw new Error("Failed to create address");
            }
            savedAddress = normalizeAddress(newAddress);
            toast({
              title: "Success",
              description: "Address added successfully",
            });
          }

          if (onSave) onSave(savedAddress);
          return savedAddress;
        } catch (error) {
          toast({
            title: "Error",
            description:
              error?.message || "Failed to save address. Please try again.",
            variant: "destructive",
          });
          throw error;
        }
      },

      // Address form state management
      useAddressForm: (address) => {
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [formData, setFormData] = useState({
          firstName: "",
          lastName: "",
          company: "",
          address1: "",
          address2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "US",
          phone: "",
          isDefault: false,
        });

        useEffect(() => {
          if (address) {
            setFormData({
              firstName:
                address.firstName || address.fullName?.split(" ")[0] || "",
              lastName:
                address.lastName ||
                address.fullName?.split(" ").slice(1).join(" ") ||
                "",
              company: address.company || "",
              address1: address.address1 || address.street || "",
              address2: address.address2 || address.additional_info || "",
              city: address.city || "",
              state: address.state || address.region || "",
              postalCode: address.postalCode || address.zipCode || "",
              country: address.country || "US",
              phone: address.phone || "",
              isDefault: address.isDefault || false,
            });
          }
        }, [address]);

        const handleInputChange = useCallback((e) => {
          const { name, value, type, checked } = e.target;
          setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
          }));
        }, []);

        const handleSubmit = useCallback(
          async (e, onSave) => {
            e.preventDefault();
            setIsSubmitting(true);
            try {
              await handlers.handleAddressFormSubmit(formData, address, onSave);
            } catch (error) {
            } finally {
              setIsSubmitting(false);
            }
          },
          [formData, address]
        );

        return {
          formData,
          isSubmitting,
          handleInputChange,
          handleSubmit,
        };
      },

      setIsAddingShipping: (isAdding) => {
        store.setAddressSelectorField("isAddingShipping", isAdding);
      },

      setIsAddingBilling: (isAdding) => {
        store.setAddressSelectorField("isAddingBilling", isAdding);
      },

      handleSelectShippingAddress: (
        address,
        onShippingChange,
        onBillingChange
      ) => {
        store.selectShippingAddress(address, onShippingChange, onBillingChange);
      },

      handleSelectBillingAddress: (address, onBillingChange) => {
        store.selectBillingAddress(address, onBillingChange);
      },

      handleUseShippingAddress: (checked, shippingAddress, onBillingChange) => {
        store.toggleUseShippingAddress(
          checked,
          shippingAddress,
          onBillingChange
        );
      },

      handleUseShippingAddressForm: (onUseShippingAddressChange) => {
        return (checked) => {
          if (onUseShippingAddressChange) {
            onUseShippingAddressChange(checked);
          }
        };
      },

      handleBillingUseShippingAddress: (onChange) => {
        return (checked) => {
          if (onChange) {
            onChange({ useShippingAddress: checked });
          }
        };
      },

      handleProfileFormSubmit: async (e, onUpdate) => {
        e.preventDefault();
        try {
          await store.submitProfileForm(onUpdate);
          toast(TOAST_MESSAGES.success.profile);
        } catch (error) {
          toast(TOAST_MESSAGES.error.generic);
        }
      },

      handlePlaceOrder: async () => {
        try {
          store.setCheckoutField("isProcessing", true);
          await store.processOrder(store.checkout);
          toast(TOAST_MESSAGES.success.order);
          window.location.href = "/checkout/success";
        } catch (error) {
          toast({
            ...TOAST_MESSAGES.error.order,
            description:
              error.message || TOAST_MESSAGES.error.order.description,
          });
          store.setCheckoutField("isProcessing", false);
        }
      },
    }),
    [store, toast]
  );

  // Form initializers
  const initializers = useMemo(
    () => ({
      initializeProfileForm: (user) => {
        store.setProfileForm({
          name: user?.name || "",
          email: user?.email || "",
          newsletter: user?.newsletter || false,
        });
      },
    }),
    [store]
  );
  function getuser() {
    const userData = localStorage.getItem("veneficus_user_data");
    const user = userData ? JSON.parse(userData) : null;
    return user;
  }

  return {
    ...store,
    ...handlers,
    ...initializers,
    isSubmitting: store.isSubmittingSettings,
    addressSelector: store.addressSelector,
    useAddressForm: handlers.useAddressForm,
    getuser,
  };
};
