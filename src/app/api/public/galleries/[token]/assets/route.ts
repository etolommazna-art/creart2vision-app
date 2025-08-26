// src/app/api/public/galleries/[token]/assets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { signKey } from "@/lib/s3"; // garde ton utilitaire existant

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const mode = new URL(req.url).searchParams.get("mode") || "client";
  const client = mode === "client";

  // Récupère la galerie + assets triés par sortOrder puis par createdAt
  const g = await prisma.gallery.findUnique({
    where: { token: params.token },
    include: {
      assets: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!g) return NextResponse.json({ items: [] });

  // Filtrage : si invité, masquer ceux marqués hiddenFromGuests
  const filtered = g.assets.filter((a) => (client ? true : !a.hiddenFromGuests));

  const items = await Promise.all(
    filtered.map(async (a) => ({
      id: a.id,
      filename: a.filename,
      sd: await signKey(a.keySd ?? a.key),
      hd: await signKey(a.key),
    }))
  );

  return NextResponse.json({ items });
}
