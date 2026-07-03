"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, KeyRound, Mail, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
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
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState<"google" | "password" | null>(null);

  async function signInWithGoogle() {
    if (pending) return;

    setPending("google");
    setFormError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signInError) {
      setPending(null);
      setFormError("No se pudo iniciar con Google. Revisa Supabase Auth y Google OAuth.");
    }
  }

  async function signInWithPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    setPending("password");
    setFormError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setPending(null);
      setFormError(result.error ?? "No se pudo iniciar sesion.");
      return;
    }

    router.replace(result.redirectTo ?? "/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full border-budget-border/80 bg-budget-card/95">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-budget-soft p-2 text-budget-neon">
            <Wallet className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Entrar a tu panel financiero</CardTitle>
            <p className="mt-2 text-sm leading-6 text-budget-muted">
              Usa Google o tu email registrado. Si la cuenta no existe en Supabase Auth y profiles, el acceso se rechaza.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error || formError ? (
          <p className="rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-sm font-medium text-red-300">
            {formError ?? (error ? oauthErrors[error] : null) ?? "No se pudo iniciar sesion."}
          </p>
        ) : null}

        <form className="grid gap-3" onSubmit={signInWithPassword}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@email.com"
            required
          />
          <Input
            label="Clave"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Tu clave de Budgetly"
            required
          />
          <Button type="submit" size="lg" className="w-full" disabled={Boolean(pending)}>
            <KeyRound className="h-4 w-4" />
            {pending === "password" ? "Validando..." : "Ingresar con email"}
          </Button>
        </form>

        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-budget-dim">
          <span className="h-px flex-1 bg-budget-border" />
          o
          <span className="h-px flex-1 bg-budget-border" />
        </div>

        <Button type="button" size="lg" variant="secondary" className="w-full" onClick={signInWithGoogle} disabled={Boolean(pending)}>
          <ShieldCheck className="h-4 w-4" />
          {pending === "google" ? "Abriendo Google..." : "Entrar con Google"}
        </Button>

        <div className="grid gap-3 rounded-lg border border-budget-border bg-budget-surface p-4 text-sm leading-6 text-budget-muted">
          <p className="flex items-start gap-2">
            <Mail className="mt-1 h-4 w-4 text-budget-neon" />
            Presupuestos, movimientos, metas, comprobantes y alertas en un solo panel diario.
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-1 h-4 w-4 text-budget-neon" />
            Supabase Auth valida usuarios y Budgetly separa roles, sesiones y RLS por cuenta.
          </p>
        </div>

        <p className="text-sm text-budget-muted">
          No tenes cuenta?{" "}
          <Link href="/auth/register" className="inline-flex items-center gap-1 font-semibold text-budget-neon hover:text-budget-green">
            Crear cuenta
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
