"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";

const oauthErrors: Record<string, string> = {
  oauth: "No se pudo completar el login con Google.",
  missing_oauth_code: "Google no devolvio el codigo de autenticacion.",
  oauth_code_verifier:
    "Supabase no encontro el verificador de login. Volve a iniciar desde esta pantalla, sin reutilizar pestanas viejas.",
  oauth_redirect:
    "La URL de callback no coincide con las URLs permitidas en Supabase Auth.",
  oauth_provider:
    "Google o Supabase rechazaron la configuracion del proveedor OAuth.",
  oauth_exchange_failed: "Supabase no pudo validar la sesion de Google.",
};

export function LoginForm({ error }: { error?: string }) {
  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Ingresar a Budgetly</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error ? (
          <p className="rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-sm font-medium text-red-300">
            {oauthErrors[error] ?? "No se pudo iniciar sesion."}
          </p>
        ) : null}
        <Button type="button" onClick={signInWithGoogle}>
          <ShieldCheck className="h-4 w-4" />
          Entrar con Google
        </Button>
        <p className="text-sm leading-6 text-budget-muted">
          Budgetly usa Supabase Auth con Google OAuth. No guardamos claves propias en la app.
        </p>
      </CardContent>
    </Card>
  );
}
