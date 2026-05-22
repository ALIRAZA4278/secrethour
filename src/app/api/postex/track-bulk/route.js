import { NextResponse } from 'next/server';

const TOKEN = process.env.POSTEX_API_TOKEN;

export async function POST(req) {
  try {
    const { trackingNumbers } = await req.json();
    if (!trackingNumbers?.length) {
      return NextResponse.json({ error: 'trackingNumbers required' }, { status: 400 });
    }

    const res = await fetch(
      'https://api.postex.pk/services/integration/api/order/v1/track-bulk-order',
      {
        method: 'GET',
        headers: {
          token: TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackingNumber: trackingNumbers }),
      }
    );

    const data = await res.json();
    return NextResponse.json(data.dist || []);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
