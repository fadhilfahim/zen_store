import nodemailer from "nodemailer";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

import { buildWhatsAppMessage, getWhatsAppLink } from "@/lib/whatsapp";
import type { Order } from "@/lib/domain";

/* ---------------- SMTP CHECK ---------------- */

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
    console.log("[email:mock]", {
      to,
      subject,
      attachmentCount: attachments?.length ?? 0,
    });
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
    attachments,
  });
}

/* ---------------- WHATSAPP (CLICK TO CHAT) ---------------- */

/* ---------------- PDF GENERATOR (SAFE + PREMIUM) ---------------- */

async function generateReceiptPDF(order: Order): Promise<Buffer> {
  console.log("[pdf] starting generation...");

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 850]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 780;

  /* ---------------- LOGO (SAFE) ---------------- */
  try {
    const logoPath = path.join(process.cwd(), "public/image.png");

    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      const logo = await pdfDoc.embedPng(logoBytes);

      page.drawImage(logo, {
        x: 40,
        y: y - 20,
        width: 55,
        height: 55,
      });
    } else {
      console.log("[pdf] logo not found");
    }
  } catch (err) {
    console.log("[pdf] logo skipped safely");
  }

  /* ---------------- HEADER ---------------- */
  page.drawText("ZEN", {
    x: 110,
    y,
    size: 28,
    font: bold,
    color: rgb(0, 0, 0),
  });

  page.drawText("INVOICE", {
    x: 110,
    y: y - 20,
    size: 12,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  y -= 80;

  /* ---------------- ORDER INFO ---------------- */
  page.drawText(`Order ID: ${order.id}`, { x: 40, y, size: 11, font: bold });
  page.drawText(
    `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
    { x: 350, y, size: 11, font }
  );

  y -= 25;

  page.drawText(`Customer: ${order.customer.fullName}`, {
    x: 40,
    y,
    size: 11,
    font,
  });

  y -= 15;

  page.drawText(`Phone: ${order.customer.phone}`, {
    x: 40,
    y,
    size: 11,
    font,
  });

  y -= 15;

  page.drawText(`Email: ${order.customer.email}`, {
    x: 40,
    y,
    size: 11,
    font,
  });

  y -= 30;

  /* ---------------- TABLE HEADER ---------------- */
  page.drawText("Item", { x: 40, y, size: 11, font: bold });
  page.drawText("Qty", { x: 260, y, size: 11, font: bold });
  page.drawText("Price", { x: 320, y, size: 11, font: bold });
  page.drawText("Total", { x: 420, y, size: 11, font: bold });

  y -= 10;

  page.drawLine({
    start: { x: 40, y },
    end: { x: 550, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  y -= 20;

  /* ---------------- ITEMS ---------------- */
  order.items.forEach((item) => {
    const total = item.price * item.quantity;

    page.drawText(`${item.name}`, { x: 40, y, size: 10, font });
    page.drawText(`${item.quantity}`, { x: 260, y, size: 10, font });
    page.drawText(`LKR ${item.price}`, { x: 320, y, size: 10, font });
    page.drawText(`LKR ${total}`, { x: 420, y, size: 10, font });

    y -= 18;
  });

  y -= 20;

  /* ---------------- TOTAL ---------------- */
  page.drawLine({
    start: { x: 40, y },
    end: { x: 550, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  y -= 25;

  page.drawText("TOTAL", {
    x: 320,
    y,
    size: 14,
    font: bold,
  });

  page.drawText(`LKR ${order.total}`, {
    x: 420,
    y,
    size: 14,
    font: bold,
  });

  /* ---------------- FOOTER ---------------- */
  page.drawLine({
    start: { x: 40, y: 60 },
    end: { x: 550, y: 60 },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9),
  });

  page.drawText(
    "ZEN • no noise.just ZEN • Thank you for your purchase",
    { x: 40, y: 40, size: 9, font, color: rgb(0.5, 0.5, 0.5) }
  );

  page.drawText("This invoice was generated automatically.", {
    x: 40,
    y: 25,
    size: 8,
    font,
    color: rgb(0.6, 0.6, 0.6),
  });

  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);

  console.log("[pdf] generated size:", buffer.length);

  return buffer;
}

/* ---------------- MAIN NOTIFICATION ---------------- */

export async function notifyOrderPlaced(order: Order) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const customerEmail = order.customer.email;
  const adminWhatsApp = process.env.ADMIN_WHATSAPP_PHONE;

  const subject = `ZEN Order: ${order.id}`;

  /* ---------------- PDF ---------------- */
  let pdfBuffer: Buffer | null = null;

  try {
    pdfBuffer = await generateReceiptPDF(order);
  } catch (err) {
    console.error("❌ PDF GENERATION FAILED:", err);
  }

  const attachments = pdfBuffer
    ? [
        {
          filename: `ZEN-invoice-${order.id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ]
    : undefined;

  /* ---------------- EMAIL TEXT ---------------- */
  const text = `
Order: ${order.id}
Customer: ${order.customer.fullName}
Total: LKR ${order.total}
`;

  /* ---------------- WHATSAPP ---------------- */
  const message = buildWhatsAppMessage(order);

  console.log("[whatsapp links]", [
    getWhatsAppLink(order.customer.phone, message),
    adminWhatsApp ? getWhatsAppLink(adminWhatsApp, message) : null,
  ]);

  /* ---------------- SEND EMAILS ---------------- */
  await Promise.allSettled([
    adminEmail
      ? sendEmail({ to: adminEmail, subject, text, attachments })
      : Promise.resolve(),

    sendEmail({
      to: customerEmail,
      subject,
      text,
      attachments,
    }),
  ]);
}