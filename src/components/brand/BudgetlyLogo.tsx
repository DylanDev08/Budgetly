import { cn } from "@/lib/utils/classNames";

export function BudgetlyLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        className="h-11 w-11 shrink-0 drop-shadow-[0_0_24px_rgba(45,211,111,0.24)]"
        viewBox="0 0 48 48"
        role="img"
        aria-label="Budgetly"
      >
        <rect width="48" height="48" rx="14" fill="#06110A" />
        <path
          d="M14 31.5V12h11.2c5.2 0 8.1 2.5 8.1 6.3 0 2.4-1.2 4.2-3.1 5.1 2.8.8 4.5 2.9 4.5 6 0 4.5-3.5 7.6-9.4 7.6H18.5a4.5 4.5 0 0 1-4.5-5.5Z"
          fill="#15803D"
        />
        <path
          d="M19.5 20.7h5.1c1.8 0 2.9-.9 2.9-2.3 0-1.5-1.1-2.4-2.9-2.4h-5.1v4.7Zm0 11.2h5.9c2.1 0 3.4-1.1 3.4-2.9s-1.3-2.8-3.4-2.8h-5.9v5.7Z"
          fill="#F8FAFC"
        />
        <path
          d="M12.8 34.9c8.7 2.8 16.2 1.3 22.4-4.9"
          fill="none"
          stroke="#65F49A"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path d="M34.8 25.1v5.5h-5.5" fill="none" stroke="#65F49A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      </svg>
      {!compact ? (
        <div>
          <p className="text-base font-semibold tracking-normal text-budget-text">Budgetly</p>
          <p className="text-xs font-medium text-budget-muted">Finanzas personales</p>
        </div>
      ) : null}
    </div>
  );
}
