import { NextResponse } from 'next/server';

const TOKEN = process.env.POSTEX_API_TOKEN;

// PUT — Save Shipper Advice (3.11)
// statusId: 1 = Mark Return Requested, 2 = Mark Retry Attempt
export async function PUT(req) {
  try {
    const { trackingNumber, statusId, remarks } = await req.json();

    if (!trackingNumber || !statusId) {
      return NextResponse.json({ error: 'trackingNumber and statusId required' }, { status: 400 });
    }

    const res = await fetch(
      'https://api.postex.pk/service/integration/api/order/v2/save-shipper-advice',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: TOKEN,
        },
        body: JSON.stringify({ trackingNumber, statusId, remarks: remarks || '' }),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
