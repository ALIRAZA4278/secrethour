// =============================================================
// SCHEMA MARKUP (JSON-LD) FOR SECRETHOUR.PK
// How to add in Next.js App Router:
//   In each page.tsx, add a <script> tag inside the JSX return:
//
//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObject) }}
//       />
//       {/* rest of page */}
//     </>
//   )
//
// In Pages Router: put the <script> inside <Head> via next/head.
// Test any page at: https://search.google.com/test/rich-results
// =============================================================


// =============================================================
// 1. ORGANIZATION SCHEMA — add to app/layout.tsx (all pages)
// =============================================================

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Secret Hour",
  "url": "https://secrethour.pk",
  "logo": "https://secrethour.pk/logo.png",
  "description": "Quietly luxurious gifts crafted for married couples in Pakistan — a couples card game, luxury candles, and intimate sets.",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "info@secrethour.pk",
    "availableLanguage": ["English", "Urdu"]
  },
  "sameAs": [
    "https://www.instagram.com/secrethour.pk",
    "https://www.facebook.com/people/Secret-Hour/61585460425456/"
  ],
  "areaServed": {
    "@type": "Country",
    "name": "Pakistan"
  }
}

// In app/layout.tsx, add inside <body>:
// <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />


// =============================================================
// 2. WEBSITE SCHEMA — add to app/page.tsx (homepage only)
// Enables Google sitelinks search box.
// =============================================================

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Secret Hour",
  "url": "https://secrethour.pk",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://secrethour.pk/shop?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}


// =============================================================
// 3. PRODUCT SCHEMAS — add to each product page.tsx
// =============================================================

// --- THE MIDNIGHT DECK ---
export const midnightDeckSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "The Midnight Deck",
  "description": "A couples card game for married couples in Pakistan. 60 cards with playful dares and meaningful questions — wrapped in a matte black box with gold detailing. Builds comfort naturally.",
  "brand": { "@type": "Brand", "name": "Secret Hour" },
  "image": ["https://secrethour.pk/assets/sh-card-game-Cw972EQC.png"],
  "sku": "SH-MIDNIGHT-DECK-001",
  "category": "Card Games / Couple Gifts",
  "url": "https://secrethour.pk/product/the-midnight-deck",
  "offers": {
    "@type": "Offer",
    "url": "https://secrethour.pk/product/the-midnight-deck",
    "priceCurrency": "PKR",
    "price": "2999",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": { "@type": "Organization", "name": "Secret Hour" },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "PKR" },
      "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "PK" },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "transitTime": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 5, "unitCode": "DAY" }
      }
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "PK",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 7,
      "returnMethod": "https://schema.org/ReturnByMail"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "3",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "author": { "@type": "Person", "name": "Anonymous" },
      "reviewBody": "The card game pulled us out of routine. We have never talked like this before."
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "author": { "@type": "Person", "name": "Anonymous" },
      "reviewBody": "Beautifully made. It feels like a gift you would buy for someone you really love."
    }
  ]
}

// --- BRIDAL BOX ---
export const bridalBoxSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Secret Hour Bridal Box",
  "description": "A luxury bridal gift set for newly married couples in Pakistan. Curated to make the wedding night unforgettable. Discreetly packaged.",
  "brand": { "@type": "Brand", "name": "Secret Hour" },
  "sku": "SH-BRIDAL-BOX-001",
  "category": "Bridal Gifts / Couple Gifts",
  "url": "https://secrethour.pk/product/bridal-box",
  "offers": {
    "@type": "Offer",
    "url": "https://secrethour.pk/product/bridal-box",
    "priceCurrency": "PKR",
    "price": "4999",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": { "@type": "Organization", "name": "Secret Hour" }
  }
}

// --- MIDNIGHT GLOW CANDLE ---
export const midnightCandleSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Midnight Glow Candle",
  "description": "A luxury scented candle for married couples by Secret Hour. Sets the mood for intimate evenings at home.",
  "brand": { "@type": "Brand", "name": "Secret Hour" },
  "sku": "SH-CANDLE-001",
  "category": "Candles / Couple Gifts",
  "url": "https://secrethour.pk/product/midnight-glow-candle",
  "offers": {
    "@type": "Offer",
    "url": "https://secrethour.pk/product/midnight-glow-candle",
    "priceCurrency": "PKR",
    "price": "1499",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": { "@type": "Organization", "name": "Secret Hour" }
  }
}

