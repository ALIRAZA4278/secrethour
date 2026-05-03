# Blueprint: Admin Dashboard + Supabase Backend

> Based on: direct request
> Status: Draft
> Date: 2026-05-01
> Depth: Standard

---

## Purpose

Admins can manage products (add/edit/delete with image uploads), view and update orders, and see a revenue dashboard — all from a single `/admin` page backed by Supabase. The live shop automatically reflects any product changes made in the admin.

## Scope

### In Scope
- Supabase client setup (`@supabase/supabase-js`)
- `products`, `orders`, `order_items` tables in Supabase
- Supabase Storage bucket `product-images` (public)
- Shop + product pages fetch products from Supabase (replaces static `products.js`)
- Checkout saves orders + order_items to Supabase
- `/admin` single-page dashboard with 3 tabs: Dashboard | Products | Orders
- Simple password-based admin login (env var, no Supabase Auth)
- Product image upload via Supabase Storage

### Out of Scope
- Customer-facing auth / accounts
- Multi-admin roles
- Email notifications on order
- Inventory quantity tracking
- Analytics beyond basic order stats

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Admin auth | Env-var password + sessionStorage | No Supabase Auth needed for single-admin store |
| Product source | Supabase DB (replaces static products.js) | Admin edits reflect live on shop |
| Image hosting | Supabase Storage public bucket | Integrated, no extra service |
| Data fetching | Server Components (shop/product pages) | SEO + performance; admin page is client-only |
| Admin in one file | `/admin/page.js` single client component | User requirement |
| Supabase client | Singleton in `src/lib/supabase.js` | Reused across all files |

---

## Schema

### New Tables

**products**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK default gen_random_uuid() | |
| slug | text UNIQUE NOT NULL | URL identifier |
| title | text NOT NULL | |
| subtitle | text | |
| category | text | |
| tagline | text | |
| price | text | Display string e.g. "Rs. 3,499" |
| numeric_price | integer NOT NULL | For calculations |
| stock_note | text | |
| img | text | Primary image URL |
| images | text[] | All image URLs |
| description | text | |
| features | text[] | Checklist items |
| included | text[] | What's in the box |
| how_it_works | text[] | Steps |
| quote | text | |
| quote_label | text | |
| upsell_slug | text | FK ref to another product slug |
| faq | jsonb | Array of {q, a} objects |
| created_at | timestamptz default now() | |

**orders**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK default gen_random_uuid() | |
| first_name | text | |
| last_name | text | |
| email | text | |
| phone | text | |
| address | text | |
| city | text | |
| postal_code | text | |
| country | text | |
| payment_method | text | 'cod' or 'bank' |
| subtotal | integer | In PKR |
| discount | integer default 0 | |
| total | integer | |
| status | text default 'pending' | pending / confirmed / shipped / delivered / cancelled |
| created_at | timestamptz default now() | |

**order_items**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK default gen_random_uuid() | |
| order_id | uuid FK → orders(id) ON DELETE CASCADE | |
| product_slug | text | |
| product_title | text | Snapshot at order time |
| product_img | text | Snapshot at order time |
| quantity | integer | |
| price | integer | Per-unit price at order time |

### Storage
- Bucket: `product-images` (public read, authenticated write)

### SQL to run in Supabase SQL Editor
```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  category text,
  tagline text,
  price text not null,
  numeric_price integer not null,
  stock_note text,
  img text,
  images text[],
  description text,
  features text[],
  included text[],
  how_it_works text[],
  quote text,
  quote_label text,
  upsell_slug text,
  faq jsonb,
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text default 'Pakistan',
  payment_method text,
  subtotal integer,
  discount integer default 0,
  total integer,
  status text default 'pending',
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_slug text,
  product_title text,
  product_img text,
  quantity integer,
  price integer
);

-- Enable RLS (allow all for now — admin uses service role key)
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public read for products (shop page)
create policy "public read products" on products for select using (true);

-- Service role has full access (used by admin + checkout server actions)
-- No extra policy needed — service role bypasses RLS
```

---

## Component Tree

