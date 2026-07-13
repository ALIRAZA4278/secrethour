import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import MetaPixel from '../../components/MetaPixel';
import Footer from '../../components/Footer';
import { getServerSupabase } from '../../../lib/supabase-server';
import ProductPageClient from './ProductPageClient';

export const dynamicParams = true;

// Slug aliases mapping
const SLUG_ALIASES = {
  'the-midnight-deck': 'midnight-deck',
};

function resolveSlug(slug) {
  return SLUG_ALIASES[slug] || slug;
}

export async function generateStaticParams() {
  try {
    const supabase = getServerSupabase();
    const { data: products } = await supabase.from('products').select('slug').neq('hidden', true);
    const staticSlugs = (products || []).map(p => ({ slug: p.slug }));

    const aliasSlugs = Object.keys(SLUG_ALIASES).map(alias => ({ slug: alias }));

    return [...staticSlugs, ...aliasSlugs];
  } catch {
    return [];
  }
}

async function getProductData(slug) {
  try {
    const actualSlug = resolveSlug(slug);
    const supabase = getServerSupabase();

    const [productRes, allProductsRes, reviewsRes] = await Promise.all([
      supabase.from('products').select('*').eq('slug', actualSlug).neq('hidden', true).single(),
      supabase.from('products').select('slug, title, price, numeric_price, img, category').neq('hidden', true),
      supabase.from('product_reviews').select('id, reviewer_name, rating, body, created_at').eq('product_slug', actualSlug).eq('approved', true).order('created_at', { ascending: false }),
    ]);

    if (productRes.error || !productRes.data) {
      console.error(`Product not found for slug: ${slug} (resolved: ${actualSlug})`);
      return null;
    }

    const product = productRes.data;
    const allProducts = allProductsRes.data || [];
    const reviews = reviewsRes.data || [];

    return {
      product,
      related: allProducts.filter(p => p.slug !== actualSlug).slice(0, 3),
      upsell: allProducts.find(x => x.slug === product.upsell_slug) || null,
      reviews,
    };
  } catch (err) {
    console.error(`Error fetching product ${slug}:`, err.message);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const actualSlug = resolveSlug(slug);

  const data = await getProductData(slug);

  if (!data) {
    return {
      title: 'Product Not Found | Secret Hour',
      description: 'This product could not be found.',
    };
  }

  const { product } = data;

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
      images: product.img ? [
        {
          url: product.img,
          width: 1200,
          height: 630,
          alt: product.title,
        }
      ] : [],
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
