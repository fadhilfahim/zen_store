import { z } from "zod";

/* ---------------- PRODUCT ---------------- */

export const ProductSchema = z.object({
  id: z.string(), 
  name: z.string(),
  description: z.string().nullable().optional(),
  price: z.number(),
  category: z.string().nullable().optional(),
  images: z.array(z.string()).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  sizes: z.array(z.string()).optional().default([]),

  stock: z.number().optional().default(0),
  created_at: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

/* ---------------- ORDER ITEM ---------------- */

export const OrderItemSchema = z.object({
  id: z.string().uuid().optional(),
  order_id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  quantity: z.number(),
  price: z.number(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

/* ---------------- ORDER ---------------- */

export const OrderSchema = z.object({
  id: z.string().uuid(),
  customer_name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  total_amount: z.number(),
  status: z.enum(["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"]),
  payment_method: z.string().optional(),
  created_at: z.string().optional(),
  items: z.array(OrderItemSchema).optional(),
});

export type Order = z.infer<typeof OrderSchema>;