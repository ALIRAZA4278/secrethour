# Secret Hour — Deployment Guide
## Complete step-by-step instructions for every fix

---

## Your tech stack (confirmed)
- Framework: **Next.js** (confirmed via meta-next-size-adjust header)
- Hosting: likely Vercel, Netlify, or a VPS
- This guide covers all three hosting options where relevant.

---

## PART 1 — Root files (robots.txt, sitemap.xml, llms.txt)
### Estimated time: 30 minutes | No coding required

These three files live in your site root and need no code changes.

---

### Step 1A — Deploy robots.txt

**What it does:** Tells Google and AI search bots (ChatGPT, Perplexity, Claude) which pages they can crawl.

**In Next.js App Router (recommended):**
Create the file at:
```
your-project/
  app/
    robots.ts       ← create this file
```

Paste this content into `app/robots.ts`:
```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/checkout/confirm'] },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
    ],
    sitemap: 'https://secrethour.pk/sitemap.xml',
  }
}
```

**OR — In Next.js Pages Router / static hosting:**
Copy the provided `robots.txt` file directly into your `/public` folder:
```
your-project/
  public/
    robots.txt      ← place here
```

**Verify it worked:**
Visit https://secrethour.pk/robots.txt in your browser.
You should see the plain text content of the file.

---

### Step 1B — Deploy sitemap.xml

**What it does:** Gives Google a map of all your pages so it can find and index them.

**In Next.js App Router (recommended):**
Create the file at:
```
your-project/
  app/
    sitemap.ts      ← create this file
```

Paste this content into `app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://secrethour.pk/', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://secrethour.pk/shop', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://secrethour.pk/product/the-midnight-deck', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://secrethour.pk/product/bridal-box', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://secrethour.pk/product/intimate-night-set', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://secrethour.pk/product/midnight-glow-candle', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://secrethour.pk/product/silk-bond', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://secrethour.pk/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://secrethour.pk/testimonials', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: 'https://secrethour.pk/quiz', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://secrethour.pk/contact', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: 'https://secrethour.pk/info/faq', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://secrethour.pk/info/shipping', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://secrethour.pk/info/refund', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: 'https://secrethour.pk/info/returns', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: 'https://secrethour.pk/info/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://secrethour.pk/info/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://secrethour.pk/info/referral', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
```

**OR — Pages Router / static hosting:**
Copy the provided `sitemap.xml` into your `/public` folder:
```
your-project/
  public/
    sitemap.xml     ← place here
```

**Verify it worked:**
Visit https://secrethour.pk/sitemap.xml — you should see the XML tree.

---

### Step 1C — Submit sitemap to Google Search Console

1. Go to https://search.google.com/search-console
2. If not already set up, add your property: enter https://secrethour.pk and verify ownership
   - Easiest method: add a `<meta name="google-site-verification" content="...">` tag to your layout.tsx
3. In the left sidebar → Sitemaps
4. Type: sitemap.xml → click Submit
5. Google will start crawling within 24–72 hours
6. Also go to URL Inspection → paste each product URL → click "Request Indexing"

---

### Step 1D — Deploy llms.txt

**What it does:** Gives ChatGPT, Perplexity, and Claude accurate context about your brand so they cite you correctly when users ask about couple gifts in Pakistan.

Copy the provided `llms.txt` into your `/public` folder:
```
your-project/
  public/
    llms.txt        ← place here
```

Verify: https://secrethour.pk/llms.txt should show the plain text file.

---

## PART 2 — Meta tag fixes
### Estimated time: 1–2 hours | Requires code edit

Open `nextjs-metadata.tsx`. It contains the correct metadata export for every page.

**For each page listed:**

1. Open the corresponding page file in your project
2. Add or replace the `export const metadata` block at the top of the file
3. The file shows you exactly which export goes in which page

**Pages to update:**
```
app/page.tsx                     → homepage metadata
app/shop/page.tsx                → shop metadata
app/product/[slug]/page.tsx      → use generateMetadata() function
app/about/page.tsx               → about metadata
app/info/faq/page.tsx            → faq metadata
app/testimonials/page.tsx        → testimonials metadata
```

**Quick fix for the duplicate brand name titles:**
Search your project for `| Secret Hour | Secret Hour` — wherever you find it, remove the duplicate suffix. The title should only end in `| Secret Hour` once.

---

## PART 3 — Schema markup (JSON-LD)
### Estimated time: 1–2 hours | Requires code edit

Open `schema-all-pages.ts`. It contains schema objects for every page.

**For each page:**

