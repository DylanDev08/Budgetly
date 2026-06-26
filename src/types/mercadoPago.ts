import type { TransactionKind, TransactionSource, TransactionType } from "@/types/finance";

export type NormalizedMercadoPagoMovement = {
  externalId: string;
  kind: TransactionKind;
  name: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string;
  source: Extract<TransactionSource, "mercado_pago">;
};
