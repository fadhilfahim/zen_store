import { z } from "zod";

export const SizeEnum = z.enum(["S", "M", "L", "XL"]);

export const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string().min(1),
  images: z.array(z.string().min(1)).default([]),
  colors: z.array(z.string().min(1)).default([]),
  sizes: z.array(SizeEnum).default(["S", "M", "L", "XL"]),
  stock: z.number().int().nonnegative(),
  category: z.string().optional().default("Essentials"),
});

export type Product = z.infer<typeof ProductSchema>;

export const OrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  image: z.string().min(1).optional(),
  size: SizeEnum,
  color: z.string(),
  quantity: z.number().int().positive(),
});

export const PaymentMethodEnum = z.enum(["BANK_DEPOSIT", "COD"]);
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;

export const OrderStatusEnum = z.enum(["PLACED", "CONFIRMED", "SHIPPED", "CANCELLED"]);
export type OrderStatus = z.infer<typeof OrderStatusEnum>;

export const OrderSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string(),
  customer: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(6),
    email: z.string().email(),
    address: z.string().min(6),
  }),
  items: z.array(OrderItemSchema).min(1),
  total: z.number().nonnegative(),
  paymentMethod: PaymentMethodEnum,
  status: OrderStatusEnum.default("PLACED"),
});

export type Order = z.infer<typeof OrderSchema>;

