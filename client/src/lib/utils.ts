import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a human-readable string
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a price to a currency string
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Truncates a string to a specified length
 */
export function truncateString(str: string, maxLength: number = 100): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

/**
 * Returns a user's initials from their full name
 */
export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

/**
 * Returns the appropriate status color class for a given status
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "booked":
      return "bg-slate-500"; // Grey
    case "sample_collected":
      return "bg-blue-500"; // Blue
    case "processing":
      return "bg-blue-800"; // Dark blue
    case "analyzing":
      return "bg-yellow-500"; // Yellow
    case "completed":
      return "bg-green-500"; // Green
    default:
      return "bg-slate-400";
  }
}

/**
 * Returns the severity color for test results
 */
export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "normal":
      return "text-green-600 dark:text-green-400";
    case "low":
      return "text-amber-600 dark:text-amber-400";
    case "high":
      return "text-orange-600 dark:text-orange-400";
    case "critical":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-slate-600 dark:text-slate-400";
  }
}
