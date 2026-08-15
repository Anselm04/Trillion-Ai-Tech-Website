import { requireAdmin } from '@/lib/auth';
import { createProduct, publishProduct, archiveProduct, toggleFeatured } from './actions';

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;

  const { data: products } = await supabase
    .from('products')
    .select('id,name,slug,status,featured,product_type,created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-semibold">Catalog manager</h1>
      <p className="mt-2 text-slate-400">Add, publish, archive, and feature your products.</p>

      {params.error && <p className="mt-4 text-sm text-rose-300 glass rounded-xl px-4 py-3">{params.error}</p>}
      {params.message && <p className="mt-4 text-sm text-cyan glass rounded-xl px-4 py-3">{params.message}</p>}

      {/* Product list */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">All products</h2>
        {(!products || products.length === 0) ? (
          <div className="glass rounded-2xl p-8 text-center text-slate-400">No products yet. Add one below.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-slate-400 border-b border-white/10">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Slug</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Featured</th>
                <th className="pb-3">Actions</th>
              </tr></thead>
              <tbody>
                {(products as {id:string;name:string;slug:string;status:string;featured:boolean;product_type:string}[]).map(p => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 pr-4 font-medium">{p.name}</td>
                    <td className="py-3 pr-4 text-slate-400">{p.slug}</td>
                    <td className="py-3 pr-4 text-slate-400">{p.product_type}</td>
                    <td className="py-3 pr-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.status === 'active' ? 'bg-green-900/50 text-green-300' :
                        p.status === 'draft' ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>{p.status}</span>
                    </td>
                    <td className="py-3 pr-4">{p.featured ? '★' : '–'}</td>
                    <td className="py-3 flex gap-2">
                      {p.status === 'draft' && (
                        <form action={publishProduct}>
                          <input type="hidden" name="id" value={p.id} />
                          <button className="text-xs text-cyan hover:underline">Publish</button>
                        </form>
                      )}
                      {p.status === 'active' && (
                        <form action={archiveProduct}>
                          <input type="hidden" name="id" value={p.id} />
                          <button className="text-xs text-rose-300 hover:underline">Archive</button>
                        </form>
                      )}
                      <form action={toggleFeatured}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="featured" value={String(p.featured)} />
                        <button className="text-xs text-slate-400 hover:underline">{p.featured ? 'Unfeature' : 'Feature'}</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add product form */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold mb-6">Add new product</h2>
        <form action={createProduct} className="glass rounded-[2rem] p-8 grid gap-4 md:grid-cols-2">
          <input className="input" placeholder="Product name *" name="name" required />
          <input className="input" placeholder="Slug (auto-lowercased) *" name="slug" required />
          <input className="input" placeholder="Category slug (apps/games/agents/tools/software) *" name="category" required />
          <input className="input" placeholder="Product type (app/game/agent/tool/software) *" name="product_type" required />
          <input className="input" placeholder="Tagline" name="tagline" />
          <input className="input" placeholder="Stripe Price ID (optional)" name="stripe_price_id" />
          <input className="input" placeholder="Amount in cents (e.g. 999 = $9.99) *" name="amount_cents" type="number" required />
          <input className="input" placeholder="Billing interval (month/year/one_time) *" name="billing_interval" required />
          <input className="input" placeholder="Trial days (default 7)" name="trial_days" type="number" />
          <textarea className="input min-h-32 md:col-span-2" placeholder="Description" name="description" />
          <button type="submit" className="md:col-span-2 btn-primary">Create product (saved as draft)</button>
        </form>
      </section>
    </div>
  );
}
