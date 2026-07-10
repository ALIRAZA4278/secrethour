import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import MetaPixel from '@/app/components/MetaPixel';
import { getBlogBySlug, getPublishedBlogs, getAllPublishedBlogSlugs } from '@/lib/blog-queries';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedBlogSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog Not Found',
      description: 'This blog post could not be found.',
    };
  }

  return {
    title: `${blog.title} — Secret Hour`,
    description: blog.meta_description || blog.content.slice(0, 160),
    openGraph: {
      title: `${blog.title} — Secret Hour`,
      description: blog.meta_description || blog.content.slice(0, 160),
      url: `https://secrethour.pk/blogs/${blog.slug}`,
      images: blog.cover_image ? [{ url: blog.cover_image, width: 1200, height: 630 }] : [],
    },
    alternates: {
      canonical: `https://secrethour.pk/blogs/${blog.slug}`,
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Get related blogs (newest 3, excluding current)
  const { blogs: allBlogs } = await getPublishedBlogs(1, 100);
  const relatedBlogs = allBlogs.filter((b: any) => b.slug !== slug).slice(0, 3);

  const estimateReadTime = (wordCount: number) => {
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="min-h-screen flex flex-col text-cream bg-sh-bg">
      <MetaPixel />
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Back Link */}
          <Link href="/blogs" className="inline-flex items-center gap-2 text-gold/60 hover:text-gold text-sm mb-8 transition">
            ← Back to Blogs
          </Link>

          {/* Cover Image */}
          {blog.cover_image && (
            <div className="relative w-full h-96 md:h-[500px] bg-sh-card rounded-lg overflow-hidden mb-8">
              <Image
                src={blog.cover_image}
                alt={blog.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          )}

          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl italic text-cream mb-4" style={serif}>
              {blog.title}
            </h1>

            <div className="flex items-center gap-4 text-cream/60 text-sm mb-6">
              <span>{new Date(blog.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>·</span>
              <span>{estimateReadTime(blog.word_count)} min read</span>
              <span>·</span>
              <span>{blog.word_count} words</span>
            </div>

            {blog.meta_description && (
              <p className="text-lg text-cream/70 italic leading-relaxed">{blog.meta_description}</p>
            )}
          </div>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none mb-16 prose-headings:text-cream prose-headings:italic prose-p:text-cream/80 prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg prose-strong:text-gold prose-em:text-cream/90">
            <div
              className="text-cream/80 leading-relaxed text-base md:text-lg"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gold/20 my-12" />

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div>
              <h2 className="text-2xl italic text-cream mb-8" style={serif}>
                More from the Blog
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relBlog: any) => (
                  <Link
                    key={relBlog.id}
                    href={`/blogs/${relBlog.slug}`}
                    className="group block"
                  >
                    <div className="space-y-3">
                      {relBlog.cover_image && (
                        <div className="relative w-full h-40 bg-sh-card rounded-lg overflow-hidden">
                          <Image
                            src={relBlog.cover_image}
                            alt={relBlog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                            unoptimized
                          />
                        </div>
                      )}
                      <h3 className="text-lg italic text-cream group-hover:text-gold transition" style={serif}>
                        {relBlog.title}
                      </h3>
                      <p className="text-cream/60 text-sm">
                        {new Date(relBlog.created_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
