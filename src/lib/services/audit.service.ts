import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CreateAuditLogInput = {
  userId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Prisma.InputJsonValue;
};

const sensitiveKeys = new Set(["password", "token", "accessToken", "refreshToken", "secret", "authorization"]);

function sanitizeMetadata(metadata: Prisma.InputJsonValue | undefined): Prisma.InputJsonValue | undefined {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return metadata;
  }

  return Object.fromEntries(
    Object.entries(metadata).filter(([key]) => !sensitiveKeys.has(key)),
  ) as Prisma.InputJsonValue;
}

export async function createAuditLog({ userId, action, entity, entityId, metadata }: CreateAuditLogInput) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        metadata: sanitizeMetadata(metadata),
      },
    });
  } catch {
    // Audit logs must not break the user flow during first-time DB setup.
  }
}
