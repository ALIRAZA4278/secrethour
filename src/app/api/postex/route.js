import { NextResponse } from 'next/server';

const POSTEX_URL = 'https://api.postex.pk/services/integration/api/order/v3/create-order';
const TOKEN = process.env.POSTEX_API_TOKEN;
const PICKUP_CODE = process.env.POSTEX_PICKUP_CODE || '001';

function normalizePhone(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length === 12) return '0' + digits.slice(2);
  if (digits.startsWith('3') && digits.length === 10) return '0' + digits;
  return digits.slice(0, 11);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const payload = {
      orderRefNumber: body.orderRefNumber,
      invoicePayment: body.invoicePayment,
      orderDetail: body.orderDetail || '',
      customerName: body.customerName,
      customerPhone: normalizePhone(body.customerPhone),
      deliveryAddress: body.deliveryAddress,
      cityName: body.cityName,
      invoiceDivision: 1,
      items: body.items || 1,
      orderType: 'Normal',
      transactionNotes: body.transactionNotes || '',
      pickupAddressCode: PICKUP_CODE,
    };

    const res = await fetch(POSTEX_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.statusCode === '200' && data.dist?.trackingNumber) {
      return NextResponse.json({ trackingNumber: data.dist.trackingNumber });
    }

    return NextResponse.json(
      { error: data.statusMessage || 'PostEx order creation failed' },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
