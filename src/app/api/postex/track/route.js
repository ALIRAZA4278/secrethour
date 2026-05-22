import { NextResponse } from 'next/server';

const TOKEN = process.env.POSTEX_API_TOKEN;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tracking = searchParams.get('tracking');

    if (!tracking) {
      return NextResponse.json({ error: 'tracking query param required' }, { status: 400 });
    }

    const res = await fetch(
      `https://api.postex.pk/services/integration/api/order/v1/track-order/${tracking}`,
      {
        headers: { token: TOKEN },
      }
    );

    const data = await res.json();
    const dist = data.dist || data;
    // Normalise history — PostEx may nest it differently
    const history = dist.transactionStatusHistory || dist.statusHistory || [];
    return NextResponse.json({ ...dist, transactionStatusHistory: history });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
