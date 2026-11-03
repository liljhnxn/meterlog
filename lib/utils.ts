import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address?: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(timestamp: bigint | number): string {
  if (!timestamp) return "N/A";
  const num = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  if (num === 0) return "Never";
  const date = new Date(num * 1000);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatNumber(val: bigint | number | string): string {
  if (val === undefined || val === null) return "0";
  const num = typeof val === "bigint" ? Number(val) : Number(val);
  return new Intl.NumberFormat().format(num);
}

