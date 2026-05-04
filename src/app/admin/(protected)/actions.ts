"use server";

import { z } from "zod";

import { deleteProductById, updateOrderStatus } from "@/lib/store";

export async function adminDeleteProduct(formData: FormData) {
  const id = z.string().min(1).parse(String(formData.get("id") || ""));
  await deleteProductById(id);
}

export async function adminUpdateOrderStatus(formData: FormData) {
  const id = z.string().min(1).parse(String(formData.get("id") || ""));
  const status = z
    .enum(["PLACED", "CONFIRMED", "SHIPPED", "CANCELLED"])
    .parse(String(formData.get("status") || ""));
  await updateOrderStatus(id, status);
}

