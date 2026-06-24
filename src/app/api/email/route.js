import { NextResponse } from 'next/server';
import { sendEmail, orderConfirmationHtml, adminOrderNotificationHtml, orderStatusHtml } from '../../../lib/email';

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, to, name, phone, orderId, items, total, payment, city, address, trackingNumber, status } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    if (type === 'status_update') {
      if (to) {
        const statusLabels = { confirmed: 'Confirmed', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled', returned: 'Returned', pending: 'Received' };
        const label = statusLabels[status] || status;
        await sendEmail({
          to,
          subject: `Your Secret Hour Order has been ${label}`,
          html: orderStatusHtml({ name, orderId, status, items, total }),
        });
      }
      return NextResponse.json({ ok: true });
    }

    // Customer confirmation email (only if customer has email)
    if (to) {
      try {
        await sendEmail({
          to,
          subject: 'Your Secret Hour Order is Confirmed',
          html: orderConfirmationHtml({ name, orderId, items, total, payment, city, trackingNumber }),
        });
      } catch (emailErr) {
        console.error('Failed to send customer email:', emailErr.message);
      }
    }

    // Admin notification email — always send
    const adminEmail = process.env.ADMIN_EMAIL || 'secrethour.pk@gmail.com';
    try {
      await sendEmail({
        to: adminEmail,
        subject: `New Order #${String(orderId).slice(0, 8).toUpperCase()} — ${name} (${city})`,
        html: adminOrderNotificationHtml({ name, phone, city, address, orderId, items, total, payment }),
      });
    } catch (emailErr) {
      console.error('Failed to send admin email:', emailErr.message);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Email endpoint error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
