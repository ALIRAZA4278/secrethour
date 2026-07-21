import nodemailer from 'nodemailer';

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export function orderConfirmationHtml({ name, orderId, items = [], total, payment, city, trackingNumber }) {
  const itemRows = items.map(i =>
    `<tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;color:#2c1a0e;font-size:14px;">${i.title}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;color:#6b4c2a;font-size:14px;text-align:center;">x${i.qty}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;color:#2c1a0e;font-size:14px;text-align:right;">Rs. ${((i.numericPrice || 0) * (i.qty || 1)).toLocaleString()}</td>
    </tr>`
  ).join('');

  const paymentLabel = payment === 'bank' ? 'Bank Transfer' : 'Cash on Delivery';

  const details = [
    ['Order ID', `#${String(orderId).slice(0, 8).toUpperCase()}`],
    ['Customer', name],
    ['City', city],
    ['Payment', paymentLabel],
    ['Total', `Rs. ${(total || 0).toLocaleString()}`],
    trackingNumber ? ['PostEx Tracking', trackingNumber] : null,
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e8ddd0;max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#1a0a04;padding:32px 40px;text-align:center;">
            <p style="color:#c9a96e;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:0 0 6px;">Secret Hour</p>
            <h1 style="color:#c9a96e;font-size:24px;font-style:italic;margin:0;">Order Confirmed</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            <p style="color:#2c1a0e;font-size:15px;line-height:1.7;margin:0 0 24px;">
              Dear <strong>${name}</strong>,<br>
              Your order has been received and is being prepared with care. We'll reach out before dispatch.
            </p>

            <!-- Items table -->
            ${items.length > 0 ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <thead>
                <tr style="background:#f7f4ef;">
                  <th style="padding:10px 12px;text-align:left;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b4c2a;font-weight:600;">Product</th>
                  <th style="padding:10px 12px;text-align:center;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b4c2a;font-weight:600;">Qty</th>
                  <th style="padding:10px 12px;text-align:right;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b4c2a;font-weight:600;">Price</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>` : ''}

            <!-- Order details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;border:1px solid #e8ddd0;margin-bottom:24px;">
              ${details.map(([l, v]) => `
              <tr>
                <td style="padding:10px 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6a4a;width:40%;">${l}</td>
                <td style="padding:10px 16px;font-size:14px;color:#1a0a04;text-align:right;font-weight:${l === 'Total' ? '700' : '400'};">${v}</td>
              </tr>`).join('')}
            </table>

            <p style="color:#6b4c2a;font-size:13px;font-style:italic;text-align:center;line-height:1.6;margin:0;">
              "Every great love story starts with intention."
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f7f4ef;padding:20px 40px;text-align:center;border-top:1px solid #e8ddd0;">
            <p style="color:#8a6a4a;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Discreet Packaging · No Brand Name Outside</p>
            <p style="color:#a08060;font-size:11px;margin:0;">secrethour.pk · info@secrethour.pk</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function statusUpdateHtml({ name, trackingNumber, status, orderDetail }) {
  const statusConfig = {
    'At Merchant Warehouse':  { emoji: '📦', msg: 'Your order is being packed at our warehouse.' },
    'At PostEx Warehouse':    { emoji: '🏭', msg: 'Your parcel is at PostEx warehouse and will be dispatched soon.' },
    'Out for Delivery':       { emoji: '🚚', msg: 'Great news — your order is out for delivery today!' },
    'Delivered':              { emoji: '✅', msg: 'Your order has been delivered. We hope you love every moment.' },
    'Returned':               { emoji: '↩️', msg: 'Your order has been returned. Please contact us if you have any questions.' },
    'Attempt Made':           { emoji: '🔔', msg: 'A delivery attempt was made. PostEx will retry shortly.' },
    'Delivery Under Review':  { emoji: '🔍', msg: 'Your delivery is currently under review by PostEx.' },
  };

  const { emoji = '📬', msg = `Your order status: ${status}` } = statusConfig[status] || {};

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e8ddd0;max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#1a0a04;padding:32px 40px;text-align:center;">
            <p style="color:#c9a96e;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:0 0 6px;">Secret Hour</p>
            <h1 style="color:#c9a96e;font-size:22px;font-style:italic;margin:0;">Delivery Update</h1>
            <p style="color:#c9a96e;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:8px 0 0;opacity:0.8;">${status}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;text-align:center;">
            <p style="font-size:40px;margin:0 0 16px;">${emoji}</p>
            <p style="color:#2c1a0e;font-size:15px;line-height:1.7;margin:0 0 24px;text-align:left;">
              Dear <strong>${name}</strong>,<br>${msg}
            </p>

            ${trackingNumber ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;border:1px solid #e8ddd0;margin-bottom:24px;">
              <tr>
                <td style="padding:12px 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6a4a;">Tracking Number</td>
                <td style="padding:12px 16px;font-size:15px;color:#1a0a04;text-align:right;font-family:monospace;font-weight:700;">${trackingNumber}</td>
              </tr>
              ${orderDetail ? `<tr>
                <td style="padding:12px 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6a4a;">Order</td>
                <td style="padding:12px 16px;font-size:13px;color:#4a3020;text-align:right;">${orderDetail}</td>
              </tr>` : ''}
            </table>` : ''}

            <p style="color:#6b4c2a;font-size:13px;font-style:italic;text-align:center;line-height:1.6;margin:0;">
              Questions? Reach us on WhatsApp or at info@secrethour.pk
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f7f4ef;padding:20px 40px;text-align:center;border-top:1px solid #e8ddd0;">
            <p style="color:#8a6a4a;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Discreet Packaging · No Brand Name Outside</p>
            <p style="color:#a08060;font-size:11px;margin:0;">secrethour.pk · info@secrethour.pk</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function adminOrderNotificationHtml({ name, phone, city, address, orderId, items = [], total, payment }) {
  const paymentLabel = payment === 'bank' ? 'Bank Transfer' : 'Cash on Delivery';
  const itemRows = items.map(i =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e8ddd0;font-size:13px;color:#2c1a0e;">
        ${i.title}${i.variation ? ` <span style="color:#8a6a4a;font-size:11px;">(${i.variation})</span>` : ''}
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #e8ddd0;font-size:13px;color:#6b4c2a;text-align:center;">x${i.qty}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e8ddd0;font-size:13px;color:#2c1a0e;text-align:right;">Rs. ${((i.numericPrice || 0) * (i.qty || 1)).toLocaleString()}</td>
    </tr>`
  ).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:24px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e8ddd0;max-width:560px;width:100%;">

        <tr>
          <td style="background:#1a0a04;padding:24px 32px;text-align:center;">
            <p style="color:#c9a96e;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:0 0 4px;">Secret Hour — Admin</p>
            <h1 style="color:#ffffff;font-size:20px;font-style:italic;margin:0;">🛒 New Order Received</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;border:1px solid #e8ddd0;margin-bottom:20px;">
              ${[
                ['Order ID', `#${String(orderId).slice(0, 8).toUpperCase()}`],
                ['Customer', name],
                ['Phone', phone],
                ['City', city],
                ['Address', address],
                ['Payment', paymentLabel],
                ['Total', `Rs. ${(total || 0).toLocaleString()}`],
              ].map(([l, v]) => `
              <tr>
                <td style="padding:9px 14px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6a4a;width:35%;border-bottom:1px solid #e8ddd0;">${l}</td>
                <td style="padding:9px 14px;font-size:13px;color:#1a0a04;text-align:right;border-bottom:1px solid #e8ddd0;font-weight:${l === 'Total' ? '700' : '400'};">${v}</td>
              </tr>`).join('')}
            </table>

            ${items.length > 0 ? `
            <table width="100%" cellpadding="0" cellspacing="0">
              <thead>
                <tr style="background:#f7f4ef;">
                  <th style="padding:8px 12px;text-align:left;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b4c2a;">Product</th>
                  <th style="padding:8px 12px;text-align:center;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b4c2a;">Qty</th>
                  <th style="padding:8px 12px;text-align:right;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b4c2a;">Price</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>` : ''}
          </td>
        </tr>

        <tr>
          <td style="background:#f7f4ef;padding:16px 32px;text-align:center;border-top:1px solid #e8ddd0;">
            <p style="color:#8a6a4a;font-size:11px;margin:0;">secrethour.pk admin notification</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function orderStatusHtml({ name, orderId, status, items = [], total }) {
  const statusConfig = {
    confirmed: { label: 'Order Confirmed',   msg: 'Great news! Your order has been confirmed and is being prepared with care.' },
    shipped:   { label: 'Order Shipped',     msg: 'Your order has been shipped and is on its way to you. Expected delivery in 2-3 business days.' },
    delivered: { label: 'Order Delivered',   msg: 'Your order has been delivered. We hope you love every moment of it.' },
    cancelled: { label: 'Order Cancelled',   msg: 'Your order has been cancelled. Please contact us if you have any questions.' },
    returned:  { label: 'Order Returned',    msg: 'Your order has been returned. Please contact us if you have any questions.' },
    pending:   { label: 'Order Received',    msg: 'We have received your order and will confirm it shortly.' },
  };
  const { label, msg } = statusConfig[status] || { label: `Order ${status}`, msg: `Your order status has been updated to ${status}.` };

  const itemRows = items.map(i =>
    `<tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;color:#2c1a0e;font-size:14px;">${i.product_title || i.title || ''}${i.variation ? ` <span style="color:#8a6a4a;font-size:12px;">(${i.variation})</span>` : ''}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;color:#6b4c2a;font-size:14px;text-align:center;">x${i.quantity || i.qty || 1}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;color:#2c1a0e;font-size:14px;text-align:right;">Rs. ${((i.price || i.numericPrice || 0) * (i.quantity || i.qty || 1)).toLocaleString()}</td>
    </tr>`
  ).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e8ddd0;max-width:560px;width:100%;">

        <tr>
          <td style="background:#1a0a04;padding:32px 40px;text-align:center;">
            <p style="color:#c9a96e;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:0 0 6px;">Secret Hour</p>
            <h1 style="color:#c9a96e;font-size:24px;font-style:italic;margin:0;">${label}</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 40px;">
            <p style="color:#2c1a0e;font-size:15px;line-height:1.7;margin:0 0 24px;">
              Dear <strong>${name}</strong>,<br>${msg}
            </p>

            ${items.length > 0 ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <thead>
                <tr style="background:#f7f4ef;">
                  <th style="padding:10px 12px;text-align:left;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b4c2a;font-weight:600;">Product</th>
                  <th style="padding:10px 12px;text-align:center;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b4c2a;font-weight:600;">Qty</th>
                  <th style="padding:10px 12px;text-align:right;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b4c2a;font-weight:600;">Price</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>` : ''}

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;border:1px solid #e8ddd0;margin-bottom:24px;">
              <tr>
                <td style="padding:10px 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6a4a;width:40%;">Order ID</td>
                <td style="padding:10px 16px;font-size:14px;color:#1a0a04;text-align:right;">#${String(orderId).slice(0, 8).toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6a4a;">Total</td>
                <td style="padding:10px 16px;font-size:14px;color:#1a0a04;text-align:right;font-weight:700;">Rs. ${(total || 0).toLocaleString()}</td>
              </tr>
            </table>

            <p style="color:#6b4c2a;font-size:13px;font-style:italic;text-align:center;line-height:1.6;margin:0;">
              Questions? Reach us on WhatsApp or at info@secrethour.pk
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#f7f4ef;padding:20px 40px;text-align:center;border-top:1px solid #e8ddd0;">
            <p style="color:#8a6a4a;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Discreet Packaging · No Brand Name Outside</p>
            <p style="color:#a08060;font-size:11px;margin:0;">secrethour.pk · info@secrethour.pk</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function abandonedCartHtml({ name, items = [], total, promoCode = 'MIDNIGHTHOUR', discountPct = 10 }) {
  const itemRows = items.map(i =>
    `<tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;color:#2c1a0e;font-size:14px;">${i.title}${i.variation ? `<br><span style="color:#a08060;font-size:12px;">${i.variation}</span>` : ''}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;color:#6b4c2a;font-size:14px;text-align:center;">x${i.qty || 1}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;color:#2c1a0e;font-size:14px;text-align:right;">Rs. ${((i.price || 0) * (i.qty || 1)).toLocaleString()}</td>
    </tr>`
  ).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e8ddd0;max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#1a0a04;padding:32px 40px;text-align:center;">
            <p style="color:#c9a96e;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:0 0 6px;">Secret Hour</p>
            <h1 style="color:#c9a96e;font-size:23px;font-style:italic;margin:0;">You left something unforgettable behind… ❤️</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            <p style="color:#2c1a0e;font-size:15px;line-height:1.7;margin:0 0 8px;">
              Hi <strong>${name || 'there'}</strong>,
            </p>
            <p style="color:#2c1a0e;font-size:15px;line-height:1.7;margin:0 0 24px;">
              Looks like you left something special in your cart.
            </p>

            ${items.length > 0 ? `
            <p style="color:#6b4c2a;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Your Cart</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tbody>${itemRows}</tbody>
            </table>` : ''}

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;border:1px solid #e8ddd0;margin-bottom:24px;">
              <tr>
                <td style="padding:12px 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6a4a;">Total</td>
                <td style="padding:12px 16px;font-size:16px;color:#1a0a04;text-align:right;font-weight:700;">Rs. ${(total || 0).toLocaleString()}</td>
              </tr>
            </table>

            <p style="color:#2c1a0e;font-size:14px;line-height:1.7;margin:0 0 24px;">
              At <strong>Secret Hour</strong>, we create thoughtful experiences that help couples reconnect,
              create meaningful moments, and make ordinary nights feel extraordinary.
            </p>

            <!-- Promo -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a0a04;margin-bottom:24px;">
              <tr>
                <td style="padding:22px 20px;text-align:center;">
                  <p style="color:#e8ddd0;font-size:14px;margin:0 0 10px;">
                    Complete your order today and enjoy <strong style="color:#c9a96e;">${discountPct}% OFF</strong> with the code:
                  </p>
                  <p style="color:#c9a96e;font-size:22px;letter-spacing:5px;font-weight:700;margin:0;">${promoCode}</p>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td align="center">
                  <a href="https://www.secrethour.pk/shop"
                     style="display:inline-block;background:#5a1a24;border:1px solid #c9a96e;color:#e8c98a;font-size:12px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:16px 40px;">
                    Complete Your Order
                  </a>
                </td>
              </tr>
            </table>

            <p style="color:#6b4c2a;font-size:13px;line-height:1.6;margin:0 0 20px;text-align:center;">
              If you have any questions, simply reply to this email — we're always happy to help.
            </p>

            <p style="color:#2c1a0e;font-size:14px;line-height:1.7;margin:0;">
              Warm regards,<br>
              <strong>Team Secret Hour</strong><br>
              <span style="color:#8a6a4a;font-size:13px;font-style:italic;">Creating unforgettable moments for couples.</span>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f7f4ef;padding:20px 40px;text-align:center;border-top:1px solid #e8ddd0;">
            <p style="color:#8a6a4a;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Discreet Packaging · No Brand Name Outside</p>
            <p style="color:#a08060;font-size:11px;margin:0;">secrethour.pk · info@secrethour.pk</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendEmail({ to, subject, html }) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Secret Hour <secrethour.pk@gmail.com>',
    to,
    subject,
    html,
  });
}
