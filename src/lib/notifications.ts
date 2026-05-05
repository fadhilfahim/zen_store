import nodemailer from "nodemailer";
// @ts-ignore
import puppeteer from "puppeteer";

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
  attachments,
}: {
  to: string;
  subject: string;
  text: string;
  attachments?: Array<{ filename: string; content: Buffer; contentType: string }>;
}) {
  if (!hasSmtp()) {
    console.log("[email:mock]", { to, subject, text, attachmentCount: attachments?.length ?? 0 });
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

  try {
    console.log("[email:sending]", { to, subject, hasAttachments: !!attachments?.length });
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      attachments,
    });
    console.log("[email:sent]", to);
  } catch (error) {
    console.error("[email:error]", { to, error });
    throw error;
  }
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

function generateReceiptHTML(order: Order): string {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${item.name}</td>
      <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${item.size}</td>
      <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${item.color}</td>
      <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${item.quantity}</td>
      <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">PKR ${item.price.toFixed(2)}</td>
      <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">PKR ${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #333; padding-bottom: 20px; }
        .header h1 { font-size: 32px; font-weight: bold; letter-spacing: 2px; margin-bottom: 10px; }
        .header p { color: #666; font-size: 14px; }
        .order-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; font-size: 14px; }
        .order-info-group { }
        .order-info-group label { color: #999; font-weight: bold; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; margin-bottom: 5px; display: block; }
        .order-info-group p { color: #333; margin-bottom: 15px; line-height: 1.6; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th { background: #f9f9f9; border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold; color: #333; font-size: 13px; }
        .items-table td { border: 1px solid #ddd; padding: 12px; font-size: 13px; color: #555; }
        .totals { display: flex; justify-content: flex-end; margin-bottom: 30px; }
        .totals-box { width: 300px; }
        .totals-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; border-bottom: 1px solid #eee; }
        .totals-row.total { font-size: 18px; font-weight: bold; border-bottom: 2px solid #333; border-top: 2px solid #333; padding: 15px 0; margin-top: 10px; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
        .status-badge { display: inline-block; background: #333; color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ZEN</h1>
          <p>Order Receipt</p>
        </div>

        <div style="margin-bottom: 30px;">
          <span class="status-badge">${order.status.toUpperCase()}</span>
        </div>

        <div class="order-info">
          <div class="order-info-group">
            <label>Order Number</label>
            <p style="font-size: 16px; font-weight: bold;">${order.id}</p>
            <label style="margin-top: 15px;">Order Date</label>
            <p>${new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
          </div>
          <div class="order-info-group">
            <label>Payment Method</label>
            <p>${order.paymentMethod === "COD" ? "Cash on Delivery" : "Bank Deposit"}</p>
            <label style="margin-top: 15px;">Payment Status</label>
            <p>Pending</p>
          </div>
        </div>

        <h3 style="margin-bottom: 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #333;">Customer Information</h3>
        <div class="order-info" style="margin-bottom: 40px;">
          <div class="order-info-group">
            <label>Full Name</label>
            <p>${order.customer.fullName}</p>
            <label style="margin-top: 15px;">Phone</label>
            <p>${order.customer.phone}</p>
          </div>
          <div class="order-info-group">
            <label>Email</label>
            <p>${order.customer.email}</p>
            <label style="margin-top: 15px;">Shipping Address</label>
            <p>${order.customer.address}</p>
          </div>
        </div>

        <h3 style="margin-bottom: 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #333;">Order Items</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Size</th>
              <th style="text-align: center;">Color</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-box">
            <div class="totals-row">
              <span>Subtotal</span>
              <span>PKR ${order.total.toFixed(2)}</span>
            </div>
            <div class="totals-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div class="totals-row total">
              <span>Total</span>
              <span>PKR ${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for your order!</p>
          <p style="margin-top: 10px;">ZEN — Premium Streetwear</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function generateReceiptPDF(order: Order): Promise<Buffer> {
  const html = generateReceiptHTML(order);
  try {
    console.log("[pdf:starting-browser]", `zen-receipt-${order.id}.pdf`);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    await browser.close();
    const buffer = Buffer.from(pdfBuffer);
    console.log("[pdf:generated]", `zen-receipt-${order.id}.pdf`, `Size: ${buffer.length} bytes`);
    return buffer;
  } catch (error) {
    console.error("[pdf:generation-error]", error);
    throw error;
  }
}

export async function notifyOrderPlaced(order: Order) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const customerEmail = order.customer.email;
  const adminWhatsApp = process.env.ADMIN_WHATSAPP_PHONE;
  const subject = `ZEN order placed: ${order.id}`;
  const text = orderText(order);

  let receiptPDF: Buffer | null = null;
  try {
    console.log("[notification] Generating PDF receipt for order:", order.id);
    receiptPDF = await generateReceiptPDF(order);
    console.log("[notification] PDF generated successfully");
  } catch (err) {
    console.error("[notification:pdf-error] Failed to generate receipt PDF:", err);
    console.log("[notification] Continuing with email send (PDF attachment will be omitted)");
  }

  const attachments = receiptPDF
    ? [{
        filename: `zen-receipt-${order.id}.pdf`,
        content: receiptPDF,
        contentType: "application/pdf",
      }]
    : undefined;

  console.log("[notification] Email attachments:", attachments ? "PDF included" : "No attachments");

  const whatsappNotifications = [
    { phone: order.customer.phone, role: "customer" },
    ...(adminWhatsApp ? [{ phone: adminWhatsApp, role: "admin" }] : []),
  ].map(({ phone, role }) =>
    sendWhatsAppMock({
      type: "ORDER_PLACED",
      role,
      orderId: order.id,
      recipientPhone: phone,
      message: text,
    }),
  );

  await Promise.allSettled([
    adminEmail ? sendEmail({ to: adminEmail, subject, text, attachments }) : Promise.resolve(),
    sendEmail({ to: customerEmail, subject, text, attachments }),
    ...whatsappNotifications,
  ]);
}

