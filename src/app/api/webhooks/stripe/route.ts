import { NextRequest, NextResponse } from 'next/server'; import Stripe from 'stripe'; import { prisma } from '@/lib/prisma';
export const runtime='nodejs';
function numberGen(){ const y=new Date().getFullYear(); const r=Math.floor(Math.random()*90000+10000); return `F${y}-${r}`; }
export async function POST(req: NextRequest){ const payload=await req.text(); const sig=req.headers.get('stripe-signature')||''; const secret=process.env.STRIPE_WEBHOOK_SECRET||''; try{
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY||'', { apiVersion:'2024-06-20' } as any);
  const event=stripe.webhooks.constructEvent(payload, sig, secret);
  if(event.type==='checkout.session.completed'){ const s=event.data.object as any; const email=s.customer_details?.email; const amount=(s.amount_total)||0; let contactId: string|null = null;
    if(email){ const c=await prisma.contact.upsert({ where:{ email }, update:{}, create:{ email } }); contactId=c.id; }
    await prisma.invoice.create({ data:{ number: numberGen(), amountCents: amount, contactId } });
  }
  return NextResponse.json({ received:true });
}catch(e:any){ console.error('Stripe webhook error', e?.message); return new NextResponse('Webhook Error', { status:400 }); } }
export const config = { api: { bodyParser: false } } as any;
