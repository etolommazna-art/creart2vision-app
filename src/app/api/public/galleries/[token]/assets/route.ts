import { NextRequest, NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma'; import { signKey } from '@/lib/storage';
export async function GET(req: NextRequest, { params }:{ params:{ token:string }}){
  const mode=new URL(req.url).searchParams.get('mode')||'client'; const client=mode==='client';
  const g=await prisma.gallery.findUnique({ where:{ token: params.token }, include:{ assets:{ orderBy:{ order:'asc' } } } }); if(!g) return NextResponse.json({ items: [] });
  const filtered = g.assets.filter(a=> client || !a.hiddenFromGuests);
  const items = await Promise.all(filtered.map(async a=>({ id:a.id, filename:a.filename, sd: await signKey(a.keySd||a.key), hd: await signKey(a.key) })));
  return NextResponse.json({ items });
}
