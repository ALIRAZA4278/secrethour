'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import BlogForm from './blog-form';
import { getAdminBlogs, deleteBlog } from '@/app/admin/blog-actions';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  word_count: number;
  status: 'draft' | 'published';
  meta_description?: string;
  created_at: string;
}

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

export default function BlogsList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    const result = await getAdminBlogs();
    if (!result.error) {
      setBlogs(result.blogs as Blog[]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    setDeleting(id);
    const result = await deleteBlog(id);
    setDeleting(null);

    if (result.success) {
      setBlogs(blogs.filter(b => b.id !== id));
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-1">BLOG</p>
            <h3 className="text-2xl text-cream" style={serif}>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h3>
          </div>
          <button
            onClick={() => {
              setShowForm(false);
              setEditingBlog(null);
            }}
            className="text-gray-400 hover:text-gray-300 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <BlogForm
            blog={editingBlog || undefined}
            onSuccess={() => {
              setShowForm(false);
              setEditingBlog(null);
              loadBlogs();
            }}
            onClose={() => {
              setShowForm(false);
              setEditingBlog(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-1">BLOG MANAGEMENT</p>
          <h3 className="text-2xl text-cream" style={serif}>All Blog Posts</h3>
        </div>
        <button
          onClick={() => {
            setEditingBlog(null);
            setShowForm(true);
          }}
          className="px-4 py-2.5 bg-gold text-gray-900 rounded-lg font-semibold text-sm hover:bg-yellow-400 transition uppercase tracking-[0.12em]"
        >
          + New Blog
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-gray-400 text-sm">Loading blogs...</p>
          </div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="border-2 border-dashed border-gray-700 rounded-lg px-6 py-12 text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400 mb-2">No blogs yet</p>
          <p className="text-gray-500 text-xs mb-4">Create your first blog post to get started</p>
          <button
            onClick={() => {
              setEditingBlog(null);
              setShowForm(true);
            }}
            className="inline-block px-4 py-2 bg-gold text-gray-900 rounded-lg font-semibold text-xs hover:bg-yellow-400 transition uppercase tracking-[0.12em]"
          >
            + Create Blog
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map(blog => (
            <div
              key={blog.id}
              className="flex items-start gap-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-gray-600 hover:bg-gray-800/70 transition"
            >
              {/* Cover Image */}
              {blog.cover_image && (
                <div className="relative w-20 h-20 flex-shrink-0 bg-gray-700 rounded-lg overflow-hidden">
                  <Image
                    src={blog.cover_image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Blog Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-cream font-semibold text-sm mb-2">{blog.title}</h4>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className={`px-2.5 py-1 rounded-full font-medium ${
                    blog.status === 'published'
                      ? 'bg-green-900/30 text-green-300 border border-green-700/30'
                      : 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30'
                  }`}>
                    {blog.status === 'published' ? '✓ Published' : '● Draft'}
                  </span>
                  <span className="text-gray-400">
                    <span className="font-semibold text-cream">{blog.word_count}</span> words
                  </span>
                  <span className="text-gray-500">
                    {new Date(blog.created_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setEditingBlog(blog);
                    setShowForm(true);
                  }}
                  className="px-3 py-1.5 text-xs text-gold bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 hover:border-gold transition uppercase tracking-[0.08em] font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  disabled={deleting === blog.id}
                  className="px-3 py-1.5 text-xs text-red-400 bg-red-900/20 border border-red-700/30 rounded-lg hover:bg-red-900/40 hover:border-red-600/50 transition disabled:opacity-50 uppercase tracking-[0.08em] font-medium"
                >
                  {deleting === blog.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
