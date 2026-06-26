import * as React from "react";
import { cn } from "@/lib/utils/classNames";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="grid gap-2 text-sm font-medium text-budget-text" htmlFor={inputId}>
        {label ? <span>{label}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 rounded-lg border border-budget-border bg-white px-3 text-sm text-budget-text outline-none transition focus:border-budget-green focus:ring-2 focus:ring-budget-green/15",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500/15",
            className,
          )}
          {...props}
        />
        {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
      </label>
    );
  },
);

Input.displayName = "Input";
