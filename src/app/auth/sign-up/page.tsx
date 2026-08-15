import { signUpWithPassword } from './actions';
import Link from 'next/link';

export default async function SignUpPage({
  searchParams
}: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="mx-auto flex min-h-[78vh] max-w-xl items-center px-4 py-12">
      <div className="glass w-full rounded-[2rem] p-8">
        <h1 className="text-3xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-slate-400">Join Trillion AI Tech and start subscribing</p>
        {params.error && <p className="mt-4 text-sm text-rose-300">{params.error}</p>}
        <form action={signUpWithPassword} className="mt-6 space-y-4">
          <input className="input" placeholder="Full name" name="full_name" required autoComplete="name" />
          <input className="input" placeholder="Email" name="email" type="email" required autoComplete="email" />
          <input className="input" placeholder="Password (min 8 chars)" name="password" type="password" minLength={8} required autoComplete="new-password" />
          <button type="submit" className="w-full btn-primary">Create account</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link href="/auth/sign-in" className="text-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
