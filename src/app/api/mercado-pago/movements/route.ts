import { NextResponse } from "next/server";
import { hasDatabaseEnv } from "@/lib/env";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { prisma } from "@/lib/prisma";
import { decryptSecret } from "@/lib/security/encryption";
import { getMockMercadoPagoMovements, getNormalizedMercadoPagoMovements } from "@/lib/services/mercadoPago.service";

export async function GET() {
  const { user, error } = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error }, { status: 401 });
  }

  let accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken && hasDatabaseEnv()) {
    const account = await prisma.mercadoPagoAccount.findUnique({ where: { userId: user.id } });
    if (account?.accessTokenEncrypted) {
      accessToken = decryptSecret(account.accessTokenEncrypted);
    }
  }

  if (!accessToken) {
    return NextResponse.json({
      movements: getMockMercadoPagoMovements(),
      status: "mock",
      message: "Movimientos mock: Mercado Pago real todavia no tiene token configurado.",
    });
  }

  const movements = await getNormalizedMercadoPagoMovements(accessToken);

  return NextResponse.json({
    movements,
    status: "ok",
  });
}
