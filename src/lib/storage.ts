import { createServerSupabase } from './supabase';

export async function createPrivateDownloadUrl(
  path: string,
  expiresIn = 300
) {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.storage
    .from('product-files')
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}
