// src/app/api/admin/stats/monthly/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  const now = new Date();
  const months: string[] = [];
  const revenue: number[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const start = new Date(d);
    const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));

    months.push(`${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, "0")}`);

    const sum = await prisma.invoice.aggregate({
      _sum: { amountCents: true },
      where: {
        createdAt: { gte: start, lt: end },
        status: { in: ["PAID", "SUCCEEDED"] },
      },
    });

    revenue.push(sum._sum.amountCents ?? 0);
  }

  return NextResponse.json({ months, revenueMonthly: revenue });
}
