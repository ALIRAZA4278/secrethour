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
    const supabase = getServerSupabase();
    const queries = await Promise.allSettled([
      supabase.from('products').select('*').eq('slug', slug).neq('hidden', true),
      supabase.from('products').select('slug, title, price, numeric_price, img, category').neq('hidden', true),
      supabase.from('product_reviews').select('id, reviewer_name, rating, body, created_at').eq('product_slug', slug).eq('approved', true).order('created_at', { ascending: false }),
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

export const metadata = {
  title: 'Product | Secret Hour',
  description: 'Discover our curated collection of intimate experiences.',
};

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