1. Import the relevant schema object
2. Add a `<script>` tag in your page's JSX return:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObject) }}
/>
```

**Which schema goes where:**

| Page | Schema to add |
|------|--------------|
| app/layout.tsx | organizationSchema (appears on ALL pages) |
| app/page.tsx | websiteSchema |
| app/product/the-midnight-deck | midnightDeckSchema + midnightDeckBreadcrumb |
| app/product/bridal-box | bridalBoxSchema + breadcrumb |
| app/product/midnight-glow-candle | midnightCandleSchema + breadcrumb |
| app/product/silk-bond | silkBondSchema + breadcrumb |
| app/info/faq | faqSchema + faqBreadcrumb |
| app/about | aboutBreadcrumb |

**After deploying:**
Test each page at https://search.google.com/test/rich-results
Enter the URL and click "Test URL" — you should see detected schema types.

---

## PART 4 — FAQ page fix
### Estimated time: 30 minutes | Requires code edit

Open `faq-page.tsx`. This is a replacement for your current FAQ page component.

**What to do:**
1. Open your current `app/info/faq/page.tsx`
2. Replace the existing accordion/toggle component with the `<details>/<summary>` pattern from `faq-page.tsx`
3. The key difference: answers are always in the HTML (not hidden by JS)
4. Copy the CSS from the comments at the bottom into your stylesheet

**How to verify the fix worked:**
1. Open https://secrethour.pk/info/faq in Chrome
2. Right-click → View Page Source
3. Press Ctrl+F and search for "packaging discreet"
4. If you can see the answer text in the source — it's fixed.
5. If you only see the question — it's still JS-hidden.

---

## PART 5 — Shop page content fix
### Estimated time: 15 minutes | Requires code edit

Open `shop-page.tsx`. It shows where to add the category description paragraph.

**What to do:**
1. Open your `app/shop/page.tsx`
2. Find your existing H1 tag (likely "The Secret Hour Collection")
3. Add the `<p>` paragraph from `shop-page.tsx` directly below the H1
4. Do NOT replace the H1 — just add the paragraph after it

---

## PART 6 — SSR fix (most impactful, hardest)
### Estimated time: 2–8 hours depending on your setup

This is the root cause of zero Google indexation.

**Check first — what rendering mode are your product pages using?**

In your `app/product/[slug]/page.tsx`, look for these patterns:

```ts
// If you see this — data is fetched client-side (BAD for SEO):
useEffect(() => { fetch('/api/product/...') }, [])

// If you see this — data is fetched server-side (GOOD for SEO):
export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.slug)  // server-side fetch
  ...
}
```

**The fix:**
Convert your product page from a client component to a server component.

```tsx
// BEFORE (client component — Google sees "Loading…"):
'use client'
import { useState, useEffect } from 'react'

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null)
  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then(r => r.json())
      .then(setProduct)
  }, [])
  if (!product) return <div>Loading…</div>
  return <div>{product.name}</div>
}


// AFTER (server component — Google sees full content):
// Remove 'use client' — server components fetch data directly

import { getProductBySlug } from '@/lib/products'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) return notFound()
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Rs. {product.price}</p>
    </div>
  )
}
```

**If your data comes from an external API or CMS:**
- Fetch it in the server component using `fetch()` with `{ cache: 'force-cache' }` or `next: { revalidate: 3600 }`
- Never use `useEffect` for data that needs to be indexed by Google

**Verify it worked:**
1. Deploy the change
2. Go to Google Search Console → URL Inspection
3. Paste: https://secrethour.pk/product/the-midnight-deck
4. Click "Test Live URL"
5. Click "View Tested Page" → "HTML" tab
6. Search for "Midnight Deck" in the source — if it appears, you are fixed.

---

## Quick verification checklist (after deploying everything)

Run through these checks after each deploy:

- [ ] https://secrethour.pk/robots.txt — loads the plain text file
- [ ] https://secrethour.pk/sitemap.xml — loads the XML tree
- [ ] https://secrethour.pk/llms.txt — loads the plain text file
- [ ] Google Search Console → Sitemap submitted
- [ ] Google Search Console → Request Indexing on 5 key URLs
- [ ] https://search.google.com/test/rich-results — schema detected on product pages
- [ ] View Source on /info/faq — FAQ answers visible in HTML (not JS-hidden)
- [ ] View Source on /product/the-midnight-deck — product name visible in HTML
- [ ] No double brand name in any page title (search for "Secret Hour | Secret Hour")
- [ ] Shop page has category description paragraph above product grid

---

## Files in this package

| File | What it contains |
|------|-----------------|
| root-files/robots.txt | Deploy to /public or use as reference for app/robots.ts |
| root-files/sitemap.xml | Deploy to /public or use as reference for app/sitemap.ts |
| root-files/llms.txt | Deploy to /public |
| meta-fixes/nextjs-metadata.tsx | Metadata exports for every page |
| schema/schema-all-pages.ts | All JSON-LD schema objects |
| faq-fix/faq-page.tsx | Replacement FAQ page component |
| shop-fix/shop-page.tsx | Shop page with category description added |
| DEPLOYMENT-GUIDE.md | This file |
