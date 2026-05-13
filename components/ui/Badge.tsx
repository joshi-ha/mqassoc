import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "cream" | "outline" | "easy" | "medium" | "hard";
}

export function Badge({
  className,
  variant = "primary",
  ...props
}: BadgeProps) {
  const variants = {
    primary:
      "bg-[var(--color-primary)] text-white",
    cream:
      "bg-[var(--color-cream-dark)] text-[var(--color-text)] border border-[var(--color-border)]",
    outline:
      "border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent",
    easy: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    medium: "bg-amber-100 text-amber-700 border border-amber-200",
    hard: "bg-rose-100 text-rose-700 border border-rose-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium font-sans",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
