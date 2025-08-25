import { NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function GET(){ const types=['MARIAGE','GROSSESSE','CORPORATE','AUTRE'] as const; const out:any={}; for(const t of types){ out[t]=await prisma.gallery.count({ where:{ type: t as any } }); } return NextResponse.json(out); }
