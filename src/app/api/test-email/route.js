import { NextResponse } from 'next/server';
import { sendEmail } from '../../../lib/email';

export async function GET(req) {
  try {
    // Test email karo
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'secrethour.pk@gmail.com',
      subject: 'Test Email from Secret Hour',
      html: '<h1>Email System Working!</h1><p>SMTP credentials validated successfully.</p>',
    });

    return NextResponse.json({ ok: true, message: 'Test email sent successfully' });
  } catch (err) {
    return NextResponse.json({
      error: err.message,
      code: err.code,
      details: err.toString(),
    }, { status: 500 });
  }
}
