# 4F Clone — Self-Hosted E-Commerce with Google Login

A production-ready e-commerce starter: winter jacket storefront, full customer accounts
(email/password + Google OAuth), Stripe Checkout + Billing Portal, and an admin dashboard —
running entirely on SQLite so it costs **$0/month** in SaaS fees and fits on a $5 VPS.

You own 100% of this code. No subscriptions, no vendor lock-in, no license keys.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Zustand
- **Backend:** Node.js + Express (custom server) + Prisma ORM + SQLite
- **Auth:** Auth.js (NextAuth v5) — Credentials (bcrypt) + Google OAuth
- **Payments:** Stripe Checkout Sessions + Stripe Customer Portal
- **Email:** Nodemailer (SMTP in prod, auto Ethereal.email preview in dev)

## Step 1 — Install dependencies

```bash
npm install
```

## Step 2 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values (see Steps 3–6 below for where each one comes from).
At minimum, generate a secret for `NEXTAUTH_SECRET`:

```bash
npx auth secret
# or: openssl rand -base64 32
```

## Step 3 — Set up the database

SQLite needs zero setup — it's just a file (`prisma/dev.db`).

```bash
npm run prisma:migrate -- --name init
npm run seed
```

This creates the database and seeds 8 winter jacket products.

## Step 4 — Stripe setup

1. Create a free account at [stripe.com](https://stripe.com).
2. Copy your **test** secret key from the Dashboard into `STRIPE_SECRET_KEY`.
3. Copy your publishable key into `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. For local webhook testing, install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the `whsec_...` value it prints into `STRIPE_WEBHOOK_SECRET`.
5. In production, create a webhook endpoint in the Stripe Dashboard pointing to
   `https://yourdomain.com/api/stripe/webhook`, subscribed to `checkout.session.completed`.

## Step 5 — Email (password resets)

- **Development:** leave `SMTP_HOST` blank. The app automatically creates a free
  [Ethereal.email](https://ethereal.email) test inbox and logs a preview URL to your
  terminal for every password reset email.
- **Production:** set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`
  to your real SMTP provider (e.g. Resend, Postmark, SES, or your host's SMTP relay).

## Step 6 — Google OAuth setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Create a new project (or select an existing one).
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**.
   - Application type: **Web application**
   - Authorized redirect URI (dev): `http://localhost:3000/api/auth/callback/google`
   - Authorized redirect URI (prod): `https://yourdomain.com/api/auth/callback/google`
4. Copy the **Client ID** and **Client Secret** into `GOOGLE_ID` and `GOOGLE_SECRET` in `.env`.
5. Set `ADMIN_EMAIL` in `.env` to the exact Google account email that should be granted
   admin access. Signing in with Google using this email at `/admin/login` automatically
   promotes that account to `ADMIN`. Any other Google account remains a regular customer.

## Step 7 — Create your admin account

Option A — promote an existing account (e.g. one you signed up with email/password, or
one that already signed in with Google):

```bash
npm run make:admin email=you@mail.com
```

Option B — just sign in with Google at `/admin/login` using the email set as `ADMIN_EMAIL`
in `.env` — it's promoted to `ADMIN` automatically on first login.

## Running the app

```bash
npm run dev        # http://localhost:3000
```

- Storefront: `/` and `/products`
- Customer account: `/account/login`, `/account/signup`
- Admin dashboard: `/admin/login`

## Deploying to a $5 VPS

1. `git clone` your repo onto the server (Ubuntu 22.04+, Node 20+ recommended).
2. `npm install && npm run prisma:deploy && npm run build`
3. Run with a process manager, e.g. [PM2](https://pm2.keymetrics.io/):
   ```bash
   npm install -g pm2
   pm2 start "npm run start" --name 4f-store
   pm2 save && pm2 startup
   ```
4. Put Nginx (or Caddy) in front for TLS termination and reverse-proxy to port 3000.
5. Back up `prisma/dev.db` regularly — it's the entire database, a single file.

## Project structure

```
app/
  (store)/            # storefront + customer account (has header/footer/cart)
    page.tsx           # home page
    products/          # /products grid with filters
    product/[slug]/     # product detail page
    account/           # login, signup, forgot/reset password, account dashboard
  admin/
    login/             # admin login (Google restricted to ADMIN_EMAIL, or credentials)
    (dashboard)/        # admin shell: dashboard, products CRUD, orders
  api/
    auth/[...nextauth]/ # Auth.js route handler
    stripe/checkout/    # creates Stripe Checkout Session
    stripe/webhook/     # verifies signature, creates Order, decrements stock
    billing-portal/     # creates Stripe Customer Portal session
  sitemap.ts, robots.ts
auth.ts / auth.config.ts # Auth.js v5 config (Google + Credentials, JWT sessions)
middleware.ts            # protects /account/* and /admin/*
prisma/schema.prisma      # SQLite schema
prisma/seed.ts            # 8 winter jacket products
prisma/scripts/make-admin.ts
server.ts                 # Express + Next.js custom server (single Node process)
lib/                       # prisma client, stripe client, mailer, validations, etc.
components/                # shadcn/ui primitives + storefront/admin components
store/cart-store.ts        # Zustand cart (persisted to localStorage)
```

## Security notes

- Passwords are hashed with bcrypt (10 rounds). Never stored in plaintext.
- Google-only accounts have `passwordHash = NULL` and cannot use `/account/forgot-password`
  or log in with a password — enforced both in the Credentials `authorize()` function and
  in the forgot-password server action.
- Password reset tokens are SHA-256 hashed before being stored, expire after 1 hour, and are
  invalidated immediately after use.
- `/account/forgot-password` is rate-limited to 5 requests per 15 minutes per IP+email.
- Stripe Checkout line item prices are always re-derived from the database — the client
  cart's price/title is never trusted for payment amounts.
- The Stripe webhook verifies the `stripe-signature` header before processing any event.
- Admin routes are protected in `middleware.ts` (redirects non-admins to `/admin/login`)
  and again inside every admin server action (`lib/require-admin.ts`) as defense-in-depth.

