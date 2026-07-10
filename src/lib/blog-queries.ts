import { getServerSupabase } from './supabase-server';

export async function getPublishedBlogs(page = 1, limit = 10) {
  try {
    const supabase = getServerSupabase();
    const offset = (page - 1) * limit;

    // Get total count
    const { count } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    // Get paginated blogs
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching blogs:', error);
      return { blogs: [], total: 0, hasMore: false };
    }

    return {
      blogs: data || [],
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
    };
  } catch (err) {
    console.error('Error in getPublishedBlogs:', err);
    return { blogs: [], total: 0, hasMore: false };
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error(`Error fetching blog ${slug}:`, error);
      return null;
    }

    return data;
  } catch (err) {
    console.error(`Error in getBlogBySlug:`, err);
    return null;
  }
}

export async function getBlogCount() {
  try {
    const supabase = getServerSupabase();

    const { count, error } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    if (error) {
      console.error('Error counting blogs:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('Error in getBlogCount:', err);
    return 0;
  }
}

export async function getAllPublishedBlogSlugs() {
  try {
    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from('blogs')
      .select('slug')
      .eq('status', 'published');

    if (error) {
      console.error('Error fetching blog slugs:', error);
      return [];
    }

    return (data || []).map((b) => b.slug);
  } catch (err) {
    console.error('Error in getAllPublishedBlogSlugs:', err);
    return [];
  }
}
