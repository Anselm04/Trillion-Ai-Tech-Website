# Trillion AI Tech Website

Premium subscription-based AI product marketplace — built with Next.js 15, Supabase, Stripe, and Tailwind CSS.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router + TypeScript |
| Styling | Tailwind CSS 3 |
| Auth & DB | Supabase (Auth, Postgres, Storage, RLS) |
| Payments | Stripe Billing + Checkout + Customer Portal |
| i18n | next-intl (9 locales) |

## Getting started

```bash
npm install
cp .env.example .env.local
# Fill in your Supabase and Stripe keys
npm run dev
```

## Database setup

Run `supabase/migrations/001_init.sql` against your Supabase project via the Supabase SQL editor or the CLI:

```bash
supabase db push
```

## Stripe setup

1. Create products and recurring prices in your Stripe dashboard
2. Copy the Price IDs into the admin product form (Stripe Price ID field)
3. Set your webhook endpoint to `https://yourdomain.com/api/stripe/webhook`
4. Listen for: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`

## Admin access

Grant admin role by running in Supabase SQL:

```sql
insert into public.user_roles (user_id, role)
values ('<your-user-uuid>', 'admin');
```

Admin dashboard is at `/dashboard/admin/products` and is protected server-side by role check.

## Key routes

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/catalog/[category]` | Category browse page |
| `/product/[slug]` | Product detail + subscribe |
| `/dashboard` | Customer dashboard |
| `/dashboard/admin/products` | Admin catalog manager |
| `/auth/sign-in` | Sign in (email + Google + Apple) |
| `/auth/sign-up` | Register |
| `/api/stripe/checkout` | Start Stripe Checkout |
| `/api/stripe/portal` | Open Stripe billing portal |
| `/api/stripe/webhook` | Stripe lifecycle events |
| `/api/download` | Secure signed download |
| `/legal/[slug]` | Legal pages |
