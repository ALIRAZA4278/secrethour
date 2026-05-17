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
      `https://api.postex.pk/services/integration/api/order/v1/getinvoice?trackingNumbers=${tracking}`,
      {
        headers: { token: TOKEN },
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
        'Content-Disposition': `inline; filename="airway-bill-${tracking}.pdf"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
