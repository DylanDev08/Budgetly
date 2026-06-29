import { redirect } from "next/navigation";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await ensureProfile(user);

  return { user, profile };
}
