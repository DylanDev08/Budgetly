import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/services/audit.service";
import { getSignedAssetUrl, storeUserFile } from "@/lib/services/upload.service";

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
    const asset = await storeUserFile({ userId: auth.user.id, file, kind: "avatar" });
    const storageRef = `${asset.bucket}:${asset.path}`;
    const signedUrl = await getSignedAssetUrl(asset.bucket, asset.path);
    const profile = await prisma.profile.update({
      where: { userId: auth.user.id },
      data: { avatarUrl: storageRef },
    });

    await createAuditLog({
      userId: auth.user.id,
      action: "AVATAR_UPLOADED",
      entity: "profile",
      entityId: profile.id,
      metadata: { assetId: asset.id },
    });

    return NextResponse.json({
      success: true,
      data: {
        avatarUrl: profile.avatarUrl,
        signedUrl,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "No se pudo subir avatar." }, { status: 400 });
  }
}

export async function DELETE() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const profile = await prisma.profile.update({
    where: { userId: auth.user.id },
    data: { avatarUrl: null },
  });

  await createAuditLog({
    userId: auth.user.id,
    action: "PROFILE_UPDATED",
    entity: "profile",
    entityId: profile.id,
    metadata: { avatarUrl: null },
  });

  return NextResponse.json({ success: true, data: { avatarUrl: null } });
}
