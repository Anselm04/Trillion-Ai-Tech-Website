import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { createServerSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { user } = await requireUser();
  const formData = await req.formData();
  const priceRowId = String(formData.get('price_id') || '');
  if (!priceRowId) return NextResponse.json({ error: 'Missing price_id' }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data: price } = await supabase
    .from('product_prices')
    .select('stripe_price_id,billing_interval,trial_days,products(slug)')
    .eq('id', priceRowId)
    .single();

  if (!price?.stripe_price_id)
    return NextResponse.json({ error: 'No Stripe price configured for this product yet' }, { status: 400 });

  const isSubscription = price.billing_interval !== 'one_time';
  const session = await stripe.checkout.sessions.create({
    mode: isSubscription ? 'subscription' : 'payment',
    line_items: [{ price: price.stripe_price_id, quantity: 1 }],
    ...(isSubscription && price.trial_days > 0
      ? { subscription_data: { trial_period_days: price.trial_days } }
      : {}),
    customer_email: user.email,
    metadata: { user_id: user.id, price_row_id: priceRowId },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${(price.products as {slug:string}|null)?.slug || ''}`,
  });

  return NextResponse.redirect(session.url!, 303);
}
