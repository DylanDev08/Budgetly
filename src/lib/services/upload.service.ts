import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { allowedImageMimeTypes, maxUploadBytes } from "@/lib/validations/upload.schema";

type StoreUserFileInput = {
  userId: string;
  file: File;
  kind: "avatar" | "assistant_image" | "receipt";
};

const bucketByKind = {
  avatar: "avatars",
  assistant_image: "assistant-uploads",
  receipt: "receipts",
};

function sanitizeFileName(name: string) {
  const extension = name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";

  return `${randomUUID()}.${extension}`;
}

function validateImage(file: File) {
  if (!allowedImageMimeTypes.includes(file.type as (typeof allowedImageMimeTypes)[number])) {
    throw new Error("Tipo de archivo no permitido. Usa JPG, PNG o WEBP.");
  }

  if (file.size > maxUploadBytes) {
    throw new Error("La imagen supera el maximo de 5MB.");
  }
}

export async function storeUserFile({ userId, file, kind }: StoreUserFileInput) {
  validateImage(file);

  const bucket = bucketByKind[kind];
  const safeName = sanitizeFileName(file.name);
  const path = `${userId}/${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      throw new Error("No se pudo guardar el archivo en Storage. Revisa el bucket de Supabase.");
    }
  }

  return prisma.uploadedAsset.create({
    data: {
      userId,
      kind,
      bucket,
      path,
      fileName: file.name.replace(/[^\w.\- ]/g, "").slice(0, 160) || safeName,
      mimeType: file.type,
      sizeBytes: file.size,
      status: process.env.SUPABASE_SERVICE_ROLE_KEY ? "uploaded" : "storage_pending",
    },
  });
}

export async function getSignedAssetUrl(bucket: string, path: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 10);

  if (error) {
    return null;
  }

  return data.signedUrl;
}
