import * as React from "react";
import { cn } from "@/lib/utils/classNames";

type BadgeTone = "neutral" | "success" | "warning" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "border border-budget-border bg-budget-surface text-budget-muted",
  success: "border border-budget-border bg-budget-soft text-budget-neon",
  warning: "border border-amber-500/25 bg-amber-500/12 text-amber-300",
  danger: "border border-red-500/25 bg-red-500/12 text-red-300",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
