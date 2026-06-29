"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PremiumMockActivate() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function activate() {
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/premium/mock-activate", { method: "POST" });
    const result = await response.json().catch(() => ({}));

    setLoading(false);
    setMessage(response.ok ? "Premium mock activado para tu perfil." : result.error ?? "No se pudo activar Premium.");
  }

  return (
    <div className="grid gap-3 rounded-lg border border-budget-border bg-budget-surface p-4">
      <Button onClick={activate} disabled={loading}>
        <Sparkles className="h-4 w-4" />
        {loading ? "Activando..." : "Activar Premium mock"}
      </Button>
      {message ? <p className="text-sm text-budget-muted">{message}</p> : null}
    </div>
  );
}
