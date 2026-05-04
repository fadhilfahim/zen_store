"use server";

import { z } from "zod";

import { PaymentMethodEnum } from "@/lib/domain";
import { createOrder } from "@/lib/store";
import { notifyOrderPlaced } from "@/lib/notifications";

const CheckoutSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email(),
  address: z.string().min(6),
  paymentMethod: PaymentMethodEnum,
  itemsJson: z.string().min(2),
});

const ItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  image: z.string().optional(),
  size: z.enum(["S", "M", "L", "XL"]),
  color: z.string(),
  quantity: z.number().int().positive(),
});

export type PlaceOrderState =
  | { ok: true; orderId: string }
  | { ok: false; message: string };

export async function placeOrder(
  _prev: PlaceOrderState | null,
  formData: FormData,
): Promise<PlaceOrderState> {
  try {
    const raw = {
      fullName: String(formData.get("fullName") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      address: String(formData.get("address") || ""),
      paymentMethod: String(formData.get("paymentMethod") || ""),
      itemsJson: String(formData.get("itemsJson") || ""),
    };

    const parsed = CheckoutSchema.parse(raw);
    const items = z.array(ItemSchema).min(1).parse(JSON.parse(parsed.itemsJson));
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

    const order = await createOrder({
      customer: {
        fullName: parsed.fullName,
        phone: parsed.phone,
        email: parsed.email,
        address: parsed.address,
      },
      items,
      total,
      paymentMethod: parsed.paymentMethod,
    });

    await notifyOrderPlaced(order);
    return { ok: true, orderId: order.id };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to place order.";
    return { ok: false, message };
  }
}

