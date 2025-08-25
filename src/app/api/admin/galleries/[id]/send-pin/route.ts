import { NextRequest, NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma'; import { sendPIN } from '@/lib/email';
export async function POST(req: NextRequest, { params }:{ params:{ id:string }}){ const who=new URL(req.url).searchParams.get('who')||'client'; const g=await prisma.gallery.findUnique({ where:{ id: params.id } }); if(!g) return NextResponse.json({ error:'Not found' }, { status:404 });
  if(who==='client'){ if(!g.clientEmail||!g.clientAccessCode) return NextResponse.json({ error:'Email/code manquant' }, { status:400 }); await sendPIN(g.clientEmail, 'Votre code d\'accès galerie', g.clientAccessCode); }
  else { if(!g.guestAccessCode||!g.clientEmail) return NextResponse.json({ error:'Code invité manquant' }, { status:400 }); await sendPIN(g.clientEmail, 'Code invités pour la galerie', g.guestAccessCode); }
  return NextResponse.json({ ok:true });
}
