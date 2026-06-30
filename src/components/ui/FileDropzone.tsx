"use client";

import { Upload } from "lucide-react";
import type { ChangeEvent } from "react";

export function FileDropzone({
  label,
  helper,
  accept = "image/jpeg,image/png,image/webp",
  onFile,
}: {
  label: string;
  helper: string;
  accept?: string;
  onFile: (file: File) => void;
}) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      onFile(file);
    }

    event.target.value = "";
  }

  return (
    <label className="grid cursor-pointer place-items-center rounded-lg border border-dashed border-budget-border bg-budget-surface p-6 text-center transition-colors hover:bg-budget-hover">
      <Upload className="h-6 w-6 text-budget-neon" />
      <span className="mt-3 text-sm font-semibold text-budget-text">{label}</span>
      <span className="mt-1 text-xs leading-5 text-budget-muted">{helper}</span>
      <input type="file" accept={accept} className="hidden" onChange={handleChange} />
    </label>
  );
}
