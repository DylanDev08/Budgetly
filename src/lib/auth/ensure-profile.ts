import type { User } from "@supabase/supabase-js";
import { ensureUserProfile } from "@/lib/services/profile.service";

export async function ensureProfile(user: User) {
  return ensureUserProfile({
    userId: user.id,
    fullName: user.user_metadata.full_name ?? user.user_metadata.name ?? user.email ?? "Usuario Budgetly",
    email: user.email ?? "",
  });
}
