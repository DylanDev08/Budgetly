import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { createAuditLog } from "@/lib/services/audit.service";

export async function requireAdmin() {
  const { user, profile } = await requireUser();

  if (profile.role !== "admin") {
    await createAuditLog({
      userId: user.id,
      action: "ADMIN_ACCESS_DENIED",
      entity: "profile",
      entityId: profile.id,
    });

    redirect("/dashboard");
  }

  await createAuditLog({
    userId: user.id,
    action: "ADMIN_ACCESS_GRANTED",
    entity: "profile",
    entityId: profile.id,
  });

  return { user, profile };
}
