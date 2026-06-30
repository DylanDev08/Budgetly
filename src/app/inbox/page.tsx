import { Inbox } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SmartInbox } from "@/features/inbox/SmartInbox";

export default function InboxPage() {
  return (
    <>
      <PageHeader
        title="Smart Inbox"
        description="Pendientes inteligentes: fotos, extracciones, obligaciones, comprobantes y recomendaciones."
        icon={Inbox}
      />
      <main className="p-5 sm:p-8">
        <SmartInbox />
      </main>
    </>
  );
}
