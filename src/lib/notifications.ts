"use server";

import nodemailer from "nodemailer";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import {
  buildWhatsAppMessage,
  getWhatsAppLink,
} from "@/lib/whatsapp";

import type { Order } from "@/lib/domain";

/* ---------------- SMTP ---------------- */

function hasSmtp() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
  );
}

/* ---------------- EMAIL ---------------- */

async function sendEmail({
  to,
  subject,
  text,
  attachments,
}: {
  to: string;
  subject: string;
  text: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}) {
  if (!hasSmtp()) {
    console.log("[email:mock]", { to, subject });
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

  const from =
    process.env.MAIL_FROM || process.env.SMTP_USER!;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    attachments,
  });

  console.log("[email:sent]", to);
}

/* ---------------- PDF ---------------- */

async function generateReceiptPDF(
  order: any,
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([600, 850]);

  const font = await pdfDoc.embedFont(
    StandardFonts.Helvetica,
  );

  const bold = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold,
  );

  let y = 780;

  /* ---------------- HEADER ---------------- */

  page.drawRectangle({
    x: 0,
    y: 760,
    width: 600,
    height: 90,
    color: rgb(0, 0, 0),
  });

  page.drawText("ZEN", {
    x: 40,
    y: 800,
    size: 28,
    font: bold,
    color: rgb(1, 1, 1),
  });

  page.drawText("PREMIUM STREETWEAR", {
    x: 40,
    y: 780,
    size: 10,
    font,
    color: rgb(0.8, 0.8, 0.8),
  });

  y = 720;

  /* ---------------- INVOICE TITLE ---------------- */

  page.drawText("ORDER INVOICE", {
    x: 40,
    y,
    size: 20,
    font: bold,
  });

  y -= 40;

  /* ---------------- CUSTOMER INFO ---------------- */

  page.drawText(`Order ID: ${order.id}`, {
    x: 40,
    y,
    size: 11,
    font: bold,
  });

  y -= 18;

  page.drawText(
    `Date: ${new Date(
      order.createdAt || Date.now(),
    ).toLocaleString()}`,
    {
      x: 40,
      y,
      size: 10,
      font,
    },
  );

  y -= 30;

  page.drawText("CUSTOMER DETAILS", {
    x: 40,
    y,
    size: 12,
    font: bold,
  });

  y -= 20;

  page.drawText(
    `Name: ${order.customer.fullName}`,
    {
      x: 40,
      y,
      size: 10,
      font,
    },
  );

  y -= 16;

  page.drawText(
    `Email: ${order.customer.email}`,
    {
      x: 40,
      y,
      size: 10,
      font,
    },
  );

  y -= 16;

  page.drawText(
    `Phone: ${order.customer.phone}`,
    {
      x: 40,
      y,
      size: 10,
      font,
    },
  );

  y -= 16;

  page.drawText(
    `Address: ${order.customer.address}`,
    {
      x: 40,
      y,
      size: 10,
      font,
    },
  );

  y -= 16;

  page.drawText(
    `Payment Method: ${order.paymentMethod}`,
    {
      x: 40,
      y,
      size: 10,
      font,
    },
  );

  y -= 40;

  /* ---------------- TABLE ---------------- */

  page.drawRectangle({
    x: 40,
    y: y - 5,
    width: 520,
    height: 25,
    color: rgb(0.95, 0.95, 0.95),
  });

  page.drawText("ITEM", {
    x: 50,
    y,
    size: 10,
    font: bold,
  });

  page.drawText("QTY", {
    x: 320,
    y,
    size: 10,
    font: bold,
  });

  page.drawText("PRICE", {
    x: 390,
    y,
    size: 10,
    font: bold,
  });

  page.drawText("TOTAL", {
    x: 480,
    y,
    size: 10,
    font: bold,
  });

  y -= 30;

  /* ---------------- ITEMS ---------------- */

  order.items.forEach((item: any) => {
    const total =
      item.price * item.quantity;

    page.drawText(
      `${item.name} (${item.size || "-"} / ${
        item.color || "-"
      })`,
      {
        x: 50,
        y,
        size: 10,
        font,
      },
    );

    page.drawText(
      `${item.quantity}`,
      {
        x: 320,
        y,
        size: 10,
        font,
      },
    );

    page.drawText(
      `LKR ${item.price}`,
      {
        x: 390,
        y,
        size: 10,
        font,
      },
    );

    page.drawText(
      `LKR ${total}`,
      {
        x: 480,
        y,
        size: 10,
        font,
      },
    );

    y -= 22;
  });

  y -= 20;

  /* ---------------- TOTAL ---------------- */

  page.drawLine({
    start: { x: 350, y },
    end: { x: 560, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  y -= 25;

  page.drawText("TOTAL", {
    x: 390,
    y,
    size: 14,
    font: bold,
  });

  page.drawText(
    `LKR ${order.total}`,
    {
      x: 480,
      y,
      size: 14,
      font: bold,
    },
  );

  /* ---------------- FOOTER ---------------- */

  page.drawLine({
    start: { x: 40, y: 60 },
    end: { x: 560, y: 60 },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9),
  });

  page.drawText(
    "ZEN • Premium Streetwear",
    {
      x: 40,
      y: 40,
      size: 10,
      font: bold,
      color: rgb(0.4, 0.4, 0.4),
    },
  );

  page.drawText(
    "Thank you for shopping with us.",
    {
      x: 40,
      y: 24,
      size: 9,
      font,
      color: rgb(0.5, 0.5, 0.5),
    },
  );

  const pdfBytes = await pdfDoc.save();

  return Buffer.from(pdfBytes);
}

/* ---------------- MAIN ---------------- */

export async function notifyOrderPlaced(
  order: any,
) {
  const adminEmail =
    process.env.ADMIN_EMAIL;

  const customerEmail =
    order.customer.email;

  const subject = `ZEN Order ${order.id}`;

  /* ---------------- PDF ---------------- */

  let pdfBuffer: Buffer | null = null;

  try {
    pdfBuffer =
      await generateReceiptPDF(order);

    console.log("[pdf] generated");
  } catch (err) {
    console.error("[pdf:error]", err);
  }

  const attachments = pdfBuffer
    ? [
        {
          filename: `ZEN-INVOICE-${order.id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ]
    : undefined;

  /* ---------------- EMAIL TEXT ---------------- */

  const text = `
Order ID: ${order.id}

Customer: ${order.customer.fullName}

Payment: ${order.paymentMethod}

Total: LKR ${order.total}

Thank you for shopping with ZEN.
`;

  /* ---------------- WHATSAPP ---------------- */

  const message =
    buildWhatsAppMessage(order);

  console.log(
    "[whatsapp:customer]",
    getWhatsAppLink(
      order.customer.phone,
      message,
    ),
  );

  /* ---------------- SEND EMAILS ---------------- */

  await Promise.allSettled([
    adminEmail
      ? sendEmail({
          to: adminEmail,
          subject,
          text,
          attachments,
        })
      : Promise.resolve(),

    customerEmail
      ? sendEmail({
          to: customerEmail,
          subject,
          text,
          attachments,
        })
      : Promise.resolve(),
  ]);
}