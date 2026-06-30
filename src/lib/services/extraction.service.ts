import type { Prisma } from "@prisma/client";
import { getInvoiceType } from "@/lib/domain/invoiceEngine";
import { prisma } from "@/lib/prisma";
import { buildInternalInvoiceNumber } from "@/lib/services/invoice.service";
import { extractFinancialDataFromAsset } from "@/lib/services/vision.service";

function decimal(value: { toString(): string } | null | undefined) {
  return value === null || value === undefined ? null : Number(value.toString());
}

function toDate(value?: string | null) {
  return value ? new Date(value) : null;
}

export async function createExtractionForAsset(userId: string, uploadedAssetId: string) {
  const asset = await prisma.uploadedAsset.findFirst({
    where: { id: uploadedAssetId, userId },
  });

  if (!asset) {
    throw new Error("Archivo no encontrado.");
  }

  const extracted = extractFinancialDataFromAsset(asset);

  const record = await prisma.extractedFinancialData.create({
    data: {
      userId,
      uploadedAssetId: asset.id,
      amount: extracted.amount,
      currency: extracted.currency,
      date: toDate(extracted.date),
      merchant: extracted.merchant,
      concept: extracted.concept,
      category: extracted.category,
      kind: extracted.kind,
      type: extracted.type,
      confidence: extracted.confidence,
      rawText: extracted.rawText,
      status: extracted.confidence >= 0.75 && extracted.amount ? "pending_confirmation" : "needs_review",
    },
  });

  await prisma.clientActivity.create({
    data: {
      userId,
      action: "ASSISTANT_EXTRACTION_CREATED",
      title: "Datos extraidos desde imagen",
      summary: record.concept,
      metadata: { confidence: record.confidence.toString() } as Prisma.InputJsonObject,
    },
  }).catch(() => null);

  return serializeExtraction(record);
}

export async function confirmExtraction(input: {
  userId: string;
  extractionId: string;
  amount: number;
  currency: string;
  date: string;
  merchant?: string | null;
  concept: string;
  category: string;
  kind: "income" | "expense";
  type: string;
}) {
  const extraction = await prisma.extractedFinancialData.findFirst({
    where: { id: input.extractionId, userId: input.userId },
  });

  if (!extraction) {
    throw new Error("Extraccion no encontrada.");
  }

  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        userId: input.userId,
        kind: input.kind,
        name: input.concept,
        amount: input.amount,
        category: input.category,
        type: input.type,
        source: "manual",
        date: new Date(input.date),
        note: input.merchant ? `Detectado desde foto: ${input.merchant}` : "Detectado desde foto",
      },
    });

    const invoice = await tx.invoice.create({
      data: {
        userId: input.userId,
        transactionId: transaction.id,
        invoiceNumber: buildInternalInvoiceNumber(),
        type: getInvoiceType(input.kind),
        date: new Date(input.date),
        amount: input.amount,
        concept: input.concept,
        category: input.category,
        source: "assistant_image",
      },
    });

    await tx.transaction.update({
      where: { id: transaction.id },
      data: { invoiceId: invoice.id },
    });

    const updatedExtraction = await tx.extractedFinancialData.update({
      where: { id: extraction.id },
      data: {
        amount: input.amount,
        currency: input.currency,
        date: new Date(input.date),
        merchant: input.merchant,
        concept: input.concept,
        category: input.category,
        kind: input.kind,
        type: input.type,
        status: "confirmed",
        confirmedAt: new Date(),
        transactionId: transaction.id,
      },
    });

    await tx.clientActivity.create({
      data: {
        userId: input.userId,
        action: "ASSISTANT_EXTRACTION_CONFIRMED",
        title: "Extraccion confirmada",
        summary: input.concept,
        metadata: { transactionId: transaction.id },
      },
    });

    return {
      extraction: serializeExtraction(updatedExtraction),
      transactionId: transaction.id,
      invoiceNumber: invoice.invoiceNumber,
    };
  });
}

export async function rejectExtraction(userId: string, extractionId: string) {
  const existing = await prisma.extractedFinancialData.findFirst({
    where: { id: extractionId, userId },
  });

  if (!existing) {
    throw new Error("Extraccion no encontrada.");
  }

  const extraction = await prisma.extractedFinancialData.update({
    where: { id: extractionId },
    data: { status: "rejected" },
  });

  return serializeExtraction(extraction);
}

export function serializeExtraction(extraction: {
  id: string;
  uploadedAssetId: string;
  amount: { toString(): string } | null;
  currency: string | null;
  date: Date | null;
  merchant: string | null;
  concept: string | null;
  category: string | null;
  kind: string | null;
  type: string | null;
  confidence: { toString(): string };
  rawText: string | null;
  status: string;
  confirmedAt: Date | null;
  transactionId: string | null;
  createdAt: Date;
}) {
  return {
    id: extraction.id,
    uploadedAssetId: extraction.uploadedAssetId,
    amount: decimal(extraction.amount),
    currency: extraction.currency,
    date: extraction.date?.toISOString().slice(0, 10) ?? null,
    merchant: extraction.merchant,
    concept: extraction.concept,
    category: extraction.category,
    kind: extraction.kind,
    type: extraction.type,
    confidence: Number(extraction.confidence.toString()),
    rawText: extraction.rawText,
    status: extraction.status,
    confirmedAt: extraction.confirmedAt?.toISOString() ?? null,
    transactionId: extraction.transactionId,
    createdAt: extraction.createdAt.toISOString(),
  };
}
