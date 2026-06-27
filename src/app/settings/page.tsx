import { Save } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Ajustes"
        description="Configuracion personal, limites, moneda, alertas, riesgo y estado de integraciones."
        actions={<Button disabled title="Los ajustes persistidos por usuario se activan en la fase de perfiles."><Save className="h-4 w-4" />Guardar ajustes</Button>}
      />
      <div className="grid gap-5 p-5 sm:p-8 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Perfil y preferencias</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Input label="Nombre" placeholder="Tu nombre" />
            <Input label="Email" type="email" placeholder="tu@email.com" />
            <Select label="Moneda principal" defaultValue="ARS">
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
              <option value="BRL">BRL</option>
              <option value="EUR">EUR</option>
            </Select>
            <Select label="Modo de alerta" defaultValue="normal">
              <option value="serio">Serio</option>
              <option value="normal">Normal</option>
              <option value="humoristico">Humoristico/directo</option>
            </Select>
            <Select label="Perfil de riesgo" defaultValue="moderado">
              <option value="conservador">Conservador</option>
              <option value="moderado">Moderado</option>
              <option value="agresivo">Agresivo</option>
            </Select>
            <Select label="Tema visual" defaultValue="light">
              <option value="light">Claro</option>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limites financieros</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input label="Presupuesto mensual general" type="number" min="0" />
            <Input label="Limite semanal" type="number" min="0" />
            <Input label="Limite de gastos variables" type="number" min="0" />
            <Input label="Meta de ahorro mensual" type="number" min="0" />
            <div className="flex items-center justify-between rounded-lg border border-budget-border p-3">
              <span className="text-sm font-medium text-budget-text">Mercado Pago</span>
              <Badge tone="warning">No conectado</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
