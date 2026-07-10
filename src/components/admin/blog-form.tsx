'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { createBlog, updateBlog, uploadBlogImage } from '@/app/admin/blog-actions';

const RichTextEditor = dynamic(() => import('./rich-text-editor'), { ssr: false });

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

const labelCls = 'block text-gray-500 text-xs uppercase tracking-[0.18em] font-medium mb-1.5';
const inputCls = 'w-full px-3.5 py-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-100 transition placeholder:text-gray-400';
const textareaCls = 'w-full px-3.5 py-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-100 transition placeholder:text-gray-400 resize-vertical';

export default function BlogForm({ blog, onSuccess, onClose }: BlogFormProps) {
  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');
  const [coverImage, setCoverImage] = useState(blog?.cover_image || '');
  const [status, setStatus] = useState<'draft' | 'published'>(blog?.status || 'draft');
  const [metaDescription, setMetaDescription] = useState(blog?.meta_description || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate word count from HTML content
  const getPlainText = (html: string) => {
    const div = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (!div) return '';
    div.innerHTML = html;
    return div.textContent || '';
  };

  const plainContent = getPlainText(content);
  const wordCount = plainContent.trim().split(/\s+/).filter(w => w.length > 0).length;
  const isOverLimit = wordCount > 2000;
  const wordCountColor = wordCount > 2000 ? 'text-red-500' : wordCount > 1500 ? 'text-yellow-500' : 'text-green-500';

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    console.log('Starting upload...');
    const result = await uploadBlogImage(formData);
    console.log('Upload result:', result);
    setUploading(false);

    if (result.error) {
      console.error('Upload error:', result.error);
      setMessage({ type: 'error', text: `Upload failed: ${result.error}` });
    } else if (!result.url) {
      console.error('No URL returned from upload');
      setMessage({ type: 'error', text: 'Upload failed: No URL returned' });
    } else {
      console.log('Setting cover image:', result.url);
      setCoverImage(result.url);
      setMessage({ type: 'success', text: 'Cover image uploaded successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(files[0]);
        fileInputRef.current.files = dataTransfer.files;
        handleImageUpload({ target: fileInputRef.current } as any);
      }
    }
  };

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
    <div>
      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium border ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className={labelCls}>Blog Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Intimate Moments - Couples Ka Secret Time"
            className={inputCls}
            required
          />
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className={labelCls}>Cover Image *</label>

          {coverImage ? (
            <div className="mb-4 space-y-3">
              <div className="relative w-full h-48 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden">
                <Image
                  src={coverImage}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setCoverImage('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="text-xs text-red-600 hover:text-red-800 font-medium uppercase tracking-[0.08em]"
              >
                ✕ Remove Image
              </button>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg px-6 py-8 text-center cursor-pointer transition ${
                dragActive
                  ? 'border-gray-400 bg-gray-50'
                  : 'border-gray-300 bg-gray-50 hover:bg-white'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-4m0 0V8m0 4H8m0 0h4m0 0h4" />
              </svg>
              <p className="text-gray-700 text-sm mb-1">Drop your image here or click to browse</p>
              <p className="text-gray-500 text-xs">JPG, PNG • Max 5MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading && (
            <div className="mt-3 flex items-center gap-2 text-gray-700 text-xs font-medium">
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" />
              Uploading image...
            </div>
          )}
        </div>

        {/* Content with Rich Text Editor */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelCls}>Blog Content *</label>
            <div className={`text-xs font-medium flex items-center gap-2 ${wordCountColor}`}>
              {isOverLimit ? (
                <>
                  <span className="text-red-600">⚠</span>
                  <span className="text-red-600">Exceeds limit ({wordCount}/2000)</span>
                </>
              ) : wordCount > 1500 ? (
                <>
                  <span className="text-yellow-600">!</span>
                  <span className="text-yellow-600">Getting close ({wordCount}/2000)</span>
                </>
              ) : (
                <>
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-600">{wordCount} / 2000 words</span>
                </>
              )}
            </div>
          </div>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write your blog content here with rich formatting..."
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className={labelCls}>Meta Description (SEO)</label>
          <input
            type="text"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))}
            placeholder="Brief description for search engines (optional)"
            className={inputCls}
            maxLength={160}
          />
          <p className="text-gray-500 text-xs mt-1">{metaDescription.length}/160 characters</p>
        </div>

        {/* Status */}
        <div>
          <label className={labelCls}>Publication Status *</label>
          <div className="flex gap-3">
            {[
              { value: 'draft', label: 'Draft', desc: 'Visible only to admin' },
              { value: 'published', label: 'Published', desc: 'Visible to everyone' },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex-1 flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  status === option.value
                    ? 'border-gray-500 bg-gray-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={status === option.value}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                  className="accent-gray-900"
                />
                <div>
                  <p className="text-gray-900 text-sm font-medium">{option.label}</p>
                  <p className="text-gray-600 text-xs">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-gray-300">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition font-medium text-sm uppercase tracking-[0.12em]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading || isOverLimit || !title.trim() || !content.trim() || !coverImage}
            className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition disabled:opacity-40 disabled:cursor-not-allowed text-sm uppercase tracking-[0.12em]"
          >
            {saving ? 'Saving...' : blog ? 'Update Blog' : '+ Create Blog'}
          </button>
        </div>
      </form>
    </div>
  );
}
