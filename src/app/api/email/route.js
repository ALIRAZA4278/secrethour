import { NextResponse } from 'next/server';
import { sendEmail, orderConfirmationHtml, adminOrderNotificationHtml, orderStatusHtml } from '../../../lib/email';

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, to, name, phone, orderId, items, total, payment, city, address, trackingNumber, status } = body;

    if (!to || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (type === 'status_update') {
      const statusLabels = { confirmed: 'Confirmed', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled', returned: 'Returned', pending: 'Received' };
      const label = statusLabels[status] || status;
      await sendEmail({
        to,
        subject: `Your Secret Hour Order has been ${label}`,
        html: orderStatusHtml({ name, orderId, status, items, total }),
      });
      return NextResponse.json({ ok: true });
    }

    // Customer confirmation email
    await sendEmail({
      to,
      subject: 'Your Secret Hour Order is Confirmed',
      html: orderConfirmationHtml({ name, orderId, items, total, payment, city, trackingNumber }),
    });

    // Admin notification email
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `🛒 New Order #${String(orderId).slice(0, 8).toUpperCase()} — ${name} (${city})`,
        html: adminOrderNotificationHtml({ name, phone, city, address, orderId, items, total, payment }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
