"use server";

import { put } from "@vercel/blob";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ProductSchema, type Product } from "@/lib/domain";
import { getProduct, upsertProduct } from "@/lib/store";
import { deleteBlobByUrl } from "@/lib/blob-json";

function splitCsv(v: string) {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `zen-${crypto.randomUUID().slice(0, 8)}`
    : `zen-${Date.now()}`;
}

export async function adminSaveProduct(formData: FormData) {
  const raw = {
    id: String(formData.get("id") || "").trim() || newId(),
    name: String(formData.get("name") || "").trim(),
    price: Number(formData.get("price") || 0),
    description: String(formData.get("description") || "").trim(),
    category: String(formData.get("category") || "").trim() || "Essentials",
    stock: Number(formData.get("stock") || 0),
    colors: splitCsv(String(formData.get("colors") || "")),
    sizes: splitCsv(String(formData.get("sizes") || "")) as any,
    images: (() => {
      const rawImages = String(formData.get("imagesJson") || "[]");
      try {
        return z.array(z.string()).parse(JSON.parse(rawImages));
      } catch {
        return [];
      }
    })(),
  };

  const parsed = ProductSchema.parse(raw);
  await upsertProduct(parsed);
  revalidatePath("/admin");
  revalidatePath(`/admin/products/${parsed.id}/edit`);
  revalidatePath("/shop");
  revalidatePath(`/product/${parsed.id}`);
  redirect(`/admin/products/${parsed.id}/edit`);
}

export async function adminUploadProductImage(formData: FormData): Promise<Product> {
  const id = z.string().min(1).parse(String(formData.get("id") || ""));
  const file = formData.get("image") as File | null;
  if (!file) throw new Error("Missing image file.");

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN (required for image uploads).");
  }

  const ext = (() => {
    const t = file.type;
    if (t === "image/png") return "png";
    if (t === "image/webp") return "webp";
    if (t === "image/jpeg") return "jpg";
    if (t === "image/svg+xml") return "svg";
    return "bin";
  })();

  const key = `products/${id}/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
  const blob = await put(key, file, { access: "public" });

  const existing = await getProduct(id);
  if (!existing) throw new Error("Product not found.");

  const updated = { ...existing, images: [blob.url, ...existing.images] };
  await upsertProduct(updated);

  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath(`/product/${id}`);
  revalidatePath("/shop");
  return updated;
}

export async function adminRemoveProductImage(formData: FormData): Promise<Product> {
  const id = z.string().min(1).parse(String(formData.get("id") || ""));
  const url = z.string().min(1).parse(String(formData.get("url") || ""));

  const existing = await getProduct(id);
  if (!existing) throw new Error("Product not found.");

  const updated = { ...existing, images: existing.images.filter((u) => u !== url) };
  await upsertProduct(updated);
  await deleteBlobByUrl(url);

  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath(`/product/${id}`);
  revalidatePath("/shop");
  return updated;
}

