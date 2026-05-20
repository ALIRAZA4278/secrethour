import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, statusUpdateHtml } from '../../../../lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const WEBHOOK_SECRET = process.env.POSTEX_WEBHOOK_SECRET;

const STATUS_MAP = {
  '0001': 'At Merchant Warehouse',
  '0002': 'Returned',
  '0003': 'At PostEx Warehouse',
  '0004': 'Out for Delivery',
  '0005': 'Delivered',
  '0006': 'Returned',
  '0007': 'Returned',
  '0008': 'Delivery Under Review',
  '0013': 'Attempt Made',
};

export async function POST(req) {
  try {
    if (WEBHOOK_SECRET) {
      const headerVal = req.headers.get('x-postex-secret');
      if (headerVal !== WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await req.json();
    const trackingNumber = body?.trackingNumber || body?.dist?.trackingNumber;
    const statusCode     = body?.transactionStatusMessageCode || body?.statusCode;
    const statusMessage  = body?.transactionStatusMessage || STATUS_MAP[statusCode] || 'Updated';

    if (!trackingNumber) {
      return NextResponse.json({ error: 'No tracking number' }, { status: 400 });
    }

    // Update order in Supabase + fetch customer details
    const isReturned = statusMessage === 'Returned';
    const updatePayload = {
      postex_status: statusMessage,
      postex_updated_at: new Date().toISOString(),
      ...(isReturned && { status: 'returned' }),
    };
    const { data: orders } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('postex_tracking', trackingNumber)
      .select('id, first_name, email, postex_tracking');

    // Send status email to customer
    const order = orders?.[0];
    if (order?.email) {
      await sendEmail({
        to: order.email,
        subject: `Secret Hour — Delivery Update: ${statusMessage}`,
        html: statusUpdateHtml({
          name: order.first_name || 'Valued Customer',
          trackingNumber,
          status: statusMessage,
          orderDetail: '',
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