```
src/
  lib/
    supabase.js              — browser client (anon key)
    supabase-server.js       — server client (service role key, server-only)
  app/
    admin/
      page.js                — SINGLE FILE: login + dashboard + products + orders tabs
    shop/
      page.js                — UPDATED: fetch products from Supabase
    product/[slug]/
      page.js                — UPDATED: fetch single product from Supabase
    checkout/
      page.js                — UPDATED: save order to Supabase on submit
```

---

## File-by-File Plan

### Phase 1: Supabase Setup — [CONFIG]

#### Task 1.1: Install Supabase JS client
- **Size:** XS
- **Acceptance criteria:**
  - [ ] `@supabase/supabase-js` in dependencies
- **Files:** `package.json`
- **Verification:** `npm ls @supabase/supabase-js` shows version
- **Dependencies:** None

#### Task 1.2: Create Supabase clients + env vars
- **Size:** S
- **Acceptance criteria:**
  - [ ] `src/lib/supabase.js` exports browser client using anon key
  - [ ] `src/lib/supabase-server.js` exports server client using service role key
  - [ ] `.env.local` has NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSWORD
  - [ ] `.env.local` is in `.gitignore`
- **Files:** `src/lib/supabase.js`, `src/lib/supabase-server.js`, `.env.local`
- **Verification:** Both files import without errors
- **Dependencies:** Task 1.1

#### Task 1.3: Seed products from static data to Supabase
- **Size:** S
- **Acceptance criteria:**
  - [ ] `scripts/seed-products.js` reads PRODUCTS array from data/products.js and upserts all 7 products into Supabase
  - [ ] After running `node scripts/seed-products.js`, all 7 products visible in Supabase table editor
- **Files:** `scripts/seed-products.js`
- **Verification:** Run script, check Supabase dashboard shows 7 rows
- **Dependencies:** Task 1.2 + SQL schema run in Supabase

**Checkpoint after Phase 1:** Supabase connected, products seeded, env vars set.

---

### Phase 2: Shop + Product Pages → Supabase — [UI]

#### Task 2.1: Update shop page to fetch from Supabase
- **Size:** S
- **Acceptance criteria:**
  - [ ] `src/app/shop/page.js` fetches products via server-side Supabase client
  - [ ] Products display exactly as before (same UI)
  - [ ] Page still server-rendered (no 'use client')
- **Files:** `src/app/shop/page.js`
- **Verification:** Navigate to `/shop` — all products appear, same layout
- **Dependencies:** Phase 1 complete

#### Task 2.2: Update product detail page to fetch from Supabase
- **Size:** S
- **Acceptance criteria:**
  - [ ] `src/app/product/[slug]/page.js` fetches single product by slug from Supabase
  - [ ] All sections (features, FAQ, upsell) still render correctly
  - [ ] `generateStaticParams` replaced with dynamic fetch (or kept if slugs known)
  - [ ] 404 if product not found
- **Files:** `src/app/product/[slug]/page.js`
- **Verification:** Navigate to `/product/secret-hour-card-experience` — full page renders
- **Dependencies:** Phase 1 complete

**Checkpoint after Phase 2:** Shop and product pages load from Supabase. Static `products.js` no longer used by these pages.

---

### Phase 3: Checkout → Save Orders — [API]

#### Task 3.1: Save order to Supabase on checkout submit
- **Size:** M
- **Acceptance criteria:**
  - [ ] On form submit, creates a row in `orders` table with all shipping + payment fields
  - [ ] Creates rows in `order_items` for each cart item
  - [ ] Uses browser Supabase client (anon key) — public insert allowed via RLS policy
  - [ ] On Supabase error, shows error message to user instead of silent failure
  - [ ] Success state still shows after order saved
- **Files:** `src/app/checkout/page.js`
- **Verification:** Submit test order → check Supabase `orders` + `order_items` tables show new rows
- **Dependencies:** Phase 1 complete

---

### Phase 4: Admin Page — [UI]

Single file `src/app/admin/page.js`. Client component ('use client').

#### Task 4.1: Admin login gate
- **Size:** S
- **Acceptance criteria:**
  - [ ] Page shows password input if not authenticated
  - [ ] On correct password (matches NEXT_PUBLIC_ADMIN_PASSWORD), sets sessionStorage flag and shows dashboard
  - [ ] On wrong password, shows error message
  - [ ] Refresh persists login via sessionStorage check on mount
