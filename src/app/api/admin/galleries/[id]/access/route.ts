import { NextRequest, NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function PATCH(req: NextRequest, { params }:{ params:{ id:string }}){ const data=await req.json(); await prisma.gallery.update({ where:{ id: params.id }, data }); return NextResponse.json({ ok:true }); }
