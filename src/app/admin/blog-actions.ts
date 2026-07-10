'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Helper: Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper: Calculate word count
function calculateWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}

// Upload blog cover image to Supabase storage
export async function uploadBlogImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { url: null, error: 'No file provided' };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: 'File size must be less than 5MB' };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'File must be an image' };
    }

    const timestamp = Date.now();
    const fileName = `blog-${timestamp}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `blogs/${fileName}`;

    const { data, error } = await supabase.storage
      .from('blogs')
      .upload(filePath, file, { upsert: false });

    if (error) {
      return { url: null, error: error.message };
    }

    const { data: publicData } = supabase.storage
      .from('blogs')
      .getPublicUrl(filePath);

    return { url: publicData.publicUrl, error: null };
  } catch (err) {
    return { url: null, error: (err as Error).message };
  }
}

// Create new blog
export async function createBlog(input: {
  title: string;
  content: string;
  cover_image: string;
  status: 'draft' | 'published';
  meta_description?: string;
}) {
  try {
    const wordCount = calculateWordCount(input.content);

    // Validate word count
    if (wordCount > 2000) {
      return {
        id: null,
        slug: null,
        error: `Word count (${wordCount}) exceeds limit of 2000 words`,
      };
    }

    const slug = generateSlug(input.title);

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return {
        id: null,
        slug: null,
        error: 'A blog with this title already exists',
      };
    }

    const { data, error } = await supabase.from('blogs').insert({
      title: input.title,
      slug,
      content: input.content,
      cover_image: input.cover_image,
      word_count: wordCount,
      status: input.status,
      meta_description: input.meta_description || input.content.slice(0, 160),
    });

    if (error) {
      return { id: null, slug: null, error: error.message };
    }

    return { id: (data as any)?.[0]?.id || null, slug, error: null };
  } catch (err) {
    return { id: null, slug: null, error: (err as Error).message };
  }
}

// Update existing blog
export async function updateBlog(input: {
  id: string;
  title: string;
  content: string;
  cover_image: string;
  status: 'draft' | 'published';
  meta_description?: string;
}) {
  try {
    const wordCount = calculateWordCount(input.content);

    // Validate word count
    if (wordCount > 2000) {
      return {
        success: false,
        error: `Word count (${wordCount}) exceeds limit of 2000 words`,
      };
    }

    const { error } = await supabase
      .from('blogs')
      .update({
        title: input.title,
        content: input.content,
        cover_image: input.cover_image,
        word_count: wordCount,
        status: input.status,
        meta_description: input.meta_description || input.content.slice(0, 160),
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// Delete blog
export async function deleteBlog(id: string) {
  try {
    const { error } = await supabase.from('blogs').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// Get all blogs for admin
export async function getAdminBlogs() {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { blogs: [], error: error.message };
    }

    return { blogs: data || [], error: null };
  } catch (err) {
    return { blogs: [], error: (err as Error).message };
  }
}
