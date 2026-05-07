"use server";

import { uploadImage, deleteImage } from "@/lib/upload";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ProductSchema, type Product } from "@/lib/domain";
import { getProduct, updateProduct, createProduct } from "@/server/products";

function splitCsv(v: string) {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function generateId(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") +
    "-" +
    Math.floor(Math.random() * 1000)
  );
}

/* ---------------- CREATE / UPDATE PRODUCT ---------------- */

export async function adminSaveProduct(formData: FormData) {
  try {
    const get = (k: string) => String(formData.get(k) ?? "").trim();

    const name = get("name");
    if (!name) throw new Error("Name is required");

    const idRaw = get("id");
    const isEdit = !!idRaw && idRaw.trim().length > 0;
    const id = isEdit ? idRaw : generateId(name);

    const productData = {
      id,
      name,
      price: Number(get("price")),
      description: get("description"),
      category: get("category") || "Essentials",
      stock: Number(get("stock")),
      colors: splitCsv(get("colors")),
      sizes: splitCsv(get("sizes")),
      images: [],
    };

    const parsed = ProductSchema.safeParse(productData);

    if (!parsed.success) {
      console.error("ZOD ERROR:", parsed.error);
      throw new Error("Invalid product data");
    }

    const product = parsed.data;

    if (isEdit) {
      const existing = await getProduct(id);

      if (!existing) {
        throw new Error("Cannot update: product does not exist");
      }

      await updateProduct(id, product);
    } else {
      await createProduct(product);
    }

    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath(`/product/${id}`);

    redirect(`/admin/products/${id}/edit`);
  } catch (error) {
    // Next.js `redirect()` throws internally (digest starts with `NEXT_REDIRECT`).
    // We should not treat that as a failure.
    const digest =
      typeof error === "object" && error !== null
        ? (error as { digest?: unknown }).digest
        : undefined;

    if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("🔥 ADMIN SAVE FAILED:");
    console.error(error);
    throw error;
  }
}

/* ---------------- UPLOAD IMAGE ---------------- */

export async function adminUploadProductImage(
  formData: FormData
): Promise<Product> {
  const id = z.string().min(1).parse(String(formData.get("id") || ""));
  const file = formData.get("image") as File | null;

  if (!file) throw new Error("Missing image file.");

  const imageUrl = await uploadImage(file);
  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("uploadImage returned an empty/invalid URL.");
  }

  const existing = await getProduct(id);
  if (!existing) throw new Error("Product not found.");

  const updated: Product = {
    ...existing,
    images: [...(existing.images ?? []), imageUrl], // ✅ FIXED ORDER
  };

  await updateProduct(id, {
    images: updated.images, // ✅ safer partial update
  });

  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath(`/product/${id}`);
  revalidatePath("/shop");

  return updated;
}

/* ---------------- REMOVE IMAGE ---------------- */

export async function adminRemoveProductImage(
  formData: FormData
): Promise<Product> {
  const id = z.string().min(1).parse(String(formData.get("id") || ""));
  const url = z.string().min(1).parse(String(formData.get("url") || ""));

  const existing = await getProduct(id);
  if (!existing) throw new Error("Product not found.");

  const updatedImages = (existing.images ?? []).filter((u) => u !== url);

  await updateProduct(id, {
    images: updatedImages,
  });

  await deleteImage(url);

  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath(`/product/${id}`);
  revalidatePath("/shop");

  return {
    ...existing,
    images: updatedImages,
  };
}