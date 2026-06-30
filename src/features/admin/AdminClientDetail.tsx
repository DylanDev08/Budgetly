"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";

type ClientDetail = {
  profile: {
    fullName: string | null;
    email: string;
    avatarUrl: string | null;
    role: string;
    plan: string;
    status: string;
    createdAt: string;
    lastLoginAt: string | null;
    currency: string;
    alertMode: string;
    riskProfile: string;
  };
  metrics: Record<string, number>;
  transactions: { id: string; name: string; amount: number; category: string; date: string }[];
  budgets: { id: string; name: string; limitAmount: number }[];
  obligations: { id: string; name: string; amount: number; status: string }[];
  goals: { id: string; name: string; targetAmount: number; currentAmount: number }[];
  routines: { id: string; name: string; done: boolean }[];
  scheduleBlocks: { id: string; activity: string; day: string; startTime: string; endTime: string }[];
  uploadedAssets: { id: string; fileName: string; kind: string; status: string; createdAt: string }[];
  extractedFinancialData: { id: string; concept: string | null; amount: number | null; status: string; confidence: number }[];
  assistantMessages: { id: string; role: string; content: string; createdAt: string }[];
  invoices: { id: string; invoiceNumber: string; concept: string; amount: number }[];
  auditLogs: { id: string; action: string; createdAt: string }[];
  clientActivities: { id: string; title: string; summary: string | null; createdAt: string }[];
  clientNotes: { id: string; title: string; content: string; createdAt: string }[];
};

type Tab = "summary" | "finance" | "agenda" | "uploads" | "chatbot" | "audit";

async function loadClient(userId: string) {
  const response = await fetch(`/api/admin/clients/${userId}`);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo cargar el cliente.");
  }

  return result.data as ClientDetail;
}

export function AdminClientDetail({ userId }: { userId: string }) {
  const [tab, setTab] = useState<Tab>("summary");
  const query = useQuery({ queryKey: ["/api/admin/clients", userId], queryFn: () => loadClient(userId) });
  const data = query.data;

  if (query.isLoading) {
    return <p className="text-sm text-budget-muted">Cargando detalle...</p>;
  }

  if (query.isError) {
    return <p className="rounded-lg border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">{query.error.message}</p>;
  }

  if (!data) return null;

  return (
    <div className="grid gap-5">
      <Card>
        <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={data.profile.fullName ?? data.profile.email} src={data.profile.avatarUrl} size="lg" />
            <div>
              <p className="text-xl font-semibold text-budget-text">{data.profile.fullName ?? "Usuario sin nombre"}</p>
              <p className="mt-1 text-sm text-budget-muted">{data.profile.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="success">{data.profile.plan}</Badge>
                <Badge>{data.profile.role}</Badge>
                <Badge>{data.profile.status}</Badge>
              </div>
            </div>
          </div>
          <div className="grid gap-2 text-sm text-budget-muted">
            <span>Moneda: {data.profile.currency}</span>
            <span>Alerta: {data.profile.alertMode}</span>
            <span>Riesgo: {data.profile.riskProfile}</span>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "summary", label: "Resumen" },
          { value: "finance", label: "Finanzas" },
          { value: "agenda", label: "Agenda" },
          { value: "uploads", label: "Fotos y documentos" },
          { value: "chatbot", label: "Chatbot" },
          { value: "audit", label: "Auditoria" },
        ]}
      />

      {tab === "summary" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Object.entries(data.metrics).map(([key, value]) => (
            <Card key={key}>
              <CardContent>
                <p className="text-sm text-budget-muted">{key}</p>
                <p className="mt-2 text-2xl font-semibold text-budget-text">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {tab === "finance" ? (
        <GridSection
          title="Finanzas"
          items={[
            ...data.transactions.map((item) => `${item.date} / ${item.name} / ${item.amount}`),
            ...data.budgets.map((item) => `Presupuesto ${item.name} / ${item.limitAmount}`),
            ...data.obligations.map((item) => `Obligacion ${item.name} / ${item.status}`),
            ...data.goals.map((item) => `Meta ${item.name} / ${item.currentAmount}/${item.targetAmount}`),
            ...data.invoices.map((item) => `Comprobante ${item.invoiceNumber} / ${item.concept}`),
          ]}
        />
      ) : null}

      {tab === "agenda" ? (
        <GridSection
          title="Agenda"
          items={[
            ...data.routines.map((item) => `Rutina ${item.name} / ${item.done ? "hecha" : "pendiente"}`),
            ...data.scheduleBlocks.map((item) => `${item.day} ${item.startTime}-${item.endTime} / ${item.activity}`),
          ]}
        />
      ) : null}

      {tab === "uploads" ? (
        <GridSection
          title="Fotos y documentos"
          items={[
            ...data.uploadedAssets.map((item) => `${item.fileName} / ${item.kind} / ${item.status}`),
            ...data.extractedFinancialData.map((item) => `${item.concept ?? "Dato extraido"} / ${item.status} / ${Math.round(item.confidence * 100)}%`),
          ]}
        />
      ) : null}

      {tab === "chatbot" ? (
        <GridSection title="Chatbot" items={data.assistantMessages.map((item) => `${item.role}: ${item.content}`)} />
      ) : null}

      {tab === "audit" ? (
        <GridSection
          title="Auditoria y actividad"
          items={[
            ...data.clientActivities.map((item) => `${item.title} / ${item.summary ?? ""}`),
            ...data.clientNotes.map((item) => `Nota: ${item.title} / ${item.content}`),
            ...data.auditLogs.map((item) => `${item.action} / ${item.createdAt}`),
          ]}
        />
      ) : null}
    </div>
  );
}

function GridSection({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.length === 0 ? <p className="text-sm text-budget-muted">Sin datos para esta seccion.</p> : null}
        {items.slice(0, 60).map((item, index) => (
          <p key={`${item}-${index}`} className="rounded-lg border border-budget-border bg-budget-surface p-3 text-sm text-budget-muted">
            {item}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
