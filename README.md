# ZEN — E‑commerce (Next.js + Tailwind + Vercel Blob)

Minimal, modern, premium streetwear storefront with:
- Home / Shop / Product / Cart / Checkout
- Cart in localStorage
- Orders persisted in **Vercel Blob** (no payment gateway; records method only)
- Notifications on order placed (email + WhatsApp placeholder)
- Secured Admin panel to manage products + upload images to Blob

## Local setup

### 1) Install

```bash
cd zen-store
npm install
```

### 2) Environment variables

Copy `.env.example` to `.env.local` and fill:

- **`BLOB_READ_WRITE_TOKEN`**: required for product/order persistence and image uploads
- **`ADMIN_PASSWORD`**: required to access `/admin`

Optional:
- SMTP vars for real emails
- `ADMIN_EMAIL` for company/admin notifications
- `WHATSAPP_WEBHOOK_URL` to forward a JSON payload (otherwise it logs)

### 3) Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Admin

- Visit `/admin/login`
- Sign in with `ADMIN_PASSWORD`
- Add/Edit/Delete products, upload images (stored in Vercel Blob)
- View orders and update status

## Data model (Blob JSON)

- **Products**: stored at `data/products.json`
- **Orders**: stored at `data/orders.json`

## Deployment (Vercel)

1. Push this folder (`zen-store/`) to a Git repo.
2. Import it in Vercel.
3. Add env vars in Vercel Project Settings:
   - `BLOB_READ_WRITE_TOKEN`
   - `ADMIN_PASSWORD`
   - (optional) SMTP + `ADMIN_EMAIL` + `WHATSAPP_WEBHOOK_URL`
4. Deploy.

## Notes

- Colors are defined only via global CSS variables + Tailwind theme tokens (no hardcoded component colors).
- No payment gateway is integrated by design.

