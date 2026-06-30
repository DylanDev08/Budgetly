import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { createAuditLog } from "@/lib/services/audit.service";
import { createExtractionForAsset } from "@/lib/services/extraction.service";
import { storeUserFile } from "@/lib/services/upload.service";

export async function POST(request: Request) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "Imagen requerida." }, { status: 400 });
  }

  try {
    const asset = await storeUserFile({ userId: auth.user.id, file, kind: "assistant_image" });
    const extraction = await createExtractionForAsset(auth.user.id, asset.id);

    await createAuditLog({
      userId: auth.user.id,
      action: "ASSISTANT_IMAGE_UPLOADED",
      entity: "uploaded_asset",
      entityId: asset.id,
      metadata: { mimeType: asset.mimeType, sizeBytes: asset.sizeBytes },
    });

    return NextResponse.json({
      success: true,
      data: {
        asset: {
          id: asset.id,
          fileName: asset.fileName,
          kind: asset.kind,
          status: asset.status,
          createdAt: asset.createdAt.toISOString(),
        },
        extraction,
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "No se pudo subir la imagen." }, { status: 400 });
  }
}
