import { cn } from "@/lib/utils/classNames";

export function BudgetlyLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-budget-border bg-budget-dark text-base font-bold text-budget-neon shadow-glow">
        B
      </div>
      {!compact ? (
        <div>
          <p className="text-base font-semibold text-budget-text">Budgetly</p>
          <p className="text-xs font-medium text-budget-muted">Finanzas personales</p>
        </div>
      ) : null}
    </div>
  );
}
