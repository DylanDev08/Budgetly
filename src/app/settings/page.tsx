import { PageHeader } from "@/components/ui/PageHeader";
import { UserSettingsForm } from "@/features/settings/UserSettingsForm";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Ajustes"
        description="Configuracion personal, limites, moneda, alertas, riesgo y estado de integraciones."
      />
      <UserSettingsForm />
    </>
  );
}
