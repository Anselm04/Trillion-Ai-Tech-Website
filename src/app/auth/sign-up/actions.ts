'use server';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase';

export async function signUpWithPassword(formData: FormData) {
  const fullName = String(formData.get('full_name') || '');
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
      data: { full_name: fullName }
    }
  });
  if (error) redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`);
  if (data.user) {
    await supabase.from('profiles').upsert({ id: data.user.id, email, full_name: fullName });
  }
  redirect('/auth/sign-in?message=Check+your+email+to+confirm+your+account');
}
