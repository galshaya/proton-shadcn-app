import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into a human-readable format
 * @param {string} dateString - The date string to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return "N/A";

  try {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };

    return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}
