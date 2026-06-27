import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/classNames";

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className={cn("w-full max-w-lg rounded-lg border border-budget-border bg-budget-card shadow-soft")}>
        <div className="flex items-center justify-between border-b border-budget-border px-5 py-4">
          <h2 className="text-base font-semibold text-budget-text">{title}</h2>
          <Button aria-label="Cerrar" size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
