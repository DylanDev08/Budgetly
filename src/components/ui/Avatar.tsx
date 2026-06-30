import { User } from "lucide-react";
import { cn } from "@/lib/utils/classNames";

export function Avatar({
  src,
  name,
  size = "md",
  className,
}: {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-24 w-24",
  };
  const initials = (name ?? "B")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className={cn("grid shrink-0 place-items-center overflow-hidden rounded-full border border-budget-border bg-budget-soft text-budget-neon", sizes[size], className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name ?? "Avatar"} className="h-full w-full object-cover" />
      ) : initials ? (
        <span className="text-sm font-semibold">{initials}</span>
      ) : (
        <User className="h-5 w-5" />
      )}
    </div>
  );
}
