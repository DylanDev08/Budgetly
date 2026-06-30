import { cn } from "@/lib/utils/classNames";

export function AssistantMessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  return (
    <div
      className={cn(
        "max-w-[85%] rounded-lg px-4 py-3 text-sm",
        role === "user"
          ? "ml-auto bg-budget-green font-medium text-budget-bg"
          : "mr-auto border border-budget-border bg-budget-card leading-6 text-budget-text",
      )}
    >
      {content}
    </div>
  );
}
