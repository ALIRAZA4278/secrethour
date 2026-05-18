import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TOKEN = process.env.POSTEX_API_TOKEN;

function orderNum(id) {
  let h = 0;
  for (const c of (id || '').replace(/-/g, '')) h = ((h << 5) - h + parseInt(c, 16)) | 0;
  return `SH-${Math.abs(h % 9000) + 1000}`;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const orderId = (searchParams.get('orderId') || '').trim().toUpperCase();
  const contact = (searchParams.get('contact') || '').trim().toLowerCase();

  if (!orderId || !contact) {
    return NextResponse.json({ error: 'Order ID and contact required' }, { status: 400 });
  }

  // Fetch all orders and find matching one
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, first_name, email, phone, postex_tracking, postex_status, city, total')
    .order('created_at', { ascending: false });

  if (error || !orders) {
    return NextResponse.json({ error: 'Could not fetch orders' }, { status: 500 });
  }

  const cleanInput = orderId.replace(/^#/, '');
  const order = orders.find(o => {
    // Match by UUID prefix (from email: #7EF981BA) OR by SH-XXXX format
    const uuidPrefix = o.id.replace(/-/g, '').slice(0, 8).toUpperCase();
    const shNum      = orderNum(o.id).toUpperCase();
    const idMatch    = uuidPrefix === cleanInput || shNum === cleanInput;

    const phone        = (o.phone || '').replace(/\D/g, '');
    const contactClean = contact.replace(/\D/g, '');
    const emailMatch   = (o.email || '').toLowerCase() === contact;
    const phoneMatch   = phone.endsWith(contactClean) && contactClean.length >= 7;
    return idMatch && (emailMatch || phoneMatch);
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found. Please check your Order ID and contact details.' }, { status: 404 });
  }

  if (!order.postex_tracking) {
    return NextResponse.json({
      orderRefNumber: `#${order.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`,
      customerName: order.first_name,
      cityName: order.city,
      orderStatus: order.postex_status || 'At Merchant Warehouse',
      transactionStatusMessage: order.postex_status || 'At Merchant Warehouse',
    });
  }

  // Fetch live status from PostEx
  try {
    const res  = await fetch(
      `https://api.postex.pk/services/integration/api/order/v1/track-order/${order.postex_tracking}`,
      { headers: { token: TOKEN } }
    );
    const data = await res.json();
    return NextResponse.json({
      ...(data.dist || data),
      tracking: order.postex_tracking,
      orderRefNumber: `#${order.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`,
      customerName: order.first_name,
    });
  } catch {
    return NextResponse.json({
      tracking: order.postex_tracking,
      orderRefNumber: orderNum(order.id),
      customerName: order.first_name,
      cityName: order.city,
      orderStatus: order.postex_status || 'In Transit',
    });
  }
}
