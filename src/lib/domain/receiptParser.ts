export type ExtractedFinancialData = {
  amount?: number;
  currency?: "ARS" | "USD";
  date?: string;
  merchant?: string;
  concept?: string;
  category?: string;
  kind?: "income" | "expense";
  type?: "fijo" | "mensual" | "semanal" | "variable" | "unico";
  confidence: number;
  rawText?: string;
};

export function parseReceiptMock(input: { fileName: string; mimeType: string; sizeBytes: number }): ExtractedFinancialData {
  const lowerName = input.fileName.toLowerCase();
  const amountMatch = lowerName.match(/(\d{3,})/);
  const amount = amountMatch ? Number(amountMatch[1]) : undefined;
  const looksLikeIncome = lowerName.includes("transfer") || lowerName.includes("ingreso") || lowerName.includes("cobro");
  const merchant = lowerName.includes("mercado") ? "Mercado" : lowerName.includes("ypf") ? "YPF" : "Comercio detectado";

  return {
    amount,
    currency: "ARS",
    date: new Date().toISOString().slice(0, 10),
    merchant,
    concept: amount ? `Comprobante ${merchant}` : "Comprobante pendiente de completar",
    category: looksLikeIncome ? "Ingresos / Transferencias" : "Otros / Sin clasificar",
    kind: looksLikeIncome ? "income" : "expense",
    type: "variable",
    confidence: amount ? 0.82 : 0.52,
    rawText: `mock:${input.fileName}:${input.mimeType}:${input.sizeBytes}`,
  };
}
