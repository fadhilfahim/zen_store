import type { Order } from "@/lib/domain";

export function buildWhatsAppMessage(order: Order) {
  const itemLines = order.items
    .map((item) => {
      const total = item.price * item.quantity;
      const metadata = [item.color, item.size].filter(Boolean).join(" • ");
      return `- ${item.name}${metadata ? ` (${metadata})` : ""} x${item.quantity} = LKR ${total}`;
    })
    .join("\n");

  return `🧾 ZEN ORDER CONFIRMED

Order ID: ${order.id}
Date: ${new Date(order.createdAt).toLocaleDateString()}

Customer: ${order.customer.fullName}
Phone: ${order.customer.phone}
Email: ${order.customer.email}
Address: ${order.customer.address}

Payment: ${order.paymentMethod}

Items:
${itemLines}

Total: LKR ${order.total}

Thank you for shopping with ZEN`;
}

export function getWhatsAppLink(phone: string, message: string) {
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