// --- SILK BOND ---
export const silkBondSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Silk Bond",
  "description": "An intimate set for married couples by Secret Hour Pakistan.",
  "brand": { "@type": "Brand", "name": "Secret Hour" },
  "sku": "SH-SILK-BOND-001",
  "category": "Intimate Sets / Couple Gifts",
  "url": "https://secrethour.pk/product/silk-bond",
  "offers": {
    "@type": "Offer",
    "url": "https://secrethour.pk/product/silk-bond",
    "priceCurrency": "PKR",
    "price": "999",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": { "@type": "Organization", "name": "Secret Hour" }
  }
}


// =============================================================
// 4. FAQPAGE SCHEMA — add to app/info/faq/page.tsx
// This makes FAQ answers appear in Google search results
// AND gets cited by ChatGPT, Perplexity, and Google AI Overviews.
// =============================================================

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is the packaging discreet?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All Secret Hour orders are shipped in plain, unmarked packaging with no external branding or indication of contents. The sender name on the waybill reads 'Secret Hour' only."
      }
    },
    {
      "@type": "Question",
      "name": "How long does delivery take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Delivery across Pakistan typically takes 2–5 business days. Major cities like Karachi, Lahore, and Islamabad usually receive orders within 2–3 business days. Delivery is free on all orders."
      }
    },
    {
      "@type": "Question",
      "name": "What payment options are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept Cash on Delivery (COD) across Pakistan, and online bank transfers. Paying via bank transfer gives you an additional 10% discount on your order."
      }
    },
    {
      "@type": "Question",
      "name": "Is Secret Hour suitable for newly married couples?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The Midnight Deck and Bridal Box are especially popular as wedding night gifts and nikkah gifts in Pakistan. Our products are designed for married couples at every stage."
      }
    },
    {
      "@type": "Question",
      "name": "What if we have been married for years?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Secret Hour is for every stage of marriage. Many customers are long-married couples looking to reconnect and break out of routine. The Midnight Deck in particular helps couples rediscover each other through conversation and play."
      }
    },
    {
      "@type": "Question",
      "name": "Can I return a product?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept returns within 7 days of delivery if the product is unopened and in original condition. Contact us at info@secrethour.pk to initiate a return."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need guidance to use the products?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No guidance is needed. The Midnight Deck comes with clear instructions inside the box. All products are designed to be intuitive and easy to use from the moment you open them."
      }
    },
    {
      "@type": "Question",
      "name": "How can I contact Secret Hour?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can reach us via email at info@secrethour.pk, through our WhatsApp at https://wa.me/message/5QY6DQTFQQGEC1, or via our contact form at secrethour.pk/contact. We aim to respond within 24 hours."
      }
    },
    {
      "@type": "Question",
      "name": "Is Secret Hour available across all of Pakistan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We ship to all cities across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and beyond. Delivery is always free."
      }
    },
    {
      "@type": "Question",
      "name": "What if I feel unsure before buying?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Take our free Experience Quiz at secrethour.pk/quiz to find the best product for your situation in under a minute. You can also WhatsApp us directly and we will help you choose — no pressure."
      }
    }
  ]
}


// =============================================================
// 5. BREADCRUMB SCHEMA — add to product and info pages
// Replace the items array per page.
// =============================================================

// For /product/the-midnight-deck:
export const midnightDeckBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://secrethour.pk/" },
    { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://secrethour.pk/shop" },
    { "@type": "ListItem", "position": 3, "name": "The Midnight Deck", "item": "https://secrethour.pk/product/the-midnight-deck" }
  ]
}

// For /info/faq:
export const faqBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://secrethour.pk/" },
    { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://secrethour.pk/info/faq" }
  ]
}

// For /about:
export const aboutBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://secrethour.pk/" },
    { "@type": "ListItem", "position": 2, "name": "About", "item": "https://secrethour.pk/about" }
  ]
}


// =============================================================
// HOW TO USE THESE IN A PAGE COMPONENT (App Router example)
// =============================================================

// app/product/[slug]/page.tsx — example for Midnight Deck
export default function MidnightDeckPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(midnightDeckSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(midnightDeckBreadcrumb) }}
      />
      {/* your existing page JSX below */}
    </>
  )
}
