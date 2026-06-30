import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { createAuditLog } from "@/lib/services/audit.service";
import { confirmExtraction, rejectExtraction } from "@/lib/services/extraction.service";
import { extractionConfirmSchema } from "@/lib/validations/extraction.schema";
import { idSchema } from "@/lib/validations/finance.schema";

export async function POST(request: Request) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);

  if (body?.action === "reject") {
    const parsedId = idSchema.safeParse(body?.extractionId);

    if (!parsedId.success) {
      return NextResponse.json({ success: false, error: "Extraccion invalida." }, { status: 400 });
    }

    const extraction = await rejectExtraction(auth.user.id, parsedId.data);
    await createAuditLog({
      userId: auth.user.id,
      action: "ASSISTANT_EXTRACTION_REJECTED",
      entity: "extracted_financial_data",
      entityId: extraction.id,
    });

    return NextResponse.json({ success: true, data: { extraction } });
  }

  const parsed = extractionConfirmSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const result = await confirmExtraction({ userId: auth.user.id, ...parsed.data });

    await createAuditLog({
      userId: auth.user.id,
      action: "ASSISTANT_EXTRACTION_CONFIRMED",
      entity: "extracted_financial_data",
      entityId: parsed.data.extractionId,
      metadata: { transactionId: result.transactionId },
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "No se pudo confirmar." }, { status: 400 });
  }
}
