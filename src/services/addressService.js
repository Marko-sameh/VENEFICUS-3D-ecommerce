import { apiClient } from "@/lib/api-client";
import {
  validateId,
  sanitizeInput,
  createNormalizedError,
} from "@/lib/security";
import { US_STATES, SUCCESS_MESSAGES, ERROR_CODES } from "@/lib/constants";

/**
 * Address service for managing user addresses
 */

// Unified address methods
export const getAddresses = async (params = {}) => {
  try {
    const response = await apiClient.get("/api/all_address");
    return response;
  } catch (error) {
    throw createNormalizedError(500, "Failed to fetch addresses");
  }
};

export const getAddress = async (id) => {
  if (!validateId(id)) throw createNormalizedError(400, "Invalid address ID");

  try {
    return await apiClient.get(`/api/address/${id}`);
  } catch (error) {
    throw createNormalizedError(404, "Address not found");
  }
};

export const addAddress = async (addressData) => {
  // Validate required fields
  const requiredFields = ["street", "city", "country", "user_id"];
  const missingFields = requiredFields.filter((field) => !addressData[field]);

  if (missingFields.length > 0) {
    throw createNormalizedError(
      400,
      `Required fields missing: ${missingFields.join(", ")}`
    );
  }

  try {
    const formData = new FormData();
    formData.append("user_id", String(addressData.user_id));
    formData.append("street", sanitizeInput(addressData.street));
    formData.append(
      "region",
      sanitizeInput(addressData.region || addressData.state || "")
    );
    formData.append("city", sanitizeInput(addressData.city));
    formData.append("country", sanitizeInput(addressData.country));
    formData.append("phone", sanitizeInput(addressData.phone || ""));
    formData.append(
      "additional_info",
      sanitizeInput(addressData.additional_info || "")
    );
    formData.append("postal_code", sanitizeInput(addressData.postalCode || ""));
    formData.append("first_name", sanitizeInput(addressData.firstName || ""));
    formData.append("last_name", sanitizeInput(addressData.lastName || ""));
    formData.append("company", sanitizeInput(addressData.company || ""));

    const response = await apiClient.post("/api/add_address", formData);

    return response;
  } catch (error) {
    throw createNormalizedError(
      500,
      `Failed to add address: ${error?.message || "Unknown error"}`
    );
  }
};

export const updateAddress = async (addressId, addressData) => {
  if (!addressId) throw createNormalizedError(400, "Invalid address ID");

  if (!addressData || !addressData.user_id) {
    throw createNormalizedError(400, "User ID is required");
  }

  try {
    const params = new URLSearchParams();
    params.append("user_id", String(addressData.user_id));
    params.append("street", sanitizeInput(addressData.street || ""));
    params.append("region", sanitizeInput(addressData.region || addressData.state || ""));
    params.append("city", sanitizeInput(addressData.city || ""));
    params.append("country", sanitizeInput(addressData.country || ""));
    params.append("phone", sanitizeInput(addressData.phone || ""));
    params.append("additional_info", sanitizeInput(addressData.additional_info || ""));
    params.append("postal_code", sanitizeInput(addressData.postalCode || ""));

    const response = await apiClient.patch(
      `/api/update_address/${addressId}?${params.toString()}`,
      {}
    );

    return response;
  } catch (error) {
    throw createNormalizedError(
      500,
      `Failed to update address: ${error?.message || "Unknown error"}`
    );
  }
};

export const setDefaultAddress = async (addressId) => {
  if (!addressId) throw createNormalizedError(400, "Invalid address ID");

  try {
    const response = await apiClient.put(
      `/api/address/${addressId}/default`,
      {}
    );
    return response;
  } catch (error) {
    throw createNormalizedError(500, "Failed to set default address");
  }
};

export const deleteAddress = async (addressId) => {
  if (!addressId) throw createNormalizedError(400, "Invalid address ID");

  try {
    const userData = localStorage.getItem("veneficus_user_data");
    const user = userData ? JSON.parse(userData) : null;

    const payload = {
      user_id: user?.id || "1",
    };

    const response = await apiClient.delete(
      `/api/delete_address/${addressId}`,
      { data: payload }
    );
    return response;
  } catch (error) {
    console.error("Delete error:", error);
    throw createNormalizedError(500, "Failed to delete address");
  }
};
