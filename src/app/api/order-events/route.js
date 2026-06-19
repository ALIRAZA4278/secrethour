import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET: fetch events for an order
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const order_id = searchParams.get('order_id');
    if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 });

    const { data, error } = await supabase
      .from('order_events')
      .select('*')
      .eq('order_id', order_id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: insert a new event
export async function POST(req) {
  try {
    const { order_id, type, content } = await req.json();
    if (!order_id || !content) return NextResponse.json({ error: 'order_id and content required' }, { status: 400 });

    const { data, error } = await supabase
      .from('order_events')
      .insert({ order_id, type: type || 'comment', content })
      .select('*')
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
