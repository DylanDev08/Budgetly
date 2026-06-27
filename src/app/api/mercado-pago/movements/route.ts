import { NextResponse } from "next/server";
import { hasDatabaseEnv } from "@/lib/env";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { prisma } from "@/lib/prisma";
import { decryptSecret } from "@/lib/security/encryption";
import { getNormalizedMercadoPagoMovements } from "@/lib/services/mercadoPago.service";

export async function GET() {
  const { user, error } = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error }, { status: 401 });
  }

  let accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken && hasDatabaseEnv()) {
    const account = await prisma.mercadoPagoAccount.findUnique({ where: { userId: user.id } });
    if (account) {
      accessToken = decryptSecret(account.accessTokenEncrypted);
    }
  }

  if (!accessToken) {
    return NextResponse.json(
      {
        movements: [],
        status: "missing_token",
        message: "Configura MERCADO_PAGO_ACCESS_TOKEN o conecta Mercado Pago con OAuth.",
      },
      { status: 409 },
    );
  }

  const movements = await getNormalizedMercadoPagoMovements(accessToken);

  return NextResponse.json({
    movements,
    status: "ok",
  });
}
