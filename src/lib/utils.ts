import { API_BASE_URL, PUBLIC_SERVER_URL } from "@/config";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (
  imagePath: string | null | undefined,
  options?: { name?: string }
) => {
  if (!imagePath) {
    if (options?.name) {
      const initials = options.name.toUpperCase().slice(0, 2);
      return `https://ui-avatars.com/api?name=${encodeURIComponent(initials)}&size=128`;
    }
    return "https://ui-avatars.com/api?name=TripMate";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const baseUrl = PUBLIC_SERVER_URL || API_BASE_URL.replace("/api/v1", "");
  return `${baseUrl}/${imagePath}`;
};
