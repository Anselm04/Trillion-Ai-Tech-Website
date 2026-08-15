import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { createPrivateDownloadUrl } from '@/lib/storage';

export async function POST(req: NextRequest) {
  const { user, supabase } = await requireUser();
  const body = await req.json();
  const productId = String(body.productId || '');
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 });

  const { data: entitlement } = await supabase
    .from('entitlements')
    .select('id,status')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .in('status', ['active','trial','grace'])
    .single();

  if (!entitlement) return NextResponse.json({ error: 'No active entitlement' }, { status: 403 });

  const { data: grant } = await supabase
    .from('download_grants')
    .select('storage_path')
    .eq('entitlement_id', entitlement.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!grant?.storage_path) return NextResponse.json({ error: 'No file configured' }, { status: 404 });

  const url = await createPrivateDownloadUrl(grant.storage_path, 300);
  return NextResponse.json({ url });
}
