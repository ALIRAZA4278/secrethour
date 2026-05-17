import nodemailer from 'nodemailer';

// Inline the template to test without Next.js env
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', port: 587, secure: false,
  auth: { user: 'secrethour.pk@gmail.com', pass: 'bbqjdvffqhkalhjr' },
});

const items = [
  { title: 'The Midnight Deck', qty: 1, numericPrice: 3499 },
  { title: 'The Secret Hour Bridal Box', qty: 1, numericPrice: 8999 },
];

const itemRows = items.map(i =>
  `<tr>
    <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;color:#2c1a0e;font-size:14px;">${i.title}</td>
    <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;color:#6b4c2a;font-size:14px;text-align:center;">x${i.qty}</td>
    <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;color:#2c1a0e;font-size:14px;text-align:right;">Rs. ${(i.numericPrice * i.qty).toLocaleString()}</td>
  </tr>`
).join('');

const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f7f4ef;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:32px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e8ddd0;max-width:560px;width:100%;">
<tr><td style="background:#1a0a04;padding:32px 40px;text-align:center;">
  <p style="color:#c9a96e;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:0 0 6px;">Secret Hour</p>
  <h1 style="color:#c9a96e;font-size:24px;font-style:italic;margin:0;">Order Confirmed</h1>
</td></tr>
<tr><td style="padding:32px 40px;">
  <p style="color:#2c1a0e;font-size:15px;line-height:1.7;margin:0 0 24px;">Dear <strong>ALI Raza</strong>,<br>Your order has been received and is being prepared with care.</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <thead><tr style="background:#f7f4ef;">
      <th style="padding:10px 12px;text-align:left;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b4c2a;">Product</th>
      <th style="padding:10px 12px;text-align:center;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b4c2a;">Qty</th>
      <th style="padding:10px 12px;text-align:right;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b4c2a;">Price</th>
    </tr></thead>
    <tbody>${itemRows}</tbody>
  </table>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;border:1px solid #e8ddd0;margin-bottom:24px;">
    <tr><td style="padding:10px 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6a4a;width:40%;">Order ID</td><td style="padding:10px 16px;font-size:14px;color:#1a0a04;text-align:right;">#ABC12345</td></tr>
    <tr><td style="padding:10px 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6a4a;">City</td><td style="padding:10px 16px;font-size:14px;color:#1a0a04;text-align:right;">Lahore</td></tr>
    <tr><td style="padding:10px 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6a4a;">Payment</td><td style="padding:10px 16px;font-size:14px;color:#1a0a04;text-align:right;">Cash on Delivery</td></tr>
    <tr><td style="padding:10px 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6a4a;">Total</td><td style="padding:10px 16px;font-size:14px;color:#1a0a04;text-align:right;font-weight:700;">Rs. 12,498</td></tr>
    <tr><td style="padding:10px 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6a4a;">PostEx Tracking</td><td style="padding:10px 16px;font-size:14px;color:#1a0a04;text-align:right;font-family:monospace;">28628390000001</td></tr>
  </table>
</td></tr>
<tr><td style="background:#f7f4ef;padding:20px 40px;text-align:center;border-top:1px solid #e8ddd0;">
  <p style="color:#8a6a4a;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0;">Discreet Packaging · No Brand Name Outside</p>
</td></tr>
</table></td></tr></table></body></html>`;

const info = await transporter.sendMail({
  from: 'Secret Hour <secrethour.pk@gmail.com>',
  to: 'ali.activecalculator@gmail.com',
  subject: 'Your Secret Hour Order is Confirmed — Test',
  html,
});
console.log('✅ Email sent:', info.messageId);