- **Files:** `src/app/admin/page.js`
- **Verification:** Visit `/admin` → see login. Enter correct password → see dashboard tabs.
- **Dependencies:** Phase 1 complete

#### Task 4.2: Dashboard tab (stats)
- **Size:** S
- **Acceptance criteria:**
  - [ ] Shows: Total Orders, Total Revenue (Rs.), Pending Orders count, Today's Orders count
  - [ ] Stats fetched from Supabase `orders` table on mount
  - [ ] Loading skeleton while fetching
- **Files:** `src/app/admin/page.js`
- **Verification:** After placing a test order, Dashboard tab shows correct counts
- **Dependencies:** Task 4.1, Phase 3 complete

#### Task 4.3: Products tab — list + delete
- **Size:** M
- **Acceptance criteria:**
  - [ ] Lists all products with thumbnail, title, price, category
  - [ ] Delete button per product: confirms then deletes from Supabase + removes associated images from Storage
  - [ ] Product list refreshes after delete
- **Files:** `src/app/admin/page.js`
- **Verification:** Delete a test product → it disappears from list and from `/shop`
- **Dependencies:** Task 4.1

#### Task 4.4: Products tab — add new product with image upload
- **Size:** M
- **Acceptance criteria:**
  - [ ] "Add Product" form with fields: slug, title, subtitle, category, price (display), numeric_price, description, stock_note, features (comma-separated), included (comma-separated), how_it_works (comma-separated)
  - [ ] Image upload input: uploads file to Supabase Storage `product-images` bucket, sets public URL as `img` and first entry of `images`
  - [ ] On save: inserts product row into Supabase `products` table
  - [ ] New product immediately appears in list and on `/shop`
  - [ ] Form resets after successful save
- **Files:** `src/app/admin/page.js`
- **Verification:** Add product via form → navigate to `/shop` → new product visible
- **Dependencies:** Task 4.3

#### Task 4.5: Orders tab — list + status update
- **Size:** M
- **Acceptance criteria:**
  - [ ] Lists all orders newest-first: order ID (short), customer name, city, total, payment method, status, date
  - [ ] Expandable row shows order items with product name, qty, price
  - [ ] Status dropdown per order: pending / confirmed / shipped / delivered / cancelled
  - [ ] Changing status updates `orders.status` in Supabase immediately
  - [ ] Status badge color: pending=yellow, confirmed=blue, shipped=purple, delivered=green, cancelled=red
- **Files:** `src/app/admin/page.js`
- **Verification:** Place test order → see it in Orders tab → change status → refresh page → status persisted
- **Dependencies:** Task 4.1, Phase 3 complete

**Checkpoint after Phase 4:** Full admin working — login, dashboard stats, add/delete products, manage orders.

---

## Verification Criteria

- [ ] `/shop` loads products from Supabase (not static file)
- [ ] `/product/[slug]` loads from Supabase, 404 for unknown slug
- [ ] Checkout submit creates rows in `orders` + `order_items`
- [ ] `/admin` login gate works with correct/wrong password
- [ ] Admin: add product with image → appears on shop
- [ ] Admin: delete product → disappears from shop
- [ ] Admin: order status change persists after page refresh

---

## Estimate

| Phase | Tasks | Sizes | Range |
|-------|-------|-------|-------|
| Phase 1: Supabase Setup | 1.1, 1.2, 1.3 | XS, S, S | 30–60 min |
| Phase 2: Shop + Product Pages | 2.1, 2.2 | S, S | 30–45 min |
| Phase 3: Checkout Orders | 3.1 | M | 20–40 min |
| Phase 4: Admin Page | 4.1–4.5 | S,S,M,M,M | 1.5–2.5 hrs |
| **Total** | | | **2.5–4 hrs** |

**Assumptions:**
- User will run SQL schema manually in Supabase dashboard
- User provides their own Supabase project URL + keys
- `product-images` bucket created manually in Supabase Storage
- Admin password is simple (no rotation, single user)

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| RLS blocks checkout inserts | Orders silently fail | Add permissive insert policy for orders table |
| Service role key exposed client-side | Security breach | Only use in server files, never in 'use client' |
| Static products.js still imported somewhere | Stale data shown | Grep all imports after Phase 2, remove unused |
| Image URLs break after product delete | Broken images on old orders | Snapshots stored in order_items.product_img |
