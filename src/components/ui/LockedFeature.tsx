import Link from "next/link";
import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export function LockedFeature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-budget-card/80">
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-budget-soft p-2 text-budget-neon">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-budget-text">{title}</p>
            <p className="mt-2 text-sm leading-6 text-budget-muted">{description}</p>
            <Link href="/premium" className="mt-4 inline-flex text-sm font-semibold text-budget-neon hover:text-budget-green">
              Mejorar a Premium
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
