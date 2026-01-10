import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { APP_URL } from "@/lib/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${APP_URL}${path}`;
}
