import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Admin: fetch all abandoned carts
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('status'); // 'abandoned' | 'converted' | null (all)

    let q = supabase.from('abandoned_carts').select('*').order('updated_at', { ascending: false });
    if (filter && filter !== 'all') q = q.eq('status', filter);

    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Checkout: upsert abandoned cart
export async function POST(req) {
  try {
    const body = await req.json();
    const { session_id, name, email, phone, address, city, items, total, status } = body;

    if (!session_id) return NextResponse.json({ error: 'session_id required' }, { status: 400 });

    const { data, error } = await supabase
      .from('abandoned_carts')
      .upsert({
        session_id,
        name:       name       || null,
        email:      email      || null,
        phone:      phone      || null,
        address:    address    || null,
        city:       city       || null,
        items:      items      || [],
        total:      total      || 0,
        status:     status     || 'abandoned',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'session_id' })
      .select('id')
      .single();

    if (error) throw error;
    return NextResponse.json({ id: data.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Admin: delete abandoned cart
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const { error } = await supabase.from('abandoned_carts').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
