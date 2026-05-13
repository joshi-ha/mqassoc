import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateString: string): {
  day: string;
  month: string;
  year: string;
} {
  const date = new Date(dateString);
  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: date.toLocaleDateString("en-AU", { month: "short" }).toUpperCase(),
    year: date.getFullYear().toString(),
  };
}

export function isUpcoming(dateString: string): boolean {
  return new Date(dateString) >= new Date();
}

export function difficultyLabel(
  difficulty?: "easy" | "medium" | "hard"
): string {
  const map = { easy: "1st Year", medium: "2nd–3rd Year", hard: "Advanced" };
  return difficulty ? map[difficulty] : "All Levels";
}
