import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userService } from "@/services/userService";
import { getAddresses } from "@/services/addressService";
import { authService } from "@/services/authService";
import { API_BASE_URL, apiClient, isValidEmail } from "@/lib";

export const useUserStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,

      // App data
      aboutData: null,
      isLoadingAbout: false,

      // User settings
      settings: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
        orderUpdates: true,
        securityAlerts: true,
        language: "en",
        timeZone: "America/New_York",
      },

      // Form states
      isSubmittingSettings: false,
      addresses: [],
      addressForm: {
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
      },
      isSubmittingAddress: false,
      creditCardForm: {
        cardNumber: "",
        expiry: "",
        cvv: "",
        name: "",
      },
      paymentMethods: [],
      isAddingPaymentMethod: false,
      profileForm: {
        name: "",
        email: "",
        newsletter: false,
      },
      isSubmittingProfile: false,
      addressSelector: {
        isAddingShipping: false,
        isAddingBilling: false,
        useShippingAddress: true,
      },
      checkout: {
        currentStep: 1,
        shippingAddress: null,
        billingAddress: null,
        shippingMethod: null,
        paymentMethod: null,
        isGuest: false,
        guestEmail: "",
        isProcessing: false,
      },
      paymentForm: {
        cardNumber: "",
        expiry: "",
        cvv: "",
        name: "",
      },
      isSubmittingPayment: false,

      // Initialize authentication and user data
      initializeAuth: () => {
        const { isInitialized } = get();
        if (isInitialized) return get().isAuthenticated;

        const authenticated = authService.isAuthenticated();
        const token = authService.getToken();
        set({ isAuthenticated: authenticated, token });

        return authenticated;
      },

      // Fetch about data from API
      fetchAboutData: async () => {
        set({ isLoadingAbout: true });
        try {
          const aboutData = await apiClient.get("/api/all_about");
          console.log("aboutData Error", aboutData);
          set({ aboutData, isLoadingAbout: false });
        } catch (error) {
          console.error("Failed to fetch about data:", error);
          set({ isLoadingAbout: false, aboutData: null });
        }
      },

      // Google OAuth login
      loginWithGoogle: async (credential) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.loginWithGoogle(credential);
          const token = authService.getToken();

          set({
            isLoading: false,
            isAuthenticated: true,
            token,
            user: result.user || null,
          });

          // Initialize user data after login
          await get().initializeUser();

          return result;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
            isAuthenticated: false,
            token: null,
            user: null,
          });
          throw error;
        }
      },

      // Initialize user data from API
      initializeUser: async () => {
        // if (get().isInitialized) return;

        set({ isLoading: true, error: null });
        try {
          const [userData, addressesData] = await Promise.all([
            userService.getUserProfile(),
            getAddresses(),
          ]);
          //

          const settings = {
            emailNotifications: userData?.emailNotifications ?? true,
            smsNotifications: userData?.smsNotifications ?? false,
            marketingEmails: userData?.marketingEmails ?? true,
            orderUpdates: userData?.orderUpdates ?? true,
            securityAlerts: userData?.securityAlerts ?? true,
            language: userData?.language ?? "en",
            timeZone: userData?.timeZone ?? "America/New_York",
          };

          // Ensure addresses is always an array
          // let normalizedAddresses = [];
          // if (Array.isArray(addressesData)) {
          //   normalizedAddresses = addressesData;
          // } else if (addressesData && typeof addressesData === "object") {
          //   // If it's an object, convert to array
          //   normalizedAddresses = Object.values(addressesData);
          // }
          //

          set({
            user: userData,
            settings,
            addresses: addressesData,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
        } catch (error) {
          set({
            error: error?.message || "Failed to load user data",
            isLoading: false,
            isInitialized: true,
          });
        }
      },

      setUser: (user) => {
        const settings = {
          emailNotifications: user?.emailNotifications ?? true,
          smsNotifications: user?.smsNotifications ?? false,
          marketingEmails: user?.marketingEmails ?? true,
          orderUpdates: user?.orderUpdates ?? true,
          securityAlerts: user?.securityAlerts ?? true,
          language: user?.language ?? "en",
          timeZone: user?.timeZone ?? "America/New_York",
        };
        set({ user, settings });
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await userService.updateProfile(profileData);
          set({ user: updatedUser, isLoading: false });
          return updatedUser;
        } catch (error) {
          set({
            error: error?.message || "Failed to update profile",
            isLoading: false,
          });
          throw error;
        }
      },

      // Global user data getters
      getUserData: () => get().user,
      getUserName: () => get().user?.name || "Guest",
      getUserEmail: () => get().user?.email || "",
      getUserAvatar: () => get().user?.avatar || null,
      isUserLoggedIn: () => !!get().user?.id,
      getAboutData: () => get().aboutData,
      getTax: () => get().aboutData[0]?.tax || 0,

      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          await userService.changePassword(currentPassword, newPassword);
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error?.message || "Failed to change password",
            isLoading: false,
          });
          throw error;
        }
      },

      updateSettings: async (newSettings, onUpdate) => {
        set({ isSubmittingSettings: true, error: null });
        try {
          const { user } = get();
          const updatedUser = { ...user, ...newSettings };

          if (typeof onUpdate === "function") {
            onUpdate(updatedUser);
          }

          set({
            settings: newSettings,
            user: updatedUser,
            isSubmittingSettings: false,
          });
        } catch (error) {
          set({
            error: error?.message || "Failed to update settings",
            isSubmittingSettings: false,
          });
          throw error;
        }
      },

      updateSettingsField: (name, value) => {
        const { settings } = get();
        set({ settings: { ...settings, [name]: value } });
      },

      setAddresses: (addresses) => {
        const { addresses: currentAddresses } = get();

        // Ensure addresses is always an array
        let addressArray = [];
        if (Array.isArray(addresses)) {
          addressArray = addresses;
        } else if (addresses && typeof addresses === "object") {
          addressArray = Object.values(addresses);
        }

        if (JSON.stringify(currentAddresses) === JSON.stringify(addressArray))
          return;

        // const normalizedAddresses = addressArray.map((addr) => ({
        //   ...addr,
        //   id: addr.id || Date.now().toString(),
        //   fullName:
        //     addr.fullName ||
        //     `${addr.firstName || ""} ${addr.lastName || ""}`.trim(),
        //   firstName: addr.firstName || addr.fullName?.split(" ")[0] || "",
        //   lastName:
        //     addr.lastName || addr.fullName?.split(" ").slice(1).join(" ") || "",
        //   address1: addr.address1 || addr.street || "",
        //   street: addr.street || addr.address1 || "",
        //   address2: addr.address2 || addr.additional_info || "",
        //   additional_info: addr.additional_info || addr.address2 || "",
        //   state: addr.state || addr.region || "",
        //   region: addr.region || addr.state || "",
        //   postalCode: addr.postalCode || addr.zipCode || "",
        //   zipCode: addr.zipCode || addr.postalCode || "",
        //   isDefault: addr.isDefault || false,
        // }));
        set({ addresses: addressArray });
      },

      setDefaultAddress: async (id, setDefaultAddressFn) => {
        try {
          const updated = await setDefaultAddressFn(id);
          set({ addresses: updated });
          return updated;
        } catch (error) {
          throw error;
        }
      },

      deleteAddress: async (id, deleteAddressFn) => {
        try {
          await deleteAddressFn(id);
          const { addresses } = get();
          set({ addresses: addresses.filter((a) => a.id !== id) });
        } catch (error) {
          throw error;
        }
      },

      setAddressForm: (formData) => set({ addressForm: formData }),

      updateAddressFormField: (name, value) => {
        const { addressForm } = get();
        set({ addressForm: { ...addressForm, [name]: value } });
      },

      submitAddressForm: (address, onSave) => {
        set({ isSubmittingAddress: true });
        const { addressForm, addresses } = get();

        const newAddress = {
          ...addressForm,
          id: address?.id || Date.now(),
          fullName: `${addressForm.firstName} ${addressForm.lastName}`,
          street: addressForm.address1,
        };

        // Update addresses in store
        if (address?.id) {
          // Update existing
          const updated = addresses.map((addr) =>
            addr.id === address.id ? newAddress : addr,
          );
          set({ addresses: updated });
        } else {
          // Add new
          set({ addresses: [...addresses, newAddress] });
        }

        onSave?.(newAddress);
        set({ isSubmittingAddress: false });
      },

      resetAddressForm: () =>
        set({
          addressForm: {
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
          },
        }),

      setCreditCardForm: (formData) => set({ creditCardForm: formData }),

      updateCreditCardFormField: (name, value) => {
        const { creditCardForm, formatCardNumber, formatExpiry } = get();
        let formattedValue = value;

        if (name === "cardNumber") {
          formattedValue = formatCardNumber(value).replace(/\s/g, "");
        } else if (name === "expiry") {
          formattedValue = formatExpiry(value);
        } else if (name === "cvv") {
          formattedValue = value.replace(/\D/g, "").substring(0, 4);
        }

        set({ creditCardForm: { ...creditCardForm, [name]: formattedValue } });
      },

      submitCreditCardForm: (onSave) => {
        const { creditCardForm, getCardType } = get();
        const cardType = getCardType(creditCardForm.cardNumber) || "Visa";
        onSave({
          ...creditCardForm,
          type: cardType,
          last4: creditCardForm.cardNumber.slice(-4),
          icon: `/images/${cardType.toLowerCase()}.png`,
        });
      },

      resetCreditCardForm: () =>
        set({
          creditCardForm: {
            cardNumber: "",
            expiry: "",
            cvv: "",
            name: "",
          },
        }),

      setPaymentMethods: (methods) => set({ paymentMethods: methods }),

      setIsAddingPaymentMethod: (isAdding) =>
        set({ isAddingPaymentMethod: isAdding }),

      addPaymentMethod: () => {
        set({ isAddingPaymentMethod: true });
      },

      removePaymentMethod: async (paymentMethodId, onUpdate) => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 300));
          const { paymentMethods } = get();
          const updatedMethods = paymentMethods.filter(
            (method) => method.id !== paymentMethodId,
          );
          set({ paymentMethods: updatedMethods });
          if (typeof onUpdate === "function") {
            onUpdate(updatedMethods);
          }
        } catch (error) {
          throw error;
        }
      },

      setDefaultPaymentMethod: async (paymentMethodId, onUpdate) => {
        if (
          !paymentMethodId ||
          (typeof paymentMethodId !== "string" &&
            typeof paymentMethodId !== "number")
        ) {
          return;
        }

        const sanitizedId = String(paymentMethodId).replace(
          /[^a-zA-Z0-9-_]/g,
          "",
        );
        if (!sanitizedId) return;

        try {
          await new Promise((resolve) => setTimeout(resolve, 300));
          const { paymentMethods } = get();
          const updatedMethods = paymentMethods.map((method) => ({
            ...method,
            isDefault: method.id === sanitizedId,
          }));
          set({ paymentMethods: updatedMethods });
          if (typeof onUpdate === "function") {
            onUpdate(updatedMethods);
          }
        } catch (error) {
          throw error;
        }
      },

      savePaymentMethod: (paymentMethod, onUpdate) => {
        const { paymentMethods } = get();
        let updatedMethods;

        if (paymentMethod.id) {
          // Update existing payment method
          updatedMethods = paymentMethods.map((method) =>
            method.id === paymentMethod.id ? paymentMethod : method,
          );
        } else {
          // Add new payment method
          updatedMethods = [
            ...paymentMethods,
            { ...paymentMethod, id: Date.now() },
          ];
        }

        set({ paymentMethods: updatedMethods, isAddingPaymentMethod: false });
        if (typeof onUpdate === "function") {
          onUpdate(updatedMethods);
        }
      },

      setProfileForm: (user) => {
        const { profileForm } = get();
        const newForm = {
          name: user?.name || "",
          email: user?.email || "",
          newsletter: user?.newsletter || false,
        };

        if (
          profileForm.name !== newForm.name ||
          profileForm.email !== newForm.email ||
          profileForm.newsletter !== newForm.newsletter
        ) {
          set({ profileForm: newForm });
        }
      },

      updateProfileFormField: (name, value) => {
        const { profileForm } = get();
        set({ profileForm: { ...profileForm, [name]: value } });
      },

      submitProfileForm: async (onUpdate) => {
        set({ isSubmittingProfile: true });
        try {
          const { profileForm, user } = get();

          // Validate and sanitize form data
          const sanitizedData = {
            ...profileForm,
            name:
              typeof profileForm.name === "string"
                ? profileForm.name.replace(/[<>"'&]/g, "").substring(0, 100)
                : "",
            email:
              typeof profileForm.email === "string"
                ? profileForm.email.replace(/[<>"'&]/g, "").substring(0, 100)
                : "",
          };

          const updatedUser = { ...user, ...sanitizedData };

          if (typeof onUpdate === "function") {
            onUpdate(updatedUser);
          }

          set({ user: updatedUser, isSubmittingProfile: false });
          return updatedUser;
        } catch (error) {
          set({ isSubmittingProfile: false });
          throw error;
        }
      },

      setAddressSelectorField: (field, value) => {
        const { addressSelector } = get();
        set({ addressSelector: { ...addressSelector, [field]: value } });
      },

      selectShippingAddress: (address, onShippingChange, onBillingChange) => {
        const { addressSelector } = get();
        onShippingChange(address);
        set({
          addressSelector: { ...addressSelector, isAddingShipping: false },
        });

        if (addressSelector.useShippingAddress) {
          onBillingChange(address);
        }
      },

      selectBillingAddress: (address, onBillingChange) => {
        const { addressSelector } = get();
        onBillingChange(address);
        set({
          addressSelector: { ...addressSelector, isAddingBilling: false },
        });
      },

      toggleUseShippingAddress: (checked, shippingAddress, onBillingChange) => {
        const { addressSelector } = get();
        set({
          addressSelector: { ...addressSelector, useShippingAddress: checked },
        });

        if (checked && shippingAddress) {
          onBillingChange(shippingAddress);
        }
      },

      handleAddressFormChange: (address, e) => {
        const { name, value } = e.target;
        return { ...address, [name]: value };
      },

      handleAddressFormSelectChange: (address, name, value) => {
        return { ...address, [name]: value };
      },

      setCheckoutField: (field, value) => {
        const { checkout } = get();
        set({ checkout: { ...checkout, [field]: value } });
      },

      initializeCheckout: (addresses, isLoggedIn) => {
        const { checkout } = get();
        const firstAddress = addresses?.[0] || null;

        // Only update if values actually changed
        if (
          checkout.shippingAddress?.id !== firstAddress?.id ||
          checkout.isGuest !== !isLoggedIn
        ) {
          set({
            checkout: {
              ...checkout,
              shippingAddress: firstAddress,
              billingAddress: firstAddress,
              isGuest: !isLoggedIn,
            },
          });
        }
      },

      validateCheckoutStep: (step, checkout) => {
        if (step === 1 && !checkout.shippingAddress)
          return "Please select or enter a shipping address.";
        if (step === 2 && !checkout.shippingMethod)
          return "Please select a shipping method.";
        if (step === 3 && !checkout.paymentMethod)
          return "Please select or enter a payment method.";
        return null;
      },

      validateGuestEmail: (isGuest, guestEmail) => {
        return isGuest && (!guestEmail || !isValidEmail(guestEmail))
          ? "Please enter a valid email address to continue."
          : null;
      },

      processOrder: async (checkout) => {
        if (
          !checkout.shippingAddress ||
          !checkout.billingAddress ||
          !checkout.shippingMethod ||
          !checkout.paymentMethod
        ) {
          throw new Error(
            "Please complete all steps before placing your order.",
          );
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { success: true };
      },

      validateGuestCheckoutEmail: (email) => {
        return isValidEmail(email);
      },

      processGuestEmail: (email, onEmailChange) => {
        onEmailChange(email);
        return { success: true };
      },

      setPaymentForm: (formData) => set({ paymentForm: formData }),

      updatePaymentFormField: (name, value) => {
        const { paymentForm } = get();
        set({ paymentForm: { ...paymentForm, [name]: value } });
      },

      formatCardNumber: (value) => {
        const cleaned = value.replace(/\D/g, "");
        const limited =
          cleaned.length > 16 ? cleaned.substring(0, 16) : cleaned;
        return limited.replace(/(\d{4})/g, "$1 ").trim();
      },

      formatExpiry: (value) => {
        const cleaned = value.replace(/\D/g, "");
        const limited = cleaned.length > 4 ? cleaned.substring(0, 4) : cleaned;
        return limited.length > 2
          ? limited.substring(0, 2) + "/" + limited.substring(2)
          : limited;
      },

      getCardType: (cardNumber) => {
        if (!cardNumber) return null;
        const firstDigit = cardNumber[0];
        const firstTwoDigits = cardNumber.substring(0, 2);

        if (firstDigit === "4") return "Visa";
        if (firstTwoDigits >= "51" && firstTwoDigits <= "55")
          return "Mastercard";
        if (firstTwoDigits === "34" || firstTwoDigits === "37")
          return "American Express";
        if (firstTwoDigits >= "60" && firstTwoDigits <= "65") return "Discover";

        return null;
      },

      submitPaymentForm: async (onSubmit) => {
        set({ isSubmittingPayment: true });
        try {
          await onSubmit();
        } finally {
          set({ isSubmittingPayment: false });
        }
      },

      resetPaymentForm: () =>
        set({
          paymentForm: {
            cardNumber: "",
            expiry: "",
            cvv: "",
            name: "",
          },
        }),

      selectPaymentMethod: (method, onSelectMethod) => {
        onSelectMethod(method);
        get().resetPaymentForm();
      },

      saveNewPaymentMethod: (onSelectMethod) => {
        const { paymentForm, getCardType } = get();
        const updatedMethod = {
          ...paymentForm,
          id: Date.now(),
          last4: paymentForm.cardNumber.substring(
            paymentForm.cardNumber.length - 4,
          ),
          type: getCardType(paymentForm.cardNumber) || "Visa",
        };
        onSelectMethod(updatedMethod);
        get().resetPaymentForm();
      },

      // Logout functionality
      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          isInitialized: false,
          settings: {
            emailNotifications: true,
            smsNotifications: false,
            marketingEmails: true,
            orderUpdates: true,
            securityAlerts: true,
            language: "en",
            timeZone: "America/New_York",
          },
          addresses: [],
          profileForm: {
            name: "",
            email: "",
            newsletter: false,
          },
          addressSelector: {
            isAddingShipping: false,
            isAddingBilling: false,
            useShippingAddress: true,
          },
          checkout: {
            currentStep: 1,
            shippingAddress: null,
            billingAddress: null,
            shippingMethod: null,
            paymentMethod: null,
            isGuest: false,
            guestEmail: "",
            isProcessing: false,
          },
          paymentForm: {
            cardNumber: "",
            expiry: "",
            cvv: "",
            name: "",
          },
        });
      },

      // Clear error state
      clearError: () => set({ error: null }),

      // Clear user data
      clearUser: () => get().logout(),
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        settings: state.settings,
        addresses: state.addresses,
        isInitialized: state.isInitialized,
        aboutData: state.aboutData,
      }),
    },
  ),
);
