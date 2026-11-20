import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSupabase } from '../../../lib/supabase-server';
import { SITE_KEYS, normalizeSetting } from '../../../lib/site-defaults';

// Saves one editable site setting. The admin panel signs in client-side, so every save
// re-sends the admin credentials and they are checked here — the table itself has no
// public write policy, which keeps the anon key from being able to rewrite the homepage.
export async function POST(req) {
  try {
    const { email, password, key, value } = await req.json();

    const okEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const okPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!okEmail || !okPass || String(email || '').trim() !== okEmail || password !== okPass) {
      return NextResponse.json({ error: 'Not authorised' }, { status: 401 });
    }
    if (!SITE_KEYS.includes(key)) {
      return NextResponse.json({ error: 'Unknown setting' }, { status: 400 });
    }

    const clean = normalizeSetting(key, value);
    const { error } = await getServerSupabase()
      .from('site_settings')
      .upsert({ key, value: clean, updated_at: new Date().toISOString() });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // The home page is statically regenerated; refresh it so the edit shows immediately.
    if (key === 'hero') revalidatePath('/');
    return NextResponse.json({ ok: true, value: clean });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
