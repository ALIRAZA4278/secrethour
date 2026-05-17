import { NextResponse } from 'next/server';

const TOKEN = process.env.POSTEX_API_TOKEN;
const PICKUP_ADDRESS = 'C-17, Sector W/4, Gulshan-E-Maymar, Karachi.';

export async function POST(req) {
  try {
    const body = await req.json();
    const { trackingNumbers } = body;

    if (!trackingNumbers || trackingNumbers.length === 0) {
      return NextResponse.json({ error: 'trackingNumbers array required' }, { status: 400 });
    }

    const res = await fetch(
      'https://api.postex.pk/services/integration/api/order/v2/generate-load-sheet',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: TOKEN,
        },
        body: JSON.stringify({
          trackingNumbers,
          pickupAddress: PICKUP_ADDRESS,
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'PostEx returned error' }, { status: res.status });
    }

    const pdfBuffer = await res.arrayBuffer();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="load-sheet.pdf"',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
