import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: product } = await supabase
    .from('products')
    .select('title, description, price, img')
    .eq('slug', slug)
    .single();

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const title = product.title;
  const description = product.description
    ? product.description.slice(0, 155)
    : `${title} — ${product.price}. A quiet luxury crafted for married couples by Secret Hour.`;
  const url = `https://secrethour.pk/product/${slug}`;
  const image = product.img?.startsWith('http') ? product.img : `https://secrethour.pk${product.img}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — Secret Hour`,
      description,
      url,
      images: [{ url: image, width: 800, height: 800, alt: title }],
      type: 'website',
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

export default function ProductLayout({ children }) {
  return children;
}
