import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getPublicSupabaseEnv } from "@/lib/env";

export function createClient() {
  const { url, anonKey } = getPublicSupabaseEnv();

  if (!url || !anonKey) {
    throw new Error("Supabase public environment variables are required.");
  }

  return createBrowserClient<Database>(url, anonKey);
}
