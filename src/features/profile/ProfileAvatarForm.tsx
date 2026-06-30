"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FileDropzone } from "@/components/ui/FileDropzone";

type Profile = {
  fullName?: string | null;
  email?: string;
  avatarUrl?: string | null;
  plan?: string;
  role?: string;
};

export function ProfileAvatarForm({ profile }: { profile: Profile }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function upload(file: File) {
    setLoading(true);
    setMessage(null);
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/profile/avatar", {
      method: "POST",
      body: formData,
    });
    const result = await response.json().catch(() => ({}));

    setLoading(false);
    setMessage(response.ok ? "Avatar actualizado." : result.error ?? "No se pudo subir avatar.");
  }

  async function remove() {
    setLoading(true);
    const response = await fetch("/api/profile/avatar", { method: "DELETE" });
    setLoading(false);
    setPreview(null);
    setMessage(response.ok ? "Avatar eliminado." : "No se pudo eliminar avatar.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil visual</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[auto_1fr] lg:items-start">
        <Avatar src={preview} name={profile.fullName ?? profile.email} size="lg" />
        <div className="grid gap-4">
          <div>
            <p className="font-semibold text-budget-text">{profile.fullName ?? "Usuario Budgetly"}</p>
            <p className="mt-1 text-sm text-budget-muted">{profile.email}</p>
            <p className="mt-1 text-xs text-budget-dim">
              {profile.role} / {profile.plan}
            </p>
          </div>
          <FileDropzone
            label={loading ? "Subiendo avatar..." : "Subir nueva foto"}
            helper="JPG, PNG o WEBP. Maximo 5MB. Se guarda en Supabase Storage."
            onFile={upload}
          />
          <Button variant="secondary" onClick={remove} disabled={loading}>
            <Trash2 className="h-4 w-4" />
            Eliminar avatar
          </Button>
          {message ? <p className="text-sm text-budget-muted">{message}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
