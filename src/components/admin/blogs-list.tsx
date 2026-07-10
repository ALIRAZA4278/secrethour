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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg text-cream" style={serif}>{editingBlog ? 'Edit Blog' : 'New Blog'}</h3>
        </div>
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
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-cream" style={serif}>Blogs</h3>
        <button
          onClick={() => {
            setEditingBlog(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-gold text-gray-900 rounded font-semibold text-sm hover:bg-yellow-400 transition"
        >
          + New Blog
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-8">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No blogs yet. Create one to get started!</div>
      ) : (
        <div className="space-y-3">
          {blogs.map(blog => (
            <div
              key={blog.id}
              className="flex items-center gap-4 p-4 bg-gray-800 rounded border border-gray-700 hover:border-gray-600 transition"
            >
              {/* Cover Image */}
              {blog.cover_image && (
                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-700 rounded">
                  <Image
                    src={blog.cover_image}
                    alt={blog.title}
                    fill
                    className="object-cover rounded"
                    unoptimized
                  />
                </div>
              )}

              {/* Blog Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-cream font-semibold truncate">{blog.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-gray-400 text-xs">
                  <span className={`px-2 py-1 rounded ${blog.status === 'published' ? 'bg-green-900/30 text-green-400' : 'bg-gray-900/30 text-gray-400'}`}>
                    {blog.status}
                  </span>
                  <span>{blog.word_count} words</span>
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingBlog(blog);
                    setShowForm(true);
                  }}
                  className="px-3 py-1 text-xs text-gold bg-gray-700 rounded hover:bg-gray-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  disabled={deleting === blog.id}
                  className="px-3 py-1 text-xs text-red-400 bg-red-900/20 rounded hover:bg-red-900/40 transition disabled:opacity-50"
                >
                  {deleting === blog.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
