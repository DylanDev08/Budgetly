import { getMissingSupabaseEnvKeys, hasSupabaseEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAuthenticatedUser() {
  if (!hasSupabaseEnv()) {
    const missing = getMissingSupabaseEnvKeys().join(", ");

    return { user: null, error: `Supabase Auth no esta configurado. Faltan: ${missing}.` };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { user: null, error: "Sesion requerida." };
  }

  return { user: data.user, error: null };
}
