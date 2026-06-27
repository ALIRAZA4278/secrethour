import { NextResponse } from 'next/server';

const INSTAWORLD_API = 'https://one-be.instaworld.pk/logistics/v1';
const INSTAWORLD_KEY = process.env.INSTAWORLD_API_KEY || '';

export async function POST(req) {
  try {
    const { action, data } = await req.json();

    if (action === 'createShipment') {
      const res = await fetch(`${INSTAWORLD_API}/createShipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: INSTAWORLD_KEY,
          ...data,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to create shipment');
      return NextResponse.json(result);
    }

    if (action === 'cancelShipment') {
      const res = await fetch(`${INSTAWORLD_API}/cancelShipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: INSTAWORLD_KEY,
          tracking_number: data.tracking_number,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to cancel shipment');
      return NextResponse.json(result);
    }

    if (action === 'trackShipment') {
      const res = await fetch(`${INSTAWORLD_API}/trackShipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: INSTAWORLD_KEY,
          tracking_number: data.tracking_number,
        }),
      });
      const result = await res.json();
      return NextResponse.json(result);
    }

    if (action === 'cities') {
      const res = await fetch('https://one-be.instaworld.pk/logistics/cities');
      const result = await res.json();
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Insta World API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
