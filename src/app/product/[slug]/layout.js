import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: product } = await supabase
    .from('products')
    .select('title, description, price, numeric_price, img')
    .eq('slug', slug)
    .single();

  if (!product) return { title: 'Product Not Found' };

  const title = product.title;
  const description = product.description
    ? product.description.slice(0, 155)
    : `${title} — ${product.price}. A quiet luxury crafted for married couples by Secret Hour. Free delivery across Pakistan. Discreet packaging.`;
  const url = `https://secrethour.pk/product/${slug}`;
  const image = product.img?.startsWith('http') ? product.img : `https://secrethour.pk${product.img}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — Secret Hour`,
      description,
      url,
      type: 'website',
      images: [{ url: image, width: 800, height: 800, alt: title }],
      siteName: 'Secret Hour',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — Secret Hour`,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export default async function ProductLayout({ children, params }) {
  const { slug } = await params;
  const { data: product } = await supabase
    .from('products')
    .select('title, numeric_price, img, description')
    .eq('slug', slug)
    .single();

  const url = `https://secrethour.pk/product/${slug}`;
  const image = product?.img?.startsWith('http') ? product.img : `https://secrethour.pk${product?.img}`;

  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description || `${product.title} — a quiet luxury crafted for married couples by Secret Hour.`,
    "brand": { "@type": "Brand", "name": "Secret Hour" },
    "image": [image],
    "url": url,
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "PKR",
      "price": String(product.numeric_price || 0),
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
      }
    }
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://secrethour.pk/" },
      { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://secrethour.pk/shop" },
      { "@type": "ListItem", "position": 3, "name": product?.title || slug, "item": url }
    ]
  };

  return (
    <>
      {productSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}
