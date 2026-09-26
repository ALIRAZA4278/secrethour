import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TOKEN = process.env.POSTEX_API_TOKEN;

const SUPPORT_HELPLINE = '+92 371 2400399';
const SHIPPER_NAME = 'Secret Hour';
const SHIPPER_CITY = 'Karachi';

function orderNum(id) {
  let h = 0;
  for (const c of (id || '').replace(/-/g, '')) h = ((h << 5) - h + parseInt(c, 16)) | 0;
  return `SH-${Math.abs(h % 9000) + 1000}`;
}

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

// PostEx's raw status text varies by courier stage; map it to our own
// canonical set so the tracker always speaks in our words, not theirs.
function mapStatus(raw, fallback) {
  const s = (raw || '').toLowerCase();
  if (!s) return fallback || 'pending';
  if (s.includes('deliver') && !s.includes('undeliver') && !s.includes('attempt')) return 'delivered';
  if (s.includes('out for delivery')) return 'out_for_delivery';
  if (s.includes('attempt')) return 'attempt';
  if (s.includes('return')) return 'returned';
  if (s.includes('cancel')) return 'cancelled';
  if (s.includes('transit') || s.includes('picked') || s.includes('warehouse') || s.includes('dispatch') || s.includes('ship')) return 'shipped';
  if (s.includes('book') || s.includes('confirm')) return 'confirmed';
  return fallback || 'pending';
}

// The only fields this endpoint is allowed to expose. It's a public,
// unauthenticated lookup by order ID, so nothing customer-identifying
// (name, phone, address, amount) belongs in the response.
function safeResponse({ cnNumber, statusKey, bookingDate, destinationCity }) {
  return {
    cnNumber: cnNumber || null,
    courierHelpline: SUPPORT_HELPLINE,
    shipperName: SHIPPER_NAME,
    shipperCity: SHIPPER_CITY,
    destinationCity: destinationCity || null,
    statusKey,
    bookingDate: formatDate(bookingDate),
  };
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const orderId = (searchParams.get('orderId') || '').trim().toUpperCase();
  const contact = (searchParams.get('contact') || '').trim().toLowerCase();

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
  }

  // Fetch all orders and find matching one
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, email, phone, postex_tracking, postex_status, status, city, created_at')
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

    // If contact is provided, verify it matches
    if (contact.trim()) {
      const phone        = (o.phone || '').replace(/\D/g, '');
      const contactClean = contact.replace(/\D/g, '');
      const contactLower = contact.toLowerCase();
      const emailMatch   = (o.email || '').toLowerCase() === contactLower;
      const phoneMatch   = phone.includes(contactClean) || contactClean.includes(phone.slice(-4));
      return idMatch && (emailMatch || phoneMatch);
    }

    // If no contact provided, just match Order ID
    return idMatch;
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found. Please check your Order ID and contact details.' }, { status: 404 });
  }

  if (!order.postex_tracking) {
    return NextResponse.json(safeResponse({
      statusKey: mapStatus(order.status, order.status),
      bookingDate: order.created_at,
      destinationCity: order.city,
    }));
  }

  // Fetch live status from PostEx — only the status and dates are used;
  // the rest of that payload (name, phone, address, invoice) is dropped.
  try {
    const res  = await fetch(
      `https://api.postex.pk/services/integration/api/order/v1/track-order/${order.postex_tracking}`,
      { headers: { token: TOKEN } }
    );
    const data = await res.json();
    const dist = data.dist || data;
    return NextResponse.json(safeResponse({
      cnNumber: order.postex_tracking,
      statusKey: mapStatus(dist.transactionStatusMessage || dist.orderStatus, order.status),
      bookingDate: dist.bookingDate || dist.orderPickupDate || order.created_at,
      destinationCity: order.city,
    }));
  } catch {
    return NextResponse.json(safeResponse({
      cnNumber: order.postex_tracking,
      statusKey: mapStatus(order.status, order.status),
      bookingDate: order.created_at,
      destinationCity: order.city,
    }));
  }
}
