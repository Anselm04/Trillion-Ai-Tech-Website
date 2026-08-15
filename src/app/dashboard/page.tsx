import { requireUser } from '@/lib/auth';

export default async function DashboardPage() {
  const { user, supabase } = await requireUser();

  const { data: entitlements } = await supabase
    .from('entitlements')
    .select('id,status,access_expires_at,product_id,products(name,slug)')
    .eq('user_id', user.id)
    .neq('status', 'revoked');

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl font-semibold">My dashboard</h1>
      <p className="mt-2 text-slate-400">Welcome back, {user.email}</p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">My products</h2>
        {(!entitlements || entitlements.length === 0) ? (
          <div className="glass rounded-2xl p-10 text-center text-slate-400">
            <p>No active subscriptions yet.</p>
            <a href="/catalog/apps" className="mt-4 inline-block btn-primary">Browse products</a>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {entitlements.map((e: {id:string;status:string;access_expires_at:string|null;product_id:string;products:{name:string;slug:string}|null}) => (
              <div key={e.id} className="glass rounded-2xl p-5">
                <p className="font-semibold">{e.products?.name || 'Unknown product'}</p>
                <p className="text-sm text-slate-400 mt-1">Status: <span className="text-cyan">{e.status}</span></p>
                {e.access_expires_at && (
                  <p className="text-xs text-slate-500 mt-1">Expires: {new Date(e.access_expires_at).toLocaleDateString()}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <form action="/api/stripe/portal" method="post" className="mt-8">
        <button className="btn-ghost">Manage billing & subscriptions</button>
      </form>
    </div>
  );
}
