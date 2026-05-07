import { supabaseAdmin } from "./supabaseAdmin";

const PRODUCTS_PUBLIC_URL_PREFIX =
  "/storage/v1/object/public/products/";

/**
 * If `value` is a Supabase public URL for the `products` bucket, convert it
 * to a signed URL so it works even when the bucket is not public.
 *
 * If it's already local (starts with `/`) or not a products public URL, it is returned as-is.
 */
export async function resolveProductImageUrl(
  value: string,
  expiresInSeconds = 60 * 60 * 24, // 24h
) {
  if (!value) return value;

  // Only convert Supabase storage public URLs.
  if (!value.startsWith("http")) return value;

  const idx = value.indexOf(PRODUCTS_PUBLIC_URL_PREFIX);
  if (idx === -1) return value;

  const encodedKey = value.slice(idx + PRODUCTS_PUBLIC_URL_PREFIX.length);
  const fileName = decodeURIComponent(encodedKey);

  const { data, error } = await supabaseAdmin.storage
    .from("products")
    .createSignedUrl(fileName, expiresInSeconds);

  if (error || !data?.signedUrl) return value;
  return data.signedUrl;
}

