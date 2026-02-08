import { API_BASE_URL, PUBLIC_SERVER_URL } from "@/config";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return null;
  // If imagePath already starts with http, return as is
  if (imagePath.startsWith("http")) return imagePath;
  // Otherwise, construct URL from base server URL
  const baseUrl = PUBLIC_SERVER_URL || API_BASE_URL.replace("/api/v1", "");
  return `${baseUrl}/${imagePath}`;
};
