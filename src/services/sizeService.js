// src/services/sizeService.js

import { API_BASE_URL } from "@/lib";

/**
 * Size Service - Handles size data fetching
 */
export const sizeService = {
  /**
   * Get all available sizes
   */
  getAllSizes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/all_size`, {
        method: "GET",
        headers: {
          "Api-Code": process.env.NEXT_PUBLIC_API_CODE,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Size API Response:", data);

      // Handle both response formats
      const sizes = Array.isArray(data)
        ? data
        : data.sizes || data.data || data || [];

      // Normalize size data
      return sizes.map((size) => ({
        id: size.id,
        name: size.name,
        abbreviation: size.abbreviation || size.name,
      }));
    } catch (error) {
      console.error("Error fetching sizes:", error);
      return [];
    }
  },
};
