import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    data: {
      received: true,
      mode: "stub",
      message: "Webhook premium preparado. Validacion de firma pendiente antes de cobros reales.",
    },
  });
}
