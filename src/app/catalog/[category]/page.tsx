import { createServerSupabase } from '@/lib/supabase';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  return { title: `${category.charAt(0).toUpperCase() + category.slice(1)} — Trillion AI Tech` };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const supabase = await createServerSupabase();

  const { data: products } = await supabase
    .from('products')
    .select('id,slug,name,tagline,thumbnail_url,product_type')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-5xl font-semibold capitalize">{category}</h1>
      <p className="mt-3 text-slate-400">Browse all {category} available on subscription.</p>

      {(!products || products.length === 0) ? (
        <div className="glass mt-12 rounded-[2rem] p-16 text-center text-slate-400">
          <p className="text-lg">No products yet — add some from the admin dashboard.</p>
          <Link href="/dashboard/admin/products" className="mt-6 inline-block btn-ghost">Admin dashboard</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p: {id:string;slug:string;name:string;tagline:string|null;thumbnail_url:string|null;product_type:string}) => (
            <Link key={p.id} href={`/product/${p.slug}`}
              className="glass rounded-2xl p-6 hover:border-accent/40 transition-all">
              {p.thumbnail_url && (
                <img src={p.thumbnail_url} alt={p.name} width={400} height={220}
                  className="w-full rounded-xl object-cover mb-4" loading="lazy" />
              )}
              <span className="text-xs uppercase tracking-widest text-accent">{p.product_type}</span>
              <h2 className="mt-2 text-lg font-semibold">{p.name}</h2>
              {p.tagline && <p className="mt-1 text-sm text-slate-400">{p.tagline}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
