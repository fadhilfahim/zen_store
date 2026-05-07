import { supabase } from "@/lib/supabase";
import { ProductSchema, type Product } from "@/lib/domain";

/* ---------------- GET ALL PRODUCTS ---------------- */

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*");

  if (error) throw error;

  if (!data) return [];

  return data
    .map((p) => ProductSchema.safeParse(p))
    .filter((r) => r.success)
    .map((r) => r.data);
}

/* ---------------- GET ONE PRODUCT ---------------- */

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("GET PRODUCT ERROR:", error);
    return null;
  }

  if (!data) return null;

  const result = ProductSchema.safeParse(data);
  if (!result.success) {
    console.error("ZOD ERROR (getProduct):", result.error);
    return null;
  }

  return result.data;
}

/* ---------------- CREATE PRODUCT ---------------- */

export async function createProduct(
  product: Omit<Product, "id" | "created_at">
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Create failed: no data returned from DB");
  }

  const result = ProductSchema.safeParse(data);

  if (!result.success) {
    console.error("ZOD ERROR (createProduct):", result.error);
    throw new Error("Invalid product returned from DB");
  }

  return result.data;
}

/* ---------------- UPDATE PRODUCT ---------------- */

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Update failed: no data returned from DB");
  }

  const result = ProductSchema.safeParse(data);

  if (!result.success) {
    console.error("ZOD ERROR (updateProduct):", result.error);
    throw new Error("Invalid product returned from DB");
  }

  return result.data;
}

/* ---------------- DELETE PRODUCT ---------------- */

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    throw error;
  }
}