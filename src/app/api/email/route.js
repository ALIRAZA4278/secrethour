import { NextResponse } from 'next/server';
import { sendEmail, orderConfirmationHtml, adminOrderNotificationHtml } from '../../../lib/email';

export async function POST(req) {
  try {
    const body = await req.json();
    const { to, name, phone, orderId, items, total, payment, city, address, trackingNumber } = body;

    if (!to || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
