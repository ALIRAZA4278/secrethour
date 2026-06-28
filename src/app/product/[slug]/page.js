import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import MetaPixel from '../../components/MetaPixel';
import Footer from '../../components/Footer';
import { supabase } from '../../../lib/supabase';
import ProductPageClient from './ProductPageClient';

// Server-side data fetching — runs on server only
export async function generateStaticParams() {
  try {
    const { data: products } = await supabase.from('products').select('slug').neq('hidden', true);
    return (products || []).map(p => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

async function getProductData(slug) {
  try {
    const [{ data: product }, { data: allProducts }, { data: reviews }] = await Promise.all([
      supabase.from('products').select('*').eq('slug', slug).neq('hidden', true).single(),
      supabase.from('products').select('slug, title, price, numeric_price, img, category').neq('slug', slug).neq('hidden', true),
      supabase.from('product_reviews').select('id, reviewer_name, rating, body, created_at').eq('product_slug', slug).eq('approved', true).order('created_at', { ascending: false }),
    ]);

    if (!product) return null;

    return {
      product,
      related: (allProducts || []).slice(0, 3),
      upsell: allProducts?.find(x => x.slug === product.upsell_slug) || null,
      reviews: reviews || [],
    };
  } catch {
    return null;
  }
}

export const metadata = {
  title: 'Product | Secret Hour',
  description: 'Discover our curated collection of intimate experiences.',
};

export default async function ProductPage({ params }) {
  const { slug } = params;
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
