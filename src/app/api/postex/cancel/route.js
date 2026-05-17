import { NextResponse } from 'next/server';

const TOKEN = process.env.POSTEX_API_TOKEN;

export async function POST(req) {
  try {
    const body = await req.json();
    const { trackingNumber } = body;

    if (!trackingNumber) {
      return NextResponse.json({ error: 'trackingNumber required' }, { status: 400 });
    }

    const res = await fetch(
      'https://api.postex.pk/services/integration/api/order/v1/cancel-order',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: TOKEN,
        },
        body: JSON.stringify({ trackingNumber }),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
