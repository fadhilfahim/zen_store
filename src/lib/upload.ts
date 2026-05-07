import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabaseAdmin";

function sanitizeStorageKeyPart(input: string) {
  // Supabase Storage object keys are treated as paths and have stricter
  // character expectations than URLs.
  return input
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "") // strip non-ascii
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

function makeProductsObjectKey(file: File) {
  const original = file.name || "upload";
  const lastDot = original.lastIndexOf(".");
  const ext =
    lastDot >= 0 ? original.slice(lastDot + 1) : "";
  const base = lastDot >= 0 ? original.slice(0, lastDot) : original;

  const safeBase = sanitizeStorageKeyPart(base) || "file";
  const safeExt = sanitizeStorageKeyPart(ext).toLowerCase();

  // Example: 1778134856501-Screenshot-2026-05-04-at-10.31.45-PM.png
  return safeExt
    ? `${Date.now()}-${safeBase}.${safeExt}`
    : `${Date.now()}-${safeBase}`;
}

export async function uploadImage(file: File) {
  const fileName = makeProductsObjectKey(file);

  // Use the service-role client so Storage RLS doesn't block uploads.
  const { error } = await supabaseAdmin.storage
    .from("products")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabaseAdmin.storage
    .from("products")
    .getPublicUrl(fileName);

  if (!data?.publicUrl) {
    throw new Error("Failed to get public URL after upload.");
  }

  return data.publicUrl;
}

export async function deleteImage(url: string) {
  // Extract the file path from the public URL
  // Supabase public URLs are like: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
  const urlParts = url.split('/storage/v1/object/public/products/');
  if (urlParts.length !== 2) return; // Not a valid Supabase storage URL

  const fileName = decodeURIComponent(urlParts[1]);

  const { error } = await supabaseAdmin.storage
    .from("products")
    .remove([fileName]);

  if (error) throw error;
}