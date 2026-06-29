import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { createAuditLog } from "@/lib/services/audit.service";
import { getRecentDecisionSimulations, runDecisionSimulation } from "@/lib/services/decision.service";
import { decisionSimulationSchema } from "@/lib/validations/decision.schema";

export async function GET() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const simulations = await getRecentDecisionSimulations(auth.user.id);

  return NextResponse.json({
    success: true,
    data: {
      items: simulations.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        amount: Number(item.amount.toString()),
        result: item.result,
        createdAt: item.createdAt.toISOString(),
      })),
    },
  });
}

export async function POST(request: Request) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = decisionSimulationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const result = await runDecisionSimulation({ userId: auth.user.id, ...parsed.data });

  await createAuditLog({
    userId: auth.user.id,
    action: "DECISION_SIMULATED",
    entity: "decision",
    metadata: { type: parsed.data.type, amount: parsed.data.amount },
  });

  return NextResponse.json({ success: true, data: { result } }, { status: 201 });
}
