import { NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function GET(){ const items=await prisma.gallery.findMany({ orderBy:{ createdAt:'desc' } }); return NextResponse.json({ items }); }
