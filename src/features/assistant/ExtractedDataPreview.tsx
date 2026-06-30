"use client";

import { useState } from "react";
import { CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Extraction } from "@/features/assistant/ImageUploadBox";

export function ExtractedDataPreview({
  extraction,
  onDone,
}: {
  extraction: Extraction;
  onDone: (message: string) => void;
}) {
  const [amount, setAmount] = useState(String(extraction.amount ?? ""));
  const [date, setDate] = useState(extraction.date ?? new Date().toISOString().slice(0, 10));
  const [merchant, setMerchant] = useState(extraction.merchant ?? "");
  const [concept, setConcept] = useState(extraction.concept ?? "");
  const [category, setCategory] = useState(extraction.category ?? "Otros / Sin clasificar");
  const [kind, setKind] = useState(extraction.kind ?? "expense");
  const [type, setType] = useState(extraction.type ?? "variable");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function confirm() {
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/assistant/confirm-extraction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        extractionId: extraction.id,
        amount: Number(amount),
        currency: extraction.currency ?? "ARS",
        date,
        merchant,
        concept,
        category,
        kind,
        type,
      }),
    });
    const result = await response.json().catch(() => ({}));

    setLoading(false);

    if (!response.ok) {
      setMessage(result.error ?? "No se pudo confirmar.");
      return;
    }

    onDone(`Movimiento creado desde imagen. Comprobante ${result.data.invoiceNumber}.`);
  }

  async function reject() {
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/assistant/confirm-extraction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", extractionId: extraction.id }),
    });

    setLoading(false);
    onDone(response.ok ? "Extraccion descartada." : "No se pudo descartar la extraccion.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos detectados en la imagen</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="rounded-lg border border-budget-border bg-budget-surface p-3 text-sm text-budget-muted">
          Confianza: {Math.round(extraction.confidence * 100)}%. Revisa y confirma antes de registrar.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Monto" type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />
          <Input label="Fecha" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <Input label="Comercio" value={merchant} onChange={(event) => setMerchant(event.target.value)} />
          <Input label="Concepto" value={concept} onChange={(event) => setConcept(event.target.value)} />
          <Input label="Categoria" value={category} onChange={(event) => setCategory(event.target.value)} />
          <Select label="Tipo de movimiento" value={kind} onChange={(event) => setKind(event.target.value)}>
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </Select>
          <Select label="Frecuencia" value={type} onChange={(event) => setType(event.target.value)}>
            <option value="variable">Variable</option>
            <option value="unico">Unico</option>
            <option value="mensual">Mensual</option>
            <option value="semanal">Semanal</option>
            <option value="fijo">Fijo</option>
          </Select>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={confirm} disabled={loading}>
            <CheckCircle className="h-4 w-4" />
            Confirmar y guardar
          </Button>
          <Button variant="secondary" onClick={reject} disabled={loading}>
            <Trash2 className="h-4 w-4" />
            Descartar
          </Button>
        </div>
        {message ? <p className="text-sm text-red-300">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
