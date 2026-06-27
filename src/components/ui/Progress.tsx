import { cn } from "@/lib/utils/classNames";

export function Progress({ value, className }: { value: number; className?: string }) {
  const width = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-budget-surface", className)}>
      <div className="h-full rounded-full bg-budget-green" style={{ width: `${width}%` }} />
    </div>
  );
}
