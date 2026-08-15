import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';

function adminSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = (await headers()).get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const supabase = adminSupabase();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const priceRowId = session.metadata?.price_row_id;
    const customerId = typeof session.customer === 'string' ? session.customer : null;
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null;
    if (userId && priceRowId) {
      const { data: price } = await supabase
        .from('product_prices').select('product_id').eq('id', priceRowId).single();
      if (price?.product_id) {
        await supabase.from('entitlements').upsert({
          user_id: userId, product_id: price.product_id,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: 'active'
        }, { onConflict: 'user_id,product_id' });
      }
    }
  }

  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : null;
    if (subscriptionId) {
      await supabase.from('entitlements')
        .update({ status: 'active', access_expires_at: null })
        .eq('stripe_subscription_id', subscriptionId);
    }
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : null;
    if (subscriptionId) {
      await supabase.from('entitlements')
        .update({ status: 'grace' })
        .eq('stripe_subscription_id', subscriptionId);
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription;
    const status = sub.status;
    let entitlementStatus = 'active';
    if (status === 'past_due' || status === 'unpaid') entitlementStatus = 'grace';
    else if (status === 'canceled' || status === 'incomplete_expired') entitlementStatus = 'canceled';
    await supabase.from('entitlements')
      .update({ status: entitlementStatus })
      .eq('stripe_subscription_id', sub.id);
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    await supabase.from('entitlements')
      .update({ status: 'revoked', access_expires_at: new Date().toISOString() })
      .eq('stripe_subscription_id', sub.id);
  }

  return NextResponse.json({ received: true, type: event.type });
}
