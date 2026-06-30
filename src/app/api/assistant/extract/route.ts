import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { createAuditLog } from "@/lib/services/audit.service";
import { createExtractionForAsset } from "@/lib/services/extraction.service";
import { idSchema } from "@/lib/validations/finance.schema";

export async function POST(request: Request) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = idSchema.safeParse(body?.uploadedAssetId);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Archivo invalido." }, { status: 400 });
  }

  try {
    const extraction = await createExtractionForAsset(auth.user.id, parsed.data);

    await createAuditLog({
      userId: auth.user.id,
      action: "ASSISTANT_EXTRACTION_CREATED",
      entity: "extracted_financial_data",
      entityId: extraction.id,
    });

    return NextResponse.json({ success: true, data: { extraction } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "No se pudo extraer datos." }, { status: 400 });
  }
}
