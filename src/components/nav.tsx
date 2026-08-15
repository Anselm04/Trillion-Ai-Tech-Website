import Link from 'next/link';

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40" style={{backdropFilter:'blur(20px)'}}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="Trillion AI Tech logo">
            <polygon points="14,2 26,9 26,19 14,26 2,19 2,9" stroke="#6d5efc" strokeWidth="1.5" fill="none"/>
            <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="#6d5efc" fillOpacity="0.18"/>
            <circle cx="14" cy="14" r="2.5" fill="#67e8f9"/>
          </svg>
          <span className="text-sm font-semibold uppercase tracking-[0.22em]">Trillion AI Tech</span>
        </Link>
        <nav className="hidden gap-6 text-sm text-slate-300 lg:flex">
          <Link href="/catalog/apps" className="hover:text-white transition-colors">Apps</Link>
          <Link href="/catalog/games" className="hover:text-white transition-colors">Games</Link>
          <Link href="/catalog/agents" className="hover:text-white transition-colors">Agents</Link>
          <Link href="/catalog/tools" className="hover:text-white transition-colors">Tools</Link>
          <Link href="/catalog/software" className="hover:text-white transition-colors">Software</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="hidden text-sm text-slate-300 hover:text-white transition-colors lg:block">Dashboard</Link>
          <Link href="/auth/sign-in" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100 transition-colors">Sign in</Link>
        </div>
      </div>
    </header>
  );
}
