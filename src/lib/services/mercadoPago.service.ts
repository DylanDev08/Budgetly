import type { NormalizedMercadoPagoMovement } from "@/types/mercadoPago";
import type { MercadoPagoPaymentSearchResponse } from "@/types/mercadoPago";

function normalizePayment(payment: NonNullable<MercadoPagoPaymentSearchResponse["results"]>[number]): NormalizedMercadoPagoMovement | null {
  if (!payment.id || !payment.transaction_amount || !payment.date_created) {
    return null;
  }

  return {
    externalId: `mp-${payment.id}`,
    kind: "income",
    name: payment.description || payment.payment_type_id || "Movimiento Mercado Pago",
    amount: Math.abs(payment.transaction_amount),
    category: "Mercado Pago",
    type: "unico",
    date: payment.date_created.slice(0, 10),
    source: "mercado_pago",
  };
}

export async function getNormalizedMercadoPagoMovements(accessToken: string): Promise<NormalizedMercadoPagoMovement[]> {
  const url = new URL("https://api.mercadopago.com/v1/payments/search");
  url.searchParams.set("sort", "date_created");
  url.searchParams.set("criteria", "desc");
  url.searchParams.set("limit", "30");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as MercadoPagoPaymentSearchResponse;

  if (!response.ok) {
    throw new Error("No se pudieron obtener movimientos desde Mercado Pago.");
  }

  return (payload.results ?? []).map(normalizePayment).filter((movement): movement is NormalizedMercadoPagoMovement => Boolean(movement));
}
