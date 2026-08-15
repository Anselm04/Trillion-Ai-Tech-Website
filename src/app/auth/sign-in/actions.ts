'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabase';

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/auth/sign-in?error=${encodeURIComponent(error.message)}`);
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signInWithOAuth(provider: 'google' | 'apple') {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm` }
  });
  if (error || !data.url) redirect(`/auth/sign-in?error=${encodeURIComponent(error?.message || 'OAuth failed')}`);
  redirect(data.url);
}
