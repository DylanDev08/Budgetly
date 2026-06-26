import { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";

export function BasePage({
  title,
  description,
  icon,
  emptyTitle,
  emptyDescription,
  actions,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  actions?: ReactNode;
}) {
  return (
    <>
      <PageHeader title={title} description={description} actions={actions} />
      <div className="p-5 sm:p-8">
        <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} action={actions} />
      </div>
    </>
  );
}
