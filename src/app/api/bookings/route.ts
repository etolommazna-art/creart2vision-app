import { NextRequest, NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function POST(req: NextRequest){ const { serviceId, planId, name, email, startISO } = await req.json();
  if(!serviceId||!name||!email||!startISO) return NextResponse.json({ error:'Champs requis' }, { status:400 });
  const plan = planId ? await prisma.servicePlan.findUnique({ where:{ id: planId } }) : null;
  const contact = await prisma.contact.upsert({ where:{ email }, update:{ firstName: name.split(' ')[0]||name }, create:{ email, firstName: name.split(' ')[0]||name } });
  const start=new Date(startISO); const end=new Date(start.getTime()+(plan?.durationMinutes||60)*60000);
  const booking=await prisma.booking.create({ data:{ serviceId, planId: plan?.id||null, name, email, start, end, contactId: contact.id } });
  return NextResponse.json({ ok:true, id: booking.id });
}
