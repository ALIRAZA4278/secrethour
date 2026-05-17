import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const BASE = `
  <div style="font-family:'Georgia',serif;background:#09080700;padding:0;margin:0;">
  <div style="max-width:560px;margin:0 auto;background:#0b0a09;border:1px solid #3a2a1a;padding:48px 40px;">
    <div style="text-align:center;margin-bottom:32px;">
      <p style="color:#c9a96e;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px;">Secret Hour</p>
    </div>
`;
const FOOT = `
    <div style="border-top:1px solid #3a2a1a;margin-top:40px;padding-top:24px;text-align:center;">
      <p style="color:#5a4a3a;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0;">Discreet Packaging · No Brand Name Outside</p>
      <p style="color:#3a2a1a;font-size:10px;margin:8px 0 0;">secrethour.pk · info@secrethour.pk</p>
    </div>
  </div></div>
`;

export function orderConfirmationHtml({ name, orderId, items, total, payment, city, trackingNumber }) {
  const itemRows = items.map(i =>
    `<tr>
      <td style="color:#c9a96e;font-size:13px;padding:8px 0;border-bottom:1px solid #2a1a0a;">${i.title}</td>
      <td style="color:#a08060;font-size:13px;padding:8px 0;border-bottom:1px solid #2a1a0a;text-align:center;">x${i.qty}</td>
      <td style="color:#c9a96e;font-size:13px;padding:8px 0;border-bottom:1px solid #2a1a0a;text-align:right;">Rs. ${(i.numericPrice * i.qty).toLocaleString()}</td>
    </tr>`
  ).join('');

  return `${BASE}
    <h1 style="color:#c9a96e;font-size:26px;font-style:italic;text-align:center;margin:0 0 8px;">Order Confirmed</h1>
    <p style="color:#6a5a4a;font-size:11px;text-align:center;letter-spacing:3px;text-transform:uppercase;margin:0 0 32px;">Thank you for your order</p>

    <p style="color:#d4c4a8;font-size:14px;line-height:1.7;margin:0 0 24px;">
      Dear ${name},<br/>
      Your order has been received and is being prepared with care. We will reach out before dispatch.
    </p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <thead>
        <tr>
          <th style="color:#6a5a4a;font-size:10px;letter-spacing:3px;text-transform:uppercase;text-align:left;padding-bottom:8px;border-bottom:1px solid #3a2a1a;">Product</th>
          <th style="color:#6a5a4a;font-size:10px;letter-spacing:3px;text-transform:uppercase;text-align:center;padding-bottom:8px;border-bottom:1px solid #3a2a1a;">Qty</th>
          <th style="color:#6a5a4a;font-size:10px;letter-spacing:3px;text-transform:uppercase;text-align:right;padding-bottom:8px;border-bottom:1px solid #3a2a1a;">Price</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div style="background:#150e08;border:1px solid #3a2a1a;padding:16px 20px;margin-bottom:24px;">
      ${[
        ['Order ID', `#${String(orderId).slice(0, 8).toUpperCase()}`],
        ['City', city],
        ['Payment', payment === 'bank' ? 'Bank Transfer' : 'Cash on Delivery'],
        ['Total', `Rs. ${total.toLocaleString()}`],
        trackingNumber ? ['PostEx Tracking', trackingNumber] : null,
      ].filter(Boolean).map(([l, v]) =>
        `<div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="color:#6a5a4a;font-size:11px;letter-spacing:2px;text-transform:uppercase;">${l}</span>
          <span style="color:#c9a96e;font-size:13px;">${v}</span>
        </div>`
      ).join('')}
    </div>

    <p style="color:#8a7a6a;font-size:13px;font-style:italic;text-align:center;line-height:1.6;margin:0;">
      "Every great love story starts with intention."
    </p>
  ${FOOT}`;
}

export function statusUpdateHtml({ name, trackingNumber, status, orderDetail }) {
  const statusMessages = {
    'At Merchant Warehouse':    { msg: 'Your order is being packed at our warehouse.', color: '#8888ff' },
    'At PostEx Warehouse':      { msg: 'Your parcel is now at PostEx warehouse and will be dispatched soon.', color: '#88aaff' },
    'Out for Delivery':         { msg: 'Your order is on its way to you today!', color: '#88ddaa' },
    'Delivered':                { msg: 'Your order has been delivered. We hope you love it.', color: '#c9a96e' },
    'Returned':                 { msg: 'Your order has been returned. Please contact us if you have questions.', color: '#ff8888' },
    'Attempt Made':             { msg: 'A delivery attempt was made. PostEx will retry shortly.', color: '#ffaa88' },
    'Delivery Under Review':    { msg: 'Your delivery is currently under review by PostEx.', color: '#ffcc88' },
  };

  const { msg, color } = statusMessages[status] || { msg: `Your order status has been updated to: ${status}`, color: '#c9a96e' };

  return `${BASE}
    <h1 style="color:${color};font-size:24px;font-style:italic;text-align:center;margin:0 0 8px;">Delivery Update</h1>
    <p style="color:#6a5a4a;font-size:11px;text-align:center;letter-spacing:3px;text-transform:uppercase;margin:0 0 32px;">${status}</p>

    <p style="color:#d4c4a8;font-size:14px;line-height:1.7;margin:0 0 24px;">
      Dear ${name},<br/>${msg}
    </p>

    <div style="background:#150e08;border:1px solid #3a2a1a;padding:16px 20px;margin-bottom:24px;">
      ${trackingNumber ? `
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
        <span style="color:#6a5a4a;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Tracking</span>
        <span style="color:#c9a96e;font-size:13px;">${trackingNumber}</span>
      </div>` : ''}
      ${orderDetail ? `
      <div style="display:flex;justify-content:space-between;">
        <span style="color:#6a5a4a;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Order</span>
        <span style="color:#a08060;font-size:12px;">${orderDetail}</span>
      </div>` : ''}
    </div>

    <p style="color:#8a7a6a;font-size:13px;font-style:italic;text-align:center;line-height:1.6;margin:0;">
      Questions? Reach us on WhatsApp or at info@secrethour.pk
    </p>
  ${FOOT}`;
}

export async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Secret Hour <info@secrethour.pk>',
    to,
    subject,
    html,
  });
}
