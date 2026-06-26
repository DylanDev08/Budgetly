import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    signals: [],
    disclaimer: "Modulo educativo. No ejecuta operaciones de inversion.",
  });
}
