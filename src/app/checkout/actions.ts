"use server";

import { z } from "zod";

import { createOrder } from "@/server/orders";
import { notifyOrderPlaced } from "@/lib/notifications";

/* ---------------- PAYMENT ENUM ---------------- */

const PaymentMethodEnum = z.enum(["COD", "CARD", "BANK"]);

/* ---------------- CHECKOUT SCHEMA ---------------- */

const CheckoutSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email(),
  address: z.string().min(6),
  paymentMethod: PaymentMethodEnum,
  itemsJson: z.string().min(2),
});

/* ---------------- ITEM SCHEMA ---------------- */

const SizeEnum = z.enum(["S", "M", "L", "XL"]);

const ItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  image: z.string().optional(),
  size: SizeEnum,
  color: z.string(),
  quantity: z.number().int().positive(),
});

/* ---------------- RESULT TYPE ---------------- */

export type PlaceOrderState =
  | { ok: true; order: Awaited<ReturnType<typeof createOrder>> }
  | { ok: false; message: string };

/* ---------------- ACTION ---------------- */

export async function placeOrder(
  _prev: PlaceOrderState | null,
  formData: FormData,
): Promise<PlaceOrderState> {
  try {
    /* ---------------- RAW DATA ---------------- */

    const raw = {
      fullName: String(formData.get("fullName") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      address: String(formData.get("address") || ""),
      paymentMethod: String(formData.get("paymentMethod") || ""),
      itemsJson: String(formData.get("itemsJson") || ""),
    };

    /* ---------------- VALIDATE ---------------- */

    const parsed = CheckoutSchema.parse(raw);

    const items = z
      .array(ItemSchema)
      .min(1)
      .parse(JSON.parse(parsed.itemsJson));

    /* ---------------- DB ITEMS ---------------- */

    const dbItems = items.map((item) => ({
      product_id: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      color: item.color,
    }));

    /* ---------------- CREATE ORDER ---------------- */

    const order = await createOrder({
      customer_name: parsed.fullName,
      email: parsed.email,
      phone: parsed.phone,
      address: parsed.address,
      payment_method: parsed.paymentMethod,
      items: dbItems,
    });

    /* ---------------- SEND EMAIL/PDF ---------------- */

    await notifyOrderPlaced(order);

    return {
      ok: true,
      order,
    };
  } catch (e) {
    console.error("ORDER ERROR:", e);

    return {
      ok: false,
      message:
        e instanceof Error ? e.message : "Failed to place order.",
    };
  }
}