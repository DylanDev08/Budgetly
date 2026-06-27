import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";

const controls = [
  "Autenticacion con Supabase Auth.",
  "Rutas privadas protegidas por middleware cuando Supabase esta configurado.",
  "Validacion de inputs con Zod.",
  "Rate limit en endpoints sensibles.",
  "Tokens de Mercado Pago cifrados antes de guardarse.",
  "Row Level Security requerido en Supabase para aislar datos por usuario.",
];

export default function SecurityPage() {
  return (
    <>
      <PageHeader title="Seguridad" description="Controles previstos para proteger cuentas, tokens y datos financieros." />
      <div className="p-5 sm:p-8">
        <Card className="mx-auto max-w-4xl">
          <CardContent>
            <ul className="grid gap-3 text-sm leading-6 text-budget-muted">
              {controls.map((control) => (
                <li key={control} className="rounded-lg border border-budget-border bg-budget-surface p-3">
                  {control}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
