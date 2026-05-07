import { supabase } from "@/lib/supabase";

/* ---------------- GET ALL ORDERS ---------------- */

export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

/* ---------------- GET SINGLE ORDER ---------------- */

export async function getOrder(id: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("GET ORDER ERROR:", error);
    return null;
  }

  return data;
}

/* ---------------- CREATE ORDER ---------------- */

export async function createOrder(input: {
  customer_name: string;
  email: string;
  phone: string;
  address?: string;
  payment_method?: string;

  items: {
    product_id: string;
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }[];
}) {
  const total = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customer_name,
      email: input.email,
      phone: input.phone,
      address: input.address || "",
      payment_method: input.payment_method || "COD",

      total_amount: total,
      status: "PLACED",

      items: input.items,
    })
    .select()
    .single();

  if (error) {
    console.error("CREATE ORDER ERROR:", error);
    throw error;
  }

  return {
    id: data.id,
    status: data.status,
    total: data.total_amount,
    createdAt: data.created_at,
    paymentMethod: data.payment_method,

    customer: {
      fullName: data.customer_name,
      phone: data.phone,
      email: data.email,
      address: data.address,
    },

    items: data.items,
  };
}

/* ---------------- UPDATE ORDER STATUS ---------------- */

export async function updateOrderStatus(
  id: string,
  status: "PLACED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}