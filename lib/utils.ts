import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatPercentage(num: number, decimals: number = 1): string {
  return `${num.toFixed(decimals)}%`;
}

export function parseLocation(
  locationStr: string,
): { lat: number; lng: number } | null {
  try {
    // Parse POINT geometry: "POINT (-122.30839 47.610365)"
    const match = locationStr.match(/POINT\s*\(([^)]+)\)/);
    if (!match) return null;

    const [lng, lat] = match[1].split(" ").map(Number);
    return { lat, lng };
  } catch (error) {
    console.error("Error parsing location:", error);
    return null;
  }
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const group = String(item[key]);
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
}
