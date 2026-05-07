import type { Order } from "@/lib/domain";

export function buildWhatsAppMessage(order: Order) {
  const itemLines =
    (order.items ?? [])
      .map((item) => {
        const total = item.price * item.quantity;

        // we only have product_id in DB (no name/color/size stored here)
        return `- ${item.product_id} x${item.quantity} = LKR ${total}`;
      })
      .join("\n") || "No items";

  const date = order.created_at
    ? new Date(order.created_at).toLocaleDateString()
    : "-";

  return `🧾 ZEN ORDER CONFIRMED

Order ID: ${order.id}
Date: ${date}

Customer: ${order.customer_name}
Phone: ${order.phone}
Email: ${order.email}

Items:
${itemLines}

Payment: CASH ON DELIVERY

Total: LKR ${order.total_amount}

Thank you for shopping with ZEN`;
}

export function getWhatsAppLink(phone: string, message: string) {
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}