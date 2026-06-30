"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { AssistantMessageBubble } from "@/features/assistant/AssistantMessageBubble";
import { ExtractedDataPreview } from "@/features/assistant/ExtractedDataPreview";
import { ImageUploadBox, type Extraction } from "@/features/assistant/ImageUploadBox";

type Message = {
  role: "user" | "assistant";
  content: string;
};

async function askAssistant(question: string) {
  const response = await fetch("/api/assistant/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo consultar el asistente.");
  }

  return result.answer as string;
}

export function AssistantChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hola. Puedo ayudarte con gastos, presupuestos, metas, obligaciones e inversion educativa usando tus datos cargados.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [extraction, setExtraction] = useState<Extraction | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!question.trim()) {
      return;
    }

    const currentQuestion = question.trim();
    setQuestion("");
    setLoading(true);
    setMessages((current) => [...current, { role: "user", content: currentQuestion }]);

    try {
      const answer = await askAssistant(currentQuestion);
      setMessages((current) => [...current, { role: "assistant", content: answer }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: error instanceof Error ? error.message : "No pude responder ahora." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-5 sm:p-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Asistente Budgetly</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid max-h-[52vh] gap-3 overflow-y-auto rounded-lg border border-budget-border bg-budget-surface p-4">
            {messages.map((message, index) => (
              <AssistantMessageBubble
                key={`${message.role}-${index}`}
                role={message.role}
                content={message.content}
              />
            ))}
          </div>
          <ImageUploadBox
            onExtraction={(nextExtraction) => {
              setExtraction(nextExtraction);
              setMessages((current) => [
                ...current,
                {
                  role: "assistant",
                  content: "Detecte datos en la imagen. Revisalos abajo antes de crear un movimiento.",
                },
              ]);
            }}
          />
          {extraction ? (
            <ExtractedDataPreview
              extraction={extraction}
              onDone={(content) => {
                setExtraction(null);
                setMessages((current) => [...current, { role: "assistant", content }]);
              }}
            />
          ) : null}
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={submit}>
            <Input
              aria-label="Pregunta"
              placeholder="Ej: En que estoy gastando mas?"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              <Send className="h-4 w-4" />
              {loading ? "Pensando..." : "Enviar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
