export function getPublicSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function hasSupabaseEnv() {
  const { url, anonKey } = getPublicSupabaseEnv();
  return Boolean(url && anonKey);
}

export function hasDatabaseEnv() {
  return Boolean(process.env.DATABASE_URL);
}

export function getAppUrl() {
  return process.env.APP_URL ?? "http://localhost:3000";
}
