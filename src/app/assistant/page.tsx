import { Bot } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AssistantChat } from "@/features/assistant/AssistantChat";

export default function AssistantPage() {
  return (
    <>
      <PageHeader title="Bot asistente" description="Asistente financiero local basado en tus datos reales." icon={Bot} />
      <AssistantChat />
    </>
  );
}
