import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Utilise la même version d'API que ton dashboard si tu veux, sinon laisse Stripe gérer.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

// Important avec l'App Router : on lit le RAW body via req.text()
export const runtime = "nodejs";        // exécution Node (pas edge)
export const dynamic = "force-dynamic"; // pas de cache pour les webhooks

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  let rawBody: string;
  try {
    rawBody = await req.text(); // body brut requis pour la vérification Stripe
  } catch {
    return NextResponse.json({ error: "Failed to read body" }, { status: 400 });
  }

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Invalid signature: ${err.message}` }, { status: 400 });
  }

  // Traite les événements utiles
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // TODO: marquer la réservation payée, générer facture, envoyer mails, etc.
    // Ex: await markBookingPaid(session.id);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// Optionnel: si tu veux limiter la région Vercel pour la latence:
// export const preferredRegion = "iad1";
