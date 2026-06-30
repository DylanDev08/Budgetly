import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { serializeTransaction } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { maskEmail, maskIdentifier } from "@/lib/utils/privacy";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const transactions = await prisma.transaction.findMany({
    include: { invoice: true },
    orderBy: { date: "desc" },
    take: 300,
  });

  const userIds = [...new Set(transactions.map((transaction) => transaction.userId))];
  const profiles = await prisma.profile.findMany({
    where: { userId: { in: userIds } },
    select: {
      userId: true,
      fullName: true,
      email: true,
      plan: true,
      status: true,
    },
  });
  const profileByUserId = new Map(profiles.map((profile) => [profile.userId, profile]));

  return NextResponse.json({
    success: true,
    data: {
      items: transactions.map((transaction) => {
        const profile = profileByUserId.get(transaction.userId);

        return {
          ...serializeTransaction(transaction),
          customer: {
            userId: transaction.userId,
            userLabel: maskIdentifier(transaction.userId, 5),
            fullName: profile?.fullName ?? "Cliente Budgetly",
            email: maskEmail(profile?.email ?? null),
            plan: profile?.plan ?? "sin perfil",
            status: profile?.status ?? "sin perfil",
          },
        };
      }),
    },
  });
}
