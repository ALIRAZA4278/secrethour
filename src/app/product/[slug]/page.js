import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import MetaPixel from '../../components/MetaPixel';
import Footer from '../../components/Footer';
import { getServerSupabase } from '../../../lib/supabase-server';
import ProductPageClient from './ProductPageClient';

// Allow dynamic params for slugs not in generateStaticParams
export const dynamicParams = true;

// Server-side data fetching — runs on server only
export async function generateStaticParams() {
  try {
    const supabase = getServerSupabase();
    const { data: products } = await supabase.from('products').select('slug').neq('hidden', true);
    return (products || []).map(p => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

async function getProductData(slug) {
  try {
    // Slug mapping for backwards compatibility
    const slugMap = {
      'the-midnight-deck': 'midnight-deck',
    };
    const actualSlug = slugMap[slug] || slug;

    const supabase = getServerSupabase();
    const queries = await Promise.allSettled([
      supabase.from('products').select('*').eq('slug', actualSlug).neq('hidden', true),
      supabase.from('products').select('slug, title, price, numeric_price, img, category').neq('hidden', true),
      supabase.from('product_reviews').select('id, reviewer_name, rating, body, created_at').eq('product_slug', actualSlug).eq('approved', true).order('created_at', { ascending: false }),
    ]);

    const [productResult, allProductsResult, reviewsResult] = queries;

    if (productResult.status === 'rejected') {
      console.error(`Product query rejected for ${slug}:`, productResult.reason);
      return null;
    }

    const { data: productArray, error: productError } = productResult.value;
    const product = Array.isArray(productArray) ? productArray[0] : productArray;

    if (productError) {
      console.error(`Product query error for ${slug}:`, productError);
      return null;
    }
    if (!product) return null;

    const { data: allProducts = [] } = allProductsResult.status === 'fulfilled' ? allProductsResult.value : { data: [] };
    const { data: reviews = [] } = reviewsResult.status === 'fulfilled' ? reviewsResult.value : { data: [] };

    return {
      product,
      related: (allProducts || []).filter(p => p.slug !== slug).slice(0, 3),
      upsell: allProducts?.find(x => x.slug === product.upsell_slug) || null,
      reviews: reviews || [],
    };
  } catch (err) {
    console.error(`Error fetching product ${slug}:`, err.message);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  // Slug mapping for backwards compatibility
  const slugMap = {
    'the-midnight-deck': 'midnight-deck',
  };
  const actualSlug = slugMap[slug] || slug;

  const data = await getProductData(slug);

  if (!data) {
    return {
      title: 'Product Not Found | Secret Hour',
      description: 'This product could not be found.',
    };
  }

  const { product } = data;

  // Map product slug to SEO meta tags from the guide
  const metaTags = {
    'the-midnight-deck': {
      title: 'Couples Card Game Pakistan — The Midnight Deck | Secret Hour',
      description: 'The Midnight Deck is Pakistan\'s first couples card game designed for married partners. Spark deep conversations & connection. Order online with discreet delivery.',
    },
    'midnight-glow-candle': {
      title: 'Romantic Scented Candle Pakistan | Midnight Glow — Secret Hour',
      description: 'Set the mood with Midnight Glow — a handcrafted romantic scented candle for couples in Pakistan. Rich warm fragrance for intimate evenings. Order online today.',
    },
    'secret-note': {
      title: 'Secret Note — Romantic Love Letter Envelope | Secret Hour Pakistan',
      description: 'Write what you feel. Secret Note is a beautifully crafted envelope set for married couples to exchange heartfelt messages. The perfect intimate gift in Pakistan.',
    },
    'silk-bond': {
      title: 'Silk Bond — Intimate Couples Accessory Pakistan | Secret Hour',
      description: 'Silk Bond is a premium satin tie for couples — perfect for playful, intimate moments. Discreet packaging. Delivered across Pakistan. For married couples only.',
    },
    'bridal-bundle': {
      title: 'Bridal Bundle Pakistan — Complete Couples Gift Box | Secret Hour',
      description: 'The ultimate wedding night gift. Our Bridal Bundle includes the Midnight Deck, Midnight Glow Candle, Secret Note & Silk Bond. The perfect nikkah gift in Pakistan.',
    },
  };

  const tags = metaTags[actualSlug] || {
    title: `${product.title} | Secret Hour`,
    description: product.description || 'Intimate gifts for married couples in Pakistan. Order online with discreet delivery.',
  };

  return {
    title: tags.title,
    description: tags.description,
    openGraph: {
      title: tags.title,
      description: tags.description,
      url: `https://secrethour.pk/product/${actualSlug}`,
    },
    alternates: {
      canonical: `https://secrethour.pk/product/${actualSlug}`,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const data = await getProductData(slug);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-sm opacity-50 bg-sh-bg">
        <div className="flex flex-col items-center gap-2">
          <p>Product not found.</p>
          <Link href="/shop" className="text-gold hover:underline text-xs">Back to shop</Link>
        </div>
      </div>
    );
  }

  const { product, related, upsell, reviews } = data;
  const images = product.images?.length ? product.images : [product.img].filter(Boolean);

  return (
    <ProductPageClient
      product={product}
      images={images}
      related={related}
      upsell={upsell}
      reviews={reviews}
    />
  );
}
