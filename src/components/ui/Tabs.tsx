"use client";

import { cn } from "@/lib/utils/classNames";

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={cn(
            "h-10 rounded-lg border border-budget-border px-4 text-sm font-semibold transition-colors",
            value === tab.value ? "bg-budget-green text-budget-bg" : "bg-budget-card text-budget-muted hover:bg-budget-hover hover:text-budget-text",
          )}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
