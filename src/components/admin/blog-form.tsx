'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { createBlog, updateBlog, uploadBlogImage } from '@/app/admin/blog-actions';

interface BlogFormProps {
  blog?: {
    id: string;
    title: string;
    content: string;
    cover_image: string;
    status: 'draft' | 'published';
    meta_description?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

const labelCls = 'block text-gray-400 text-xs uppercase tracking-[0.2em] mb-2';
const inputCls = 'w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-cream focus:border-gold outline-none transition';
const textareaCls = 'w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-cream focus:border-gold outline-none transition resize-none';

export default function BlogForm({ blog, onSuccess, onClose }: BlogFormProps) {
  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');
  const [coverImage, setCoverImage] = useState(blog?.cover_image || '');
  const [status, setStatus] = useState<'draft' | 'published'>(blog?.status || 'draft');
  const [metaDescription, setMetaDescription] = useState(blog?.meta_description || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const wordCount = content.trim().split(/\s+/).length;
  const isOverLimit = wordCount > 2000;
  const wordCountColor = wordCount > 2000 ? 'text-red-500' : wordCount > 1500 ? 'text-yellow-500' : 'text-green-500';

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadBlogImage(formData);
    setUploading(false);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setCoverImage(result.url!);
      setMessage({ type: 'success', text: 'Image uploaded successfully' });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Title is required' });
      return;
    }

    if (!content.trim()) {
      setMessage({ type: 'error', text: 'Content is required' });
      return;
    }

    if (!coverImage) {
      setMessage({ type: 'error', text: 'Cover image is required' });
      return;
    }

    if (isOverLimit) {
      setMessage({ type: 'error', text: `Word count exceeds 2000 word limit (${wordCount} words)` });
      return;
    }

    setSaving(true);
    let result;

    if (blog) {
      result = await updateBlog({
        id: blog.id,
        title,
        content,
        cover_image: coverImage,
        status,
        meta_description: metaDescription || content.slice(0, 160),
      });
    } else {
      result = await createBlog({
        title,
        content,
        cover_image: coverImage,
        status,
        meta_description: metaDescription || content.slice(0, 160),
      });
    }

    setSaving(false);

    if ('error' in result && result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: blog ? 'Blog updated successfully' : 'Blog created successfully' });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="space-y-5">
      {message && (
        <div className={`text-sm px-4 py-2 rounded ${message.type === 'error' ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className={labelCls}>Blog Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            className={inputCls}
            required
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className={labelCls}>Cover Image *</label>
          {coverImage && (
            <div className="mb-3 relative w-full h-40 bg-gray-800 rounded border border-gray-700">
              <Image
                src={coverImage}
                alt="Cover preview"
                fill
                className="object-cover rounded"
                unoptimized
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full text-cream text-sm"
          />
          {uploading && <p className="text-gold text-xs mt-1">Uploading...</p>}
        </div>

        {/* Content */}
        <div>
          <label className={labelCls}>Blog Content * ({wordCount} words)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
            className={textareaCls}
            rows={10}
            required
          />
          <div className={`text-xs mt-1 ${wordCountColor}`}>
            {isOverLimit ? `⚠ Word count exceeds limit (${wordCount}/2000)` : `${wordCount} / 2000 words`}
          </div>
        </div>

        {/* Meta Description */}
        <div>
          <label className={labelCls}>Meta Description (SEO)</label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Brief description for search engines (optional)"
            className={textareaCls}
            rows={3}
            maxLength={160}
          />
          <p className="text-gray-500 text-xs mt-1">{metaDescription.length}/160 characters</p>
        </div>

        {/* Status */}
        <div>
          <label className={labelCls}>Status *</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="draft"
                checked={status === 'draft'}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="accent-gold"
              />
              <span className="text-cream text-sm">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="published"
                checked={status === 'published'}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="accent-gold"
              />
              <span className="text-cream text-sm">Published</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-400 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading || isOverLimit}
            className="flex-1 px-4 py-2 bg-gold text-gray-900 rounded font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : blog ? 'Update Blog' : 'Create Blog'}
          </button>
        </div>
      </form>
    </div>
  );
}
