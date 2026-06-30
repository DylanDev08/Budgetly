"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/ui/FileDropzone";

export type Extraction = {
  id: string;
  amount: number | null;
  currency: string | null;
  date: string | null;
  merchant: string | null;
  concept: string | null;
  category: string | null;
  kind: string | null;
  type: string | null;
  confidence: number;
  status: string;
};

export function ImageUploadBox({
  onExtraction,
}: {
  onExtraction: (extraction: Extraction) => void;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function upload(file: File) {
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/assistant/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json().catch(() => ({}));

    setLoading(false);

    if (!response.ok) {
      setMessage(result.error ?? "No se pudo subir la imagen.");
      return;
    }

    onExtraction(result.data.extraction);
    setMessage("Imagen procesada. Revisa los datos detectados antes de guardar.");
  }

  return (
    <div className="grid gap-3">
      <FileDropzone
        label={loading ? "Procesando imagen..." : "Subir ticket, recibo o screenshot"}
        helper="JPG, PNG o WEBP. Maximo 5MB. Nada se registra como movimiento sin confirmacion."
        onFile={upload}
      />
      {message ? <p className="text-sm text-budget-muted">{message}</p> : null}
    </div>
  );
}
