import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function processName(fullName: string): string {
  return fullName?.replace(/\s\d{2}[A-Z]{3}\d{4}$/, "");
}
