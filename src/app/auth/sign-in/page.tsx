import { signInWithOAuth, signInWithPassword } from './actions';
import Link from 'next/link';

export default async function SignInPage({
  searchParams
}: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  return (
    <div className="mx-auto flex min-h-[78vh] max-w-xl items-center px-4 py-12">
      <div className="glass w-full rounded-[2rem] p-8">
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">Welcome back to Trillion AI Tech</p>
        {params.error && <p className="mt-4 text-sm text-rose-300">{params.error}</p>}
        {params.message && <p className="mt-4 text-sm text-cyan">{params.message}</p>}
        <form action={signInWithPassword} className="mt-6 space-y-4">
          <input className="input" placeholder="Email" name="email" type="email" required autoComplete="email" />
          <input className="input" placeholder="Password" name="password" type="password" required autoComplete="current-password" />
          <button type="submit" className="w-full btn-primary">Continue with email</button>
        </form>
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 border-t border-white/10"/><span className="text-xs text-slate-500">or</span><div className="flex-1 border-t border-white/10"/>
        </div>
        <div className="grid gap-3">
          <form action={async () => { 'use server'; await signInWithOAuth('google'); }}>
            <button type="submit" className="w-full btn-ghost">Continue with Google</button>
          </form>
          <form action={async () => { 'use server'; await signInWithOAuth('apple'); }}>
            <button type="submit" className="w-full btn-ghost">Continue with Apple</button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-slate-400">
          No account? <Link href="/auth/sign-up" className="text-accent hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
