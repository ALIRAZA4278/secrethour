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

const CITY_MAP = {
  'karachi': 'Karachi', 'khi': 'Karachi', 'krc': 'Karachi',
  'lahore': 'Lahore', 'lhr': 'Lahore',
  'islamabad': 'Islamabad', 'isb': 'Islamabad', 'isl': 'Islamabad',
  'rawalpindi': 'Rawalpindi', 'pindi': 'Rawalpindi', 'rwp': 'Rawalpindi',
  'faisalabad': 'Faisalabad', 'fsd': 'Faisalabad', 'lyallpur': 'Faisalabad',
  'multan': 'Multan', 'mtn': 'Multan',
  'hyderabad': 'Hyderabad', 'hyd': 'Hyderabad',
  'peshawar': 'Peshawar', 'pew': 'Peshawar',
  'quetta': 'Quetta', 'uet': 'Quetta',
  'gujranwala': 'Gujranwala', 'grw': 'Gujranwala',
  'sialkot': 'Sialkot', 'skt': 'Sialkot',
  'sargodha': 'Sargodha', 'sgd': 'Sargodha',
  'bahawalpur': 'Bahawalpur', 'bwp': 'Bahawalpur',
  'sukkur': 'Sukkur', 'skz': 'Sukkur',
  'larkana': 'Larkana',
  'sheikhupura': 'Sheikhupura',
  'rahim yar khan': 'Rahim Yar Khan', 'rahimyarkhan': 'Rahim Yar Khan', 'ryk': 'Rahim Yar Khan',
  'jhang': 'Jhang',
  'dera ghazi khan': 'Dera Ghazi Khan', 'deraghazikhan': 'Dera Ghazi Khan', 'dgk': 'Dera Ghazi Khan',
  'gujrat': 'Gujrat',
  'mardan': 'Mardan',
  'kasur': 'Kasur',
  'sahiwal': 'Sahiwal',
  'okara': 'Okara',
  'wah cantt': 'Wah Cantt', 'wah': 'Wah Cantt', 'wahcantt': 'Wah Cantt',
  'abbottabad': 'Abbottabad',
  'mirpur': 'Mirpur',
  'chiniot': 'Chiniot',
  'hafizabad': 'Hafizabad',
  'narowal': 'Narowal',
  'vehari': 'Vehari',
  'bahawalnagar': 'Bahawalnagar',
  'khushab': 'Khushab',
  'chakwal': 'Chakwal',
  'kohat': 'Kohat',
  'attock': 'Attock',
  'mianwali': 'Mianwali',
  'muzaffargarh': 'Muzaffargarh',
  'khanewal': 'Khanewal',
  'pakpattan': 'Pakpattan',
  'toba tek singh': 'Toba Tek Singh', 'tobateksingh': 'Toba Tek Singh', 'tts': 'Toba Tek Singh',
  'lodhran': 'Lodhran',
  'mingora': 'Mingora',
  'nawabshah': 'Nawabshah',
  'mirpur khas': 'Mirpur Khas',
};

function normalizeCity(city) {
  if (!city) return city;
  const key = city.trim().toLowerCase().replace(/\s+/g, ' ');
  return CITY_MAP[key] || city.trim();
}

export async function POST(req) {
  try {
    const body = await req.json();

    const payload = {
      orderRefNumber: body.orderRefNumber,
      invoicePayment: String(body.invoicePayment),
      orderDetail: body.orderDetail || '',
      customerName: body.customerName,
      customerPhone: normalizePhone(body.customerPhone),
      deliveryAddress: body.deliveryAddress,
      cityName: normalizeCity(body.cityName),
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
