import type { Product } from "@/lib/domain";

export const seedProducts: Omit<Product, "id" | "created_at">[] = [
  {
    name: "Oversized Tee",
    price: 2400,
    description:
      "A heavyweight oversized tee with clean drape and minimal branding. Designed for everyday rotation.",
    images: ["/zen-placeholder.svg"],
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL"],
    stock: 24,
    category: "Tops",
  },
  {
    name: "Utility Hoodie",
    price: 5400,
    description:
      "Structured hoodie with premium feel and subtle texture. Clean lines, bold presence.",
    images: ["/zen-placeholder.svg"],
    colors: ["Grey", "Black"],
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
    category: "Outerwear",
  },
  {
    name: "Straight-Leg Trouser",
    price: 6200,
    description:
      "Tailored street trouser with a straight leg and modern rise. Made to elevate the basic fit.",
    images: ["/zen-placeholder.svg"],
    colors: ["Black", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    stock: 8,
    category: "Bottoms",
  },
];