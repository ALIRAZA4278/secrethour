import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get('code') || '').trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('promo_codes')
    .select('code, discount_pct, active')
    .eq('code', code)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid promo code' }, { status: 404 });
  }

  if (!data.active) {
    return NextResponse.json({ error: 'This promo code is no longer active' }, { status: 400 });
  }

  return NextResponse.json({ discount: data.discount_pct });
}
