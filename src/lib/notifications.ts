import nodemailer from "nodemailer";

import type { Order } from "@/lib/domain";

function hasSmtp() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
  );
}

async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  if (!hasSmtp()) {
    console.log("[email:mock]", { to, subject, text });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
}

async function sendWhatsAppMock(payload: unknown) {
  const url = process.env.WHATSAPP_WEBHOOK_URL;
  if (!url) {
    console.log("[whatsapp:mock]", payload);
    return;
  }
  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function orderText(order: Order) {
  const lines = [
    `Order: ${order.id}`,
    `Status: ${order.status}`,
    `Payment: ${order.paymentMethod}`,
    "",
    "Customer",
    `Name: ${order.customer.fullName}`,
    `Phone: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    `Address: ${order.customer.address}`,
    "",
    "Items",
    ...order.items.map(
      (i) =>
        `- ${i.name} (${i.size}, ${i.color}) x${i.quantity} = ${i.price * i.quantity}`,
    ),
    "",
    `Total: ${order.total}`,
  ];
  return lines.join("\n");
}

export async function notifyOrderPlaced(order: Order) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const customerEmail = order.customer.email;
  const subject = `ZEN order placed: ${order.id}`;
  const text = orderText(order);

  await Promise.allSettled([
    adminEmail ? sendEmail({ to: adminEmail, subject, text }) : Promise.resolve(),
    sendEmail({ to: customerEmail, subject, text }),
    sendWhatsAppMock({
      type: "ORDER_PLACED",
      orderId: order.id,
      customerPhone: order.customer.phone,
      message: text,
    }),
  ]);
}

