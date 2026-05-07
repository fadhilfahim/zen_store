"use server";

import { z } from "zod";
import { deleteProduct } from "@/server/products";
import { updateOrderStatus } from "@/server/orders";

export async function adminDeleteProduct(formData: FormData) {
  const id = z.string().min(1).parse(String(formData.get("id") || ""));
  await deleteProduct(id);
}

export async function adminUpdateOrderStatus(formData: FormData) {
  const id = z.string().min(1).parse(String(formData.get("id") || ""));
  const status = z
    .enum(["PLACED","SHIPPED", "DELIVERED","CANCELLED"])
    .parse(String(formData.get("status") || ""));
  await updateOrderStatus(id, status);
}

