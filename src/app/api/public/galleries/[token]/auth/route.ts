import { NextRequest, NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function POST(req: NextRequest, { params }:{ params:{ token:string }}){
  const { who, email, code } = await req.json(); const g=await prisma.gallery.findUnique({ where:{ token: params.token } }); if(!g) return NextResponse.json({ ok:false }, { status:404 });
  if(who==='client'){ if(!g.clientRequireCode) return NextResponse.json({ ok:true }); if((g.clientEmail||'').toLowerCase()!==String(email||'').toLowerCase()) return NextResponse.json({ ok:false, error:'Email invalide' }, { status:401 }); if((g.clientAccessCode||'')!==String(code||'')) return NextResponse.json({ ok:false, error:'Code invalide' }, { status:401 }); return NextResponse.json({ ok:true }); }
  else { if(!g.guestRequireCode) return NextResponse.json({ ok:true }); if((g.guestAccessCode||'')!==String(code||'')) return NextResponse.json({ ok:false, error:'Code invalide' }, { status:401 }); return NextResponse.json({ ok:true }); }
}
