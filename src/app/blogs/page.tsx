import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import MetaPixel from '@/app/components/MetaPixel';
import { getPublishedBlogs } from '@/lib/blog-queries';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

export default async function BlogsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = parseInt(params?.page || '1', 10);
  const { blogs, total, hasMore } = await getPublishedBlogs(page, 10);

  const estimateReadTime = (wordCount: number) => {
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="min-h-screen flex flex-col text-cream bg-sh-bg">
      <MetaPixel />
      <Navbar />

      <main className="flex-1 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-gold text-[10px] uppercase tracking-[0.3em] mb-4">Secret Hour</p>
            <h1 className="text-4xl md:text-5xl italic text-cream mb-4" style={serif}>
              Insights & Stories
            </h1>
            <p className="text-cream/60 max-w-2xl mx-auto">
              Thoughts on intimacy, connection, and the art of being together.
            </p>
          </div>

          {/* Blogs Grid */}
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-cream/50 mb-4">No blogs published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {blogs.map((blog: any) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group block"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-stretch hover:opacity-80 transition">
                    {/* Cover Image */}
                    {blog.cover_image && (
                      <div className="md:w-1/3 relative h-48 md:h-64 bg-sh-card rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={blog.cover_image}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                          unoptimized
                        />
                      </div>
                    )}

                    {/* Blog Content */}
                    <div className="md:w-2/3 flex flex-col justify-between">
                      <div>
                        <h2 className="text-2xl md:text-3xl italic text-cream mb-3" style={serif}>
                          {blog.title}
                        </h2>
                        <p className="text-cream/70 line-clamp-3 mb-4">
                          {blog.meta_description || blog.content.slice(0, 200)}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-cream/50 text-sm">
                        <span>{new Date(blog.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>·</span>
                        <span>{estimateReadTime(blog.word_count)} min read</span>
                        <span>·</span>
                        <span>{blog.word_count} words</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 10 && (
            <div className="mt-16 flex items-center justify-center gap-4">
              {page > 1 && (
                <Link
                  href={`/blogs?page=${page - 1}`}
                  className="px-4 py-2 border border-gold/30 text-gold rounded hover:bg-gold/10 transition text-sm"
                >
                  ← Previous
                </Link>
              )}

              <div className="text-cream/60 text-sm">
                Page {page} of {Math.ceil(total / 10)}
              </div>

              {hasMore && (
                <Link
                  href={`/blogs?page=${page + 1}`}
                  className="px-4 py-2 border border-gold/30 text-gold rounded hover:bg-gold/10 transition text-sm"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
