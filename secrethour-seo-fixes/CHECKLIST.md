# Secret Hour — SEO Fix Checklist
## Implementation guide (in priority order)

---

## 🔴 Week 1 — Critical (do these first)

### Fix 1: robots.txt
- [ ] Upload `robots.txt` to your server root (so it lives at https://secrethour.pk/robots.txt)
- [ ] Verify it's live by visiting https://secrethour.pk/robots.txt in your browser
- [ ] File is provided as: `robots.txt`

### Fix 2: XML Sitemap
- [ ] Upload `sitemap.xml` to your server root (https://secrethour.pk/sitemap.xml)
- [ ] Go to Google Search Console → Sitemaps → Submit https://secrethour.pk/sitemap.xml
- [ ] Update lastmod dates in the file each time you make changes
- [ ] File is provided as: `sitemap.xml`

### Fix 3: JS Rendering / SSR
- [ ] Pick an approach: Next.js (rebuild), Vite prerender plugin, or SSR
- [ ] See detailed instructions in: `content-and-rendering-fixes.html` (Part 1)
- [ ] After deploying, use Google Search Console → URL Inspection to verify HTML is visible
- [ ] Test URL: https://secrethour.pk/product/the-midnight-deck

### Fix 4: Request Google indexing
- [ ] After SSR is live, go to Google Search Console → URL Inspection
- [ ] Enter each priority URL and click "Request Indexing"
  - https://secrethour.pk/
  - https://secrethour.pk/shop
  - https://secrethour.pk/product/the-midnight-deck
  - https://secrethour.pk/product/bridal-box
  - https://secrethour.pk/info/faq

---

## 🟠 Week 2 — High priority

### Fix 5: Meta tags for all pages
- [ ] Open `meta-tags-all-pages.html`
- [ ] Copy the relevant block into the `<head>` of each page
- [ ] Pages to update:
  - [ ] Homepage
  - [ ] /shop
  - [ ] /product/the-midnight-deck
  - [ ] /product/bridal-box
  - [ ] /product/midnight-glow-candle
  - [ ] /product/silk-bond
  - [ ] /about
  - [ ] /info/faq
  - [ ] /testimonials
  - [ ] /contact

### Fix 6: Schema markup (JSON-LD)
- [ ] Open `schema-markup.html`
- [ ] Add Organization schema to ALL pages' `<head>`
- [ ] Add Website schema to homepage `<head>`
- [ ] Add Product schema to each product page `<head>`
- [ ] Add FAQPage schema to /info/faq `<head>`
- [ ] Add Breadcrumb schema to product and info pages
- [ ] Validate at: https://search.google.com/test/rich-results

### Fix 7: FAQ page HTML fix
- [ ] Replace JS accordion on /info/faq with `<details>/<summary>` HTML
- [ ] Copy the HTML from `content-and-rendering-fixes.html` (Part 2 — FAQ section)
- [ ] Answers must be visible in page source (right-click → View Source)
- [ ] This makes FAQ answers readable by Googlebot AND AI systems

---

## 🟡 Week 2–3 — Speed fixes

### Fix 8: Images — alt text
- [ ] Open `image-optimization-guide.html`
- [ ] Add alt text to every img tag (copy from the list in Step 3)
- [ ] Empty alt="" is correct for decorative images — do not add text to those

### Fix 9: Images — WebP conversion
- [ ] Download all images from your site
- [ ] Run through Squoosh (https://squoosh.app) — save as WebP at quality 80
- [ ] Use `<picture>` tags with WebP + JPG fallback (code in `image-optimization-guide.html`)
- [ ] Target sizes: hero < 200KB, product images < 100KB

### Fix 10: Images — fix filenames
- [ ] Rename: "/Banners/1 mob.jpg.jpeg" → "/banners/banner-couple-mobile-1.webp"
- [ ] Rename: "/Banners/2 mob.jpg.jpeg" → "/banners/banner-couple-mobile-2.webp"
- [ ] No spaces, no double extensions in filenames

### Fix 11: Add explicit width/height to all images
- [ ] Prevents layout shift (CLS)
- [ ] Add loading="lazy" to all below-fold images
- [ ] Add loading="eager" + fetchpriority="high" to the hero image only

### Fix 12: Add Cloudflare CDN
- [ ] Go to cloudflare.com → Add site → secrethour.pk
- [ ] Change nameservers at your domain registrar
- [ ] Enable Polish (auto WebP), Brotli, Rocket Loader in Speed settings
- [ ] Enable page caching rules for static assets
- [ ] Free tier is sufficient

---

## 🤖 Week 3 — AI SEO

### Fix 13: llms.txt file
- [ ] Upload `llms.txt` to your server root (https://secrethour.pk/llms.txt)
- [ ] Update product prices and descriptions if they change
- [ ] File is provided as: `llms.txt`

### Fix 14: Shop page content
- [ ] Add the shop intro copy block from `content-and-rendering-fixes.html` (Part 2)
- [ ] Place it above the product grid on /shop
- [ ] This gives Google something to rank the category page for

### Fix 15: Product page content
- [ ] Add the product specs table from `content-and-rendering-fixes.html` (Part 2)
- [ ] Add specific, citable facts (number of cards, dimensions, etc.)

---

## 📏 Ongoing — after everything above is done

### Monthly tasks
- [ ] Update sitemap lastmod dates when pages change
- [ ] Check Google Search Console for new coverage errors
- [ ] Check Search Console → Core Web Vitals report
- [ ] Run PageSpeed Insights on https://pagespeed.web.dev/ for the latest score

### When you collect more reviews
- [ ] Update aggregateRating in Product schema with real counts
- [ ] Add Review objects with real customer quotes (anonymized is fine)
- [ ] Add a Testimonials section with named cities (e.g. "— Fatima, Karachi")
  → Named locations help local AI citation

### Keyword targets to build content around (long-term)
- "couple gifts pakistan" — high intent, low competition
- "wedding night gift pakistan" — bridal season traffic
- "card game for couples" — product category
- "bridal box pakistan" — gift occasion
- "intimacy gifts pakistan" — growing search term
- "anniversary gift for wife pakistan" — occasion-based

---

## ✅ Files included in this package

| File | What it is | Where to use it |
|------|-----------|-----------------|
| `robots.txt` | Bot crawl rules + AI bot allowances | Upload to site root |
| `sitemap.xml` | All page URLs for Google | Upload to site root → submit in Search Console |
| `schema-markup.html` | JSON-LD for Organization, Products, FAQ, Breadcrumbs | Paste into `<head>` of relevant pages |
| `meta-tags-all-pages.html` | Title + description for every page | Paste into `<head>` of each page |
| `image-optimization-guide.html` | Alt text, WebP conversion, lazy loading, Cloudflare setup | Follow step-by-step |
| `content-and-rendering-fixes.html` | SSR fix guide + ready-to-use page copy | Dev for SSR; copy/paste for content |
| `llms.txt` | AI context file | Upload to site root |
| `CHECKLIST.md` | This file | Follow in order |
