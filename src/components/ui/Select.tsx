import * as React from "react";
import { cn } from "@/lib/utils/classNames";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <label className="grid gap-2 text-sm font-medium text-budget-text" htmlFor={selectId}>
        {label ? <span>{label}</span> : null}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-11 rounded-lg border border-budget-border bg-budget-surface px-3 text-sm text-budget-text outline-none transition focus:border-budget-green focus:ring-2 focus:ring-budget-green/20",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error ? <span className="text-xs font-medium text-red-400">{error}</span> : null}
      </label>
    );
  },
);

Select.displayName = "Select";
