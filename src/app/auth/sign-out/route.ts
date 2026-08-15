import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

export async function POST() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  return NextResponse.redirect(
    new URL('/auth/sign-in', process.env.NEXT_PUBLIC_APP_URL),
    303
  );
}
