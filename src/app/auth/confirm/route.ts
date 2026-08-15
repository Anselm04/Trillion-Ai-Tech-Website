import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type') as 'signup' | 'recovery' | 'email' | null;
  const next = url.searchParams.get('next') || '/dashboard';

  if (!token_hash || !type)
    return NextResponse.redirect(new URL('/auth/sign-in?error=Invalid+confirmation+link', request.url));

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash });
  if (error)
    return NextResponse.redirect(new URL(`/auth/sign-in?error=${encodeURIComponent(error.message)}`, request.url));

  return NextResponse.redirect(new URL(next, request.url));
}
