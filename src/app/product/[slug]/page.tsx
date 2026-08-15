import { createServerSupabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase.from('products').select('name,tagline').eq('slug', slug).single();
  if (!data) return { title: 'Product not found' };
  return { title: `${data.name} — Trillion AI Tech`, description: data.tagline || '' };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data: product } = await supabase
    .from('products')
    .select('id,name,tagline,description,product_type,thumbnail_url,demo_url')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (!product) notFound();

  const { data: prices } = await supabase
    .from('product_prices')
    .select('id,amount_cents,billing_interval,currency,trial_days')
    .eq('product_id', product.id)
    .eq('active', true);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          {product.thumbnail_url && (
            <img src={product.thumbnail_url} alt={product.name} width={800} height={450}
              className="w-full rounded-2xl object-cover mb-8" loading="lazy" />
          )}
          <span className="text-xs uppercase tracking-widest text-accent">{product.product_type}</span>
          <h1 className="mt-2 text-5xl font-semibold">{product.name}</h1>
          {product.tagline && <p className="mt-4 text-xl text-slate-300">{product.tagline}</p>}
          {product.description && (
            <div className="mt-8 text-slate-300 leading-relaxed whitespace-pre-line">{product.description}</div>
          )}
        </div>
        <aside className="space-y-4">
          {(prices || []).map((price: {id:string;amount_cents:number;billing_interval:string;currency:string;trial_days:number}) => (
            <div key={price.id} className="glass rounded-2xl p-6">
              <p className="text-3xl font-semibold">
                {(price.amount_cents / 100).toFixed(2)} <span className="text-lg text-slate-400 uppercase">{price.currency}</span>
              </p>
              <p className="text-sm text-slate-400 mt-1">per {price.billing_interval}</p>
              {price.trial_days > 0 && (
                <p className="text-xs text-cyan mt-1">{price.trial_days}-day free trial included</p>
              )}
              <form action="/api/stripe/checkout" method="post" className="mt-5">
                <input type="hidden" name="price_id" value={price.id} />
                <button className="w-full btn-primary">Subscribe now</button>
              </form>
            </div>
          ))}
          {(!prices || prices.length === 0) && (
            <div className="glass rounded-2xl p-6 text-slate-400">
              Pricing coming soon.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
