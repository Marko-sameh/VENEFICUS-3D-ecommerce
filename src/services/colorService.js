// src/services/colorService.js

import { API_BASE_URL } from "@/lib";

/**
 * Color Service - Handles color data fetching
 */
export const colorService = {
  /**
   * Get all available colors
   */
  getAllColors: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/all_color`, {
        method: "GET",
        headers: {
          "Api-Code": process.env.NEXT_PUBLIC_API_CODE,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle both response formats
      const colors = Array.isArray(data)
        ? data
        : data.colors || data.data || [];

      // Normalize color data
      return colors.map((color) => ({
        id: color.id,
        name: color.name,
        hex: color.hex_code || color.color,
        image: color.image ? `${API_BASE_URL}${color.image}` : null,
      }));
    } catch (error) {
      console.error("Error fetching colors:", error);
      return [];
    }
  },
};
