import { NextResponse } from 'next/server';
import { sendEmail, orderConfirmationHtml } from '../../../lib/email';

export async function POST(req) {
  try {
    const body = await req.json();
    const { to, name, orderId, items, total, payment, city, trackingNumber } = body;

    if (!to || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await sendEmail({
      to,
      subject: 'Your Secret Hour Order is Confirmed',
      html: orderConfirmationHtml({ name, orderId, items, total, payment, city, trackingNumber }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
