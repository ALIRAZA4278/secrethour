import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { session_id, name, email, phone, city, items, total, status } = body;

    if (!session_id) return NextResponse.json({ error: 'session_id required' }, { status: 400 });

    const { data, error } = await supabase
      .from('abandoned_carts')
      .upsert({
        session_id,
        name:       name       || null,
        email:      email      || null,
        phone:      phone      || null,
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
