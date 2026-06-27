import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";

const sections = [
  {
    title: "Datos personales",
    body: "Budgetly usa datos de perfil, configuracion financiera y movimientos para mostrar metricas personales. La app no debe vender ni publicar informacion financiera del usuario.",
  },
  {
    title: "Integraciones externas",
    body: "Las credenciales de Mercado Pago se procesan solo en backend. Los access tokens y refresh tokens deben cifrarse antes de persistirse.",
  },
  {
    title: "Minimizacion de datos",
    body: "La app guarda solo la informacion necesaria para presupuesto, movimientos, comprobantes internos, metas y sincronizacion financiera.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacidad" description="Politica operativa de datos personales e integraciones." />
      <div className="p-5 sm:p-8">
        <Card className="mx-auto max-w-4xl">
          <CardContent className="grid gap-6">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-base font-semibold text-budget-text">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-budget-muted">{section.body}</p>
              </section>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
