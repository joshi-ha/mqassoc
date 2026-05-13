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

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function formatEventDate(dateStr: string, includeTime = true): string {
  const date = new Date(dateStr);
  const datePart = date.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (!includeTime) return datePart;
  const timePart = date.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
}

export function formatEventDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function isEventPast(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

export function parseTags(tagsStr: string): string[] {
  if (!tagsStr.trim()) return [];
  const separator = tagsStr.includes("|") ? "|" : ",";
  return tagsStr
    .split(separator)
    .map((t) => t.trim())
    .filter(Boolean);
}
