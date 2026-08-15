import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

export async function POST() {
  const { user, supabase } = await requireUser();
  const { data: entitlement } = await supabase
    .from('entitlements')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .not('stripe_customer_id', 'is', null)
    .limit(1)
    .single();

  if (!entitlement?.stripe_customer_id)
    return NextResponse.json({ error: 'No Stripe customer found' }, { status: 400 });

  const session = await stripe.billingPortal.sessions.create({
    customer: entitlement.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
  });

  return NextResponse.redirect(session.url, 303);
}
