import { z } from "zod";
import type { MercadoPagoOAuthTokenResponse } from "@/types/mercadoPago";

const tokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number().optional(),
  user_id: z.union([z.string(), z.number()]).optional(),
  scope: z.string().optional(),
  token_type: z.string().optional(),
});

function getOAuthCredentials() {
  const clientId = process.env.MERCADO_PAGO_CLIENT_ID;
  const clientSecret = process.env.MERCADO_PAGO_CLIENT_SECRET;
  const redirectUri = process.env.MERCADO_PAGO_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Mercado Pago OAuth environment variables are required.");
  }

  return { clientId, clientSecret, redirectUri };
}

export async function exchangeMercadoPagoCode(code: string): Promise<MercadoPagoOAuthTokenResponse> {
  const { clientId, clientSecret, redirectUri } = getOAuthCredentials();
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  const response = await fetch("https://api.mercadopago.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error("Mercado Pago rejected the authorization code.");
  }

  return tokenResponseSchema.parse(payload);
}

export async function refreshMercadoPagoToken(refreshToken: string): Promise<MercadoPagoOAuthTokenResponse> {
  const { clientId, clientSecret } = getOAuthCredentials();
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch("https://api.mercadopago.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error("Mercado Pago rejected the refresh token.");
  }

  return tokenResponseSchema.parse(payload);
}
