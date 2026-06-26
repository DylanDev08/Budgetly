import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function StatCard({
  title,
  value,
  helper,
  icon: Icon,
}: {
  title: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-budget-muted">{title}</p>
          <p className="mt-3 text-2xl font-semibold text-budget-text">{value}</p>
          <p className="mt-2 text-sm text-budget-muted">{helper}</p>
        </div>
        <div className="rounded-lg bg-budget-soft p-2.5 text-budget-dark">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}
