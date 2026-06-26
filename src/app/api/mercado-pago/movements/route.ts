import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    movements: [],
    status: "mock_disabled",
    message: "La sincronizacion real de Mercado Pago se implementa en fases posteriores.",
  });
}
