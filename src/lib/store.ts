import { ProductSchema, type Order, OrderSchema, type Product } from "@/lib/domain";
import { readJsonBlob, writeJsonBlob } from "@/lib/blob-json";
import { seedProducts } from "@/lib/seed";

const PRODUCTS_PATH = "data/products.json";
const ORDERS_PATH = "data/orders.json";

type ProductsDoc = { products: Product[] };
type OrdersDoc = { orders: Order[] };

function nowIso() {
  return new Date().toISOString();
}

function formatOrderDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function nextOrderId(orders: Order[]) {
  const date = formatOrderDate();
  const existingOrderNumbers = orders
    .map((order) => {
      const match = order.id.match(/^order_\d{8}(\d{6})$/);
      return match ? Number(match[1]) : null;
    })
    .filter((value): value is number => value !== null);

  const next = existingOrderNumbers.length ? Math.max(...existingOrderNumbers) + 1 : 1;
  return `order_${date}${String(next).padStart(6, "0")}`;
}

export async function getProducts(): Promise<Product[]> {
  const doc = await readJsonBlob<ProductsDoc>({
    pathname: PRODUCTS_PATH,
    fallback: { products: seedProducts },
  });

  const parsed = (doc.products ?? []).map((p) => ProductSchema.parse(p));
  return parsed;
}

export async function getProduct(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) ?? null;
}

export async function saveProducts(products: Product[]) {
  const normalized = products.map((p) => ProductSchema.parse(p));
  await writeJsonBlob(PRODUCTS_PATH, { products: normalized });
}

export async function upsertProduct(product: Product) {
  const products = await getProducts();
  const next = ProductSchema.parse(product);
  const idx = products.findIndex((p) => p.id === next.id);
  const updated = idx === -1 ? [next, ...products] : products.map((p) => (p.id === next.id ? next : p));
  await saveProducts(updated);
}

export async function deleteProductById(id: string) {
  const products = await getProducts();
  const updated = products.filter((p) => p.id !== id);
  await saveProducts(updated);
}

export async function getOrders(): Promise<Order[]> {
  const doc = await readJsonBlob<OrdersDoc>({
    pathname: ORDERS_PATH,
    fallback: { orders: [] },
  });
  return (doc.orders ?? []).map((o) => OrderSchema.parse(o));
}

export async function getOrder(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((order) => order.id === id) ?? null;
}

export async function createOrder(input: Omit<Order, "id" | "createdAt" | "status">) {
  const orders = await getOrders();
  const order: Order = OrderSchema.parse({
    ...input,
    id: nextOrderId(orders),
    createdAt: nowIso(),
    status: "PLACED",
  });
  await writeJsonBlob(ORDERS_PATH, { orders: [order, ...orders] });
  return order;
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const orders = await getOrders();
  const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
  await writeJsonBlob(ORDERS_PATH, { orders: updated });
}

