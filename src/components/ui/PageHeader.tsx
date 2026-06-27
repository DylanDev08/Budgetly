import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  description,
  actions,
  icon: Icon,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-budget-border bg-budget-bg px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3">
        {Icon ? (
          <div className="mt-0.5 rounded-lg border border-budget-border bg-budget-soft p-2 text-budget-neon">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        ) : null}
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-budget-text">{title}</h1>
          {description ? <p className="mt-2 text-sm text-budget-muted">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
