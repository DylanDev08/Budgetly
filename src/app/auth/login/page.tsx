import { redirect } from "next/navigation";
import { BudgetlyLogo } from "@/components/brand/BudgetlyLogo";
import { LoginForm } from "@/features/auth/LoginForm";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profile = await ensureProfile(user);
    redirect(profile.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-budget-bg px-5 py-10">
      <div className="grid w-full max-w-md gap-6">
        <BudgetlyLogo className="justify-center" />
        <div>
          <h1 className="text-center text-2xl font-semibold text-budget-text">Login</h1>
          <p className="mt-2 text-center text-sm text-budget-muted">Acceso seguro con Google OAuth y Supabase Auth.</p>
        </div>
        <LoginForm error={params?.error} />
      </div>
    </main>
  );
}
