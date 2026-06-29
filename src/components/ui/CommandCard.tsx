import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export function CommandCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card className="bg-budget-card">
      <CardHeader>
        <CardTitle>Proxima mejor accion</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold text-budget-text">{title}</p>
        <p className="mt-2 text-sm leading-6 text-budget-muted">{description}</p>
        <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-budget-neon hover:text-budget-green">
          Ir al modulo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
