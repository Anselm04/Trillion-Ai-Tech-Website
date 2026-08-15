import Link from 'next/link';

const CATEGORIES = [
  { slug: 'apps', label: 'Apps', icon: '⬡' },
  { slug: 'games', label: 'Games', icon: '◈' },
  { slug: 'agents', label: 'Agents', icon: '◇' },
  { slug: 'tools', label: 'Tools', icon: '▣' },
  { slug: 'software', label: 'Software', icon: '◉' },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Hero */}
      <section className="py-24 lg:py-36">
        <div className="max-w-4xl">
          <span className="inline-block rounded-full border border-accent/40 bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent mb-6">
            AI-Powered Marketplace
          </span>
          <h1 className="text-5xl font-semibold leading-tight md:text-7xl lg:text-8xl">
            Next-gen AI apps,<br/>
            <span style={{background:'linear-gradient(90deg,#6d5efc,#67e8f9)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              yours by subscription.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Browse, subscribe, and instantly access premium AI apps, games, autonomous agents, tools,
            and software — all managed from one flagship platform.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/catalog/apps" className="btn-primary">Browse products</Link>
            <Link href="/auth/sign-up" className="btn-ghost">Create account</Link>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="py-16">
        <h2 className="text-xl font-semibold mb-8 text-slate-200">Browse by category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map(c => (
            <Link key={c.slug} href={`/catalog/${c.slug}`}
              className="glass rounded-2xl p-6 text-center hover:border-accent/40 transition-all">
              <span className="text-3xl">{c.icon}</span>
              <p className="mt-3 text-sm font-semibold">{c.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-12 border-t border-white/10">
        <div className="flex flex-wrap justify-center gap-12 text-center text-sm text-slate-400">
          <div><p className="text-3xl font-semibold text-white">100%</p><p>AI-built products</p></div>
          <div><p className="text-3xl font-semibold text-white">Instant</p><p>Access on payment</p></div>
          <div><p className="text-3xl font-semibold text-white">Stripe</p><p>Secure billing</p></div>
          <div><p className="text-3xl font-semibold text-white">Global</p><p>Multi-currency</p></div>
        </div>
      </section>
    </div>
  );
}
