'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

export async function createProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const category = String(formData.get('category') || '');
  const name = String(formData.get('name') || '');
  const slug = String(formData.get('slug') || '').toLowerCase().replace(/\s+/g,'-');
  const tagline = String(formData.get('tagline') || '');
  const description = String(formData.get('description') || '');
  const productType = String(formData.get('product_type') || 'tool');
  const billingInterval = String(formData.get('billing_interval') || 'month');
  const amountCents = Number(formData.get('amount_cents') || 0);
  const trialDays = Number(formData.get('trial_days') || 7);
  const stripePriceId = String(formData.get('stripe_price_id') || '');

  const { data: categoryRow } = await supabase
    .from('categories').select('id').eq('slug', category).single();
  if (!categoryRow?.id) redirect('/dashboard/admin/products?error=Invalid+category+slug');

  const { data: product, error } = await supabase
    .from('products')
    .insert({ category_id: categoryRow.id, name, slug, tagline, description,
               product_type: productType, status: 'draft' })
    .select('id').single();
  if (error || !product) redirect(`/dashboard/admin/products?error=${encodeURIComponent(error?.message || 'Create failed')}`);

  await supabase.from('product_prices').insert({
    product_id: product.id,
    stripe_price_id: stripePriceId || null,
    amount_cents: amountCents,
    billing_interval: billingInterval,
    trial_days: trialDays,
    currency: 'usd',
    active: true
  });

  revalidatePath('/dashboard/admin/products');
  redirect('/dashboard/admin/products?message=Product+created+as+draft');
}

export async function publishProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id') || '');
  await supabase.from('products').update({ status: 'active', updated_at: new Date().toISOString() }).eq('id', id);
  revalidatePath('/dashboard/admin/products');
  redirect('/dashboard/admin/products?message=Product+published');
}

export async function archiveProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id') || '');
  await supabase.from('products').update({ status: 'archived', updated_at: new Date().toISOString() }).eq('id', id);
  revalidatePath('/dashboard/admin/products');
  redirect('/dashboard/admin/products?message=Product+archived');
}

export async function toggleFeatured(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id') || '');
  const featured = formData.get('featured') === 'true';
  await supabase.from('products').update({ featured: !featured }).eq('id', id);
  revalidatePath('/dashboard/admin/products');
  redirect('/dashboard/admin/products');
}
