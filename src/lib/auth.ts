import { redirect } from 'next/navigation';
import { createServerSupabase } from './supabase';

export async function requireUser() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');
  return { user, supabase };
}

export async function requireAdmin() {
  const { user, supabase } = await requireUser();
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
  if (!data || data.role !== 'admin') redirect('/dashboard');
  return { user, supabase };
}
