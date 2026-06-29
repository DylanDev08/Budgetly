export function getPublicSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function getMissingSupabaseEnvKeys() {
  const { url, anonKey } = getPublicSupabaseEnv();
  const missing = [];

  if (!url) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!anonKey) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return missing;
}

export function hasSupabaseEnv() {
  return getMissingSupabaseEnvKeys().length === 0;
}

export function hasDatabaseEnv() {
  return Boolean(process.env.DATABASE_URL);
}

export function getAppUrl() {
  return process.env.APP_URL ?? "http://localhost:3000";
}
