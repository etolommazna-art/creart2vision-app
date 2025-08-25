import { NextRequest, NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function POST(req: NextRequest, { params }:{ params:{ token:string }}){ const { assetId, who, viewerToken } = await req.json();
  const g=await prisma.gallery.findUnique({ where:{ token: params.token } }); if(!g) return NextResponse.json({ ok:true });
  await prisma.assetView.create({ data:{ galleryId: g.id, assetId, by: who==='guest'?'GUEST':'CLIENT', viewerToken: viewerToken||null } });
  return NextResponse.json({ ok:true });
}
