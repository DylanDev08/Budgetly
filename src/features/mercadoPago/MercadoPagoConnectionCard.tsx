"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type MercadoPagoAccountState = {
  connected: boolean;
  status: string;
  accountEmail?: string | null;
  lastSync?: string | null;
};

export function MercadoPagoConnectionCard() {
  const queryClient = useQueryClient();
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const accountQuery = useQuery<MercadoPagoAccountState>({
    queryKey: ["/api/mercado-pago/account"],
    queryFn: async () => {
      const response = await fetch("/api/mercado-pago/account");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "No se pudo validar Mercado Pago.");
      }

      return result;
    },
  });

  async function syncMovements() {
    setSyncing(true);
    setSyncMessage(null);

    try {
      const response = await fetch("/api/mercado-pago/sync", { method: "POST" });
      const result = await response.json();

      if (!response.ok) {
        setSyncMessage(result.error ?? "No se pudo sincronizar Mercado Pago.");
        return;
      }

      setSyncMessage(`Sincronizacion lista. Importados: ${result.imported ?? 0}. Omitidos: ${result.skipped ?? 0}.`);
      await queryClient.invalidateQueries({ queryKey: ["/api/mercado-pago/account"] });
    } catch {
      setSyncMessage("No se pudo conectar con el backend de sincronizacion.");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Conexion personal de Mercado Pago</CardTitle>
          <Badge tone={accountQuery.data?.connected ? "success" : "warning"}>
            {accountQuery.data?.connected ? "Conectado" : "No conectado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="rounded-lg bg-budget-soft p-3 text-budget-neon">
            <CreditCard className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="grid flex-1 gap-4">
            <p className="text-sm leading-6 text-budget-muted">
              La conexion se inicia desde el backend para no exponer tokens. Cuando agregues credenciales reales,
              Budgetly va a redirigir al OAuth de Mercado Pago y guardar la vinculacion por usuario.
            </p>
            <div className="grid gap-1 rounded-lg border border-budget-border bg-budget-surface p-3 text-sm text-budget-muted">
              <p>Estado: {accountQuery.data?.status ?? "validando"}</p>
              <p>Cuenta: {accountQuery.data?.accountEmail ?? "sin vincular"}</p>
              <p>Ultima sync: {accountQuery.data?.lastSync ? new Date(accountQuery.data.lastSync).toLocaleString("es-AR") : "sin sincronizar"}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/api/mercado-pago/connect"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-budget-green px-4 text-sm font-semibold text-budget-bg shadow-glow transition-colors hover:bg-budget-neon"
              >
                Conectar Mercado Pago
              </Link>
              <button
                type="button"
                onClick={syncMovements}
                disabled={syncing}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-budget-border bg-budget-card px-4 text-sm font-medium text-budget-text transition-colors hover:bg-budget-hover"
              >
                {syncing ? "Sincronizando..." : "Sincronizar movimientos"}
              </button>
            </div>
            {syncMessage ? <p className="text-sm font-medium text-budget-muted">{syncMessage}</p> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
