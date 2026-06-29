import { cn } from "@/lib/utils/classNames";

export function ProgressRing({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("relative grid h-28 w-28 place-items-center rounded-full", className)}>
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(101,244,154,0.12)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="#72FFAD"
          strokeLinecap="round"
          strokeWidth="10"
          strokeDasharray={`${normalized * 3.14} 314`}
        />
      </svg>
      <div className="text-center">
        <p className="text-2xl font-semibold text-budget-text">{normalized}</p>
        {label ? <p className="text-xs text-budget-muted">{label}</p> : null}
      </div>
    </div>
  );
}
