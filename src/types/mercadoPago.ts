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

export type MercadoPagoOAuthTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user_id?: number | string;
  scope?: string;
  token_type?: string;
};

export type MercadoPagoPaymentSearchResponse = {
  results?: Array<{
    id?: number | string;
    description?: string;
    transaction_amount?: number;
    date_created?: string;
    status?: string;
    payment_type_id?: string;
    payer?: {
      email?: string;
    };
  }>;
};
