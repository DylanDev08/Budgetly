import { cn } from "@/lib/utils/classNames";

export function StatTrend({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warning";
}) {
  return (
    <div className="rounded-lg border border-budget-border bg-budget-surface p-3">
      <p className="text-xs text-budget-muted">{label}</p>
      <p
        className={cn(
          "mt-1 text-sm font-semibold",
          tone === "good" && "text-budget-neon",
          tone === "warning" && "text-amber-300",
          tone === "neutral" && "text-budget-text",
        )}
      >
        {value}
      </p>
    </div>
  );
}
