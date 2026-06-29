"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, KeyRound, Save, Search, ShieldCheck, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type Profile = {
  id: string;
  userId: string;
  fullName: string | null;
  email: string;
  role: string;
  plan: string;
  currency: string;
  alertMode: string;
  riskProfile: string;
  monthlyBudget: number;
  weeklyBudget: number;
  variableBudget: number;
  monthlySavingsGoal: number;
};

type ExternalLogin = {
  id: string;
  email: string;
  fullName: string;
  providers: string[];
  role: string;
  plan: string;
  createdAt: string;
  lastSignInAt: string | null;
  emailConfirmedAt: string | null;
  profileCreatedAt: string | null;
  profileUpdatedAt: string | null;
  passwordAccess: string;
};

type AdminTab = "profiles" | "external-logins" | "security";

async function apiJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo completar la operacion.");
  }

  return result;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Sin registro";
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function matchesSearch(value: string, search: string) {
  return value.toLowerCase().includes(search.trim().toLowerCase());
}

export function AdminProfilesPanel() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Profile | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<AdminTab>("profiles");

  const profilesQuery = useQuery<{ items: Profile[] }>({
    queryKey: ["/api/admin/profiles"],
    queryFn: () => apiJson("/api/admin/profiles"),
  });

  const externalLoginsQuery = useQuery<{ items: ExternalLogin[]; warning?: string }>({
    queryKey: ["/api/admin/external-logins"],
    queryFn: () => apiJson("/api/admin/external-logins"),
  });

  const mutation = useMutation({
    mutationFn: (profile: Profile) =>
      apiJson(`/api/admin/profiles/${profile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profile.fullName,
          role: profile.role,
          plan: profile.plan,
          currency: profile.currency,
          alertMode: profile.alertMode,
          riskProfile: profile.riskProfile,
          monthlyBudget: profile.monthlyBudget,
          weeklyBudget: profile.weeklyBudget,
          variableBudget: profile.variableBudget,
          monthlySavingsGoal: profile.monthlySavingsGoal,
        }),
      }),
    onSuccess: async () => {
      setEditing(null);
      setMessage("Perfil actualizado.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/api/admin/profiles"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/admin/external-logins"] }),
      ]);
    },
    onError: (error) => setMessage(error.message),
  });

  const profiles = useMemo(() => {
    const items = profilesQuery.data?.items ?? [];

    if (!search.trim()) {
      return items;
    }

    return items.filter((profile) =>
      [profile.email, profile.fullName ?? "", profile.role, profile.plan].some((value) => matchesSearch(value, search)),
    );
  }, [profilesQuery.data?.items, search]);

  const externalLogins = useMemo(() => {
    const items = externalLoginsQuery.data?.items ?? [];

    if (!search.trim()) {
      return items;
    }

    return items.filter((login) =>
      [login.email, login.fullName, login.role, login.plan, login.providers.join(" ")].some((value) => matchesSearch(value, search)),
    );
  }, [externalLoginsQuery.data?.items, search]);

  const adminCount = profilesQuery.data?.items.filter((profile) => profile.role === "admin").length ?? 0;
  const premiumCount = profilesQuery.data?.items.filter((profile) => profile.plan !== "free").length ?? 0;

  return (
    <div className="grid gap-5 p-5 sm:p-8">
      <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-budget-border bg-budget-surface p-4">
              <p className="text-sm text-budget-muted">Usuarios locales</p>
              <p className="mt-2 text-2xl font-semibold text-budget-text">{profilesQuery.data?.items.length ?? 0}</p>
            </div>
            <div className="rounded-lg border border-budget-border bg-budget-surface p-4">
              <p className="text-sm text-budget-muted">Admins</p>
              <p className="mt-2 text-2xl font-semibold text-budget-text">{adminCount}</p>
            </div>
            <div className="rounded-lg border border-budget-border bg-budget-surface p-4">
              <p className="text-sm text-budget-muted">Planes pagos/mock</p>
              <p className="mt-2 text-2xl font-semibold text-budget-text">{premiumCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-budget-soft p-2 text-budget-neon">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-budget-text">Control admin seguro</p>
                <p className="mt-2 text-sm leading-6 text-budget-muted">
                  Se muestran perfiles, proveedores OAuth y actividad permitida. Las contrasenas nunca se guardan ni se exponen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <CardTitle>Consola de usuarios</CardTitle>
              <p className="mt-2 text-sm text-budget-muted">CRUD local de perfiles y auditoria de accesos externos.</p>
            </div>
            <label className="relative w-full xl:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-budget-dim" />
              <input
                className="h-10 w-full rounded-lg border border-budget-border bg-budget-surface pl-10 pr-3 text-sm text-budget-text outline-none transition focus:border-budget-green focus:ring-2 focus:ring-budget-green/20"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre, email, rol o plan"
              />
            </label>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "profiles", label: "Perfiles", icon: Users },
              { id: "external-logins", label: "Logins externos", icon: Activity },
              { id: "security", label: "Contrasenas", icon: KeyRound },
            ].map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;

              return (
                <Button
                  key={item.id}
                  variant={active ? "primary" : "secondary"}
                  onClick={() => setTab(item.id as AdminTab)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {message ? <p className="rounded-lg border border-budget-border bg-budget-surface p-3 text-sm text-budget-muted">{message}</p> : null}

          {tab === "profiles" ? (
            <div className="grid gap-4">
              {profilesQuery.isLoading ? <p className="text-sm text-budget-muted">Cargando perfiles...</p> : null}
              {profilesQuery.isError ? <p className="text-sm text-red-300">{profilesQuery.error.message}</p> : null}
              {profiles.length === 0 && !profilesQuery.isLoading ? <p className="text-sm text-budget-muted">No hay perfiles para ese filtro.</p> : null}
              {profiles.map((profile) => {
                const current = editing?.id === profile.id ? editing : profile;

                return (
                  <div key={profile.id} className="rounded-lg border border-budget-border bg-budget-surface p-4">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-budget-text">{profile.fullName || "Usuario sin nombre"}</p>
                        <p className="mt-1 text-sm text-budget-muted">{profile.email}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge tone={profile.role === "admin" ? "success" : "neutral"}>{profile.role}</Badge>
                        <Badge tone={profile.plan === "free" ? "neutral" : "success"}>{profile.plan}</Badge>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <Input label="Nombre y apellido" value={current.fullName ?? ""} onChange={(event) => setEditing({ ...current, fullName: event.target.value })} />
                      <Input label="Gmail" value={current.email} disabled title="El email viene de Supabase Auth." />
                      <Select label="Rol" value={current.role} onChange={(event) => setEditing({ ...current, role: event.target.value })}>
                        <option value="user">Usuario</option>
                        <option value="admin">Admin</option>
                      </Select>
                      <Select label="Plan" value={current.plan} onChange={(event) => setEditing({ ...current, plan: event.target.value })}>
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                        <option value="pro">Pro</option>
                      </Select>
                      <Select label="Moneda" value={current.currency} onChange={(event) => setEditing({ ...current, currency: event.target.value })}>
                        <option value="ARS">ARS</option>
                        <option value="USD">USD</option>
                        <option value="BRL">BRL</option>
                        <option value="EUR">EUR</option>
                      </Select>
                      <Select label="Alerta" value={current.alertMode} onChange={(event) => setEditing({ ...current, alertMode: event.target.value })}>
                        <option value="serio">Serio</option>
                        <option value="normal">Normal</option>
                        <option value="humoristico">Humoristico</option>
                      </Select>
                      <Select label="Riesgo" value={current.riskProfile} onChange={(event) => setEditing({ ...current, riskProfile: event.target.value })}>
                        <option value="conservador">Conservador</option>
                        <option value="moderado">Moderado</option>
                        <option value="agresivo">Agresivo</option>
                      </Select>
                      <Input label="Presupuesto mensual" type="number" value={String(current.monthlyBudget)} onChange={(event) => setEditing({ ...current, monthlyBudget: Number(event.target.value) })} />
                      <Input label="Limite semanal" type="number" value={String(current.weeklyBudget)} onChange={(event) => setEditing({ ...current, weeklyBudget: Number(event.target.value) })} />
                      <Input label="Variable" type="number" value={String(current.variableBudget)} onChange={(event) => setEditing({ ...current, variableBudget: Number(event.target.value) })} />
                      <Input label="Ahorro mensual" type="number" value={String(current.monthlySavingsGoal)} onChange={(event) => setEditing({ ...current, monthlySavingsGoal: Number(event.target.value) })} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button type="button" disabled={!editing || editing.id !== profile.id || mutation.isPending} onClick={() => mutation.mutate(current)}>
                        <Save className="h-4 w-4" />
                        Guardar perfil
                      </Button>
                      <Button type="button" variant="secondary" disabled title="Borrado total pendiente de backup, cascade y eliminacion segura en Supabase Auth.">
                        Borrado seguro bloqueado
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {tab === "external-logins" ? (
            <div className="grid gap-4">
              {externalLoginsQuery.data?.warning ? (
                <p className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-3 text-sm text-amber-200">{externalLoginsQuery.data.warning}</p>
              ) : null}
              {externalLoginsQuery.isLoading ? <p className="text-sm text-budget-muted">Cargando logins externos...</p> : null}
              {externalLoginsQuery.isError ? <p className="text-sm text-red-300">{externalLoginsQuery.error.message}</p> : null}
              {externalLogins.length === 0 && !externalLoginsQuery.isLoading ? <p className="text-sm text-budget-muted">No hay logins externos para ese filtro.</p> : null}
              {externalLogins.map((login) => (
                <div key={login.id} className="rounded-lg border border-budget-border bg-budget-surface p-4">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <p className="font-semibold text-budget-text">{login.fullName}</p>
                      <p className="mt-1 text-sm text-budget-muted">{login.email}</p>
                      <p className="mt-2 text-xs text-budget-dim">Auth ID: {login.id}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {login.providers.map((provider) => (
                        <Badge key={provider} tone="success">{provider}</Badge>
                      ))}
                      <Badge tone={login.emailConfirmedAt ? "success" : "warning"}>{login.emailConfirmedAt ? "email verificado" : "sin verificar"}</Badge>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-budget-muted md:grid-cols-2 xl:grid-cols-4">
                    <p className="rounded-lg border border-budget-border bg-budget-card p-3">Rol: {login.role}</p>
                    <p className="rounded-lg border border-budget-border bg-budget-card p-3">Plan: {login.plan}</p>
                    <p className="rounded-lg border border-budget-border bg-budget-card p-3">Creado: {formatDate(login.createdAt)}</p>
                    <p className="rounded-lg border border-budget-border bg-budget-card p-3">Ultimo ingreso: {formatDate(login.lastSignInAt)}</p>
                    <p className="rounded-lg border border-budget-border bg-budget-card p-3 md:col-span-2 xl:col-span-4">
                      Contrasena: {login.passwordAccess}. Para OAuth externo no existe contrasena accesible desde Budgetly.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {tab === "security" ? (
            <div className="grid gap-4">
              <div className="rounded-lg border border-budget-border bg-budget-surface p-4">
                <p className="font-semibold text-budget-text">Politica de contrasenas</p>
                <p className="mt-2 text-sm leading-6 text-budget-muted">
                  El panel no muestra contrasenas. Google no las entrega y Supabase Auth solo administra credenciales de forma segura. Si se habilita email/password, Budgetly debe guardar hashes gestionados por Supabase, nunca texto plano.
                </p>
              </div>
              <div className="rounded-lg border border-budget-border bg-budget-surface p-4">
                <p className="font-semibold text-budget-text">Datos visibles para control</p>
                <p className="mt-2 text-sm leading-6 text-budget-muted">
                  Nombre, email, proveedor, rol, plan, verificacion de email, fecha de creacion, ultimo ingreso y auditoria de acciones administrativas.
                </p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
