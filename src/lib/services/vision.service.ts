import { parseReceiptMock } from "@/lib/domain/receiptParser";

export function extractFinancialDataFromAsset(asset: {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}) {
  if ((process.env.VISION_PROVIDER ?? "mock") !== "mock") {
    return parseReceiptMock(asset);
  }

  return parseReceiptMock(asset);
}
