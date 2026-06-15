'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const ADMIN_PASS  = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

function orderNum(id) {
  let h = 0;
  for (const c of (id || '').replace(/-/g, '')) h = ((h << 5) - h + parseInt(c, 16)) | 0;
  return `SH-${Math.abs(h % 9000) + 1000}`;
}

function exportCSV(orders) {
  const rows = [
    ['Order#', 'Name', 'WhatsApp', 'Email', 'City', 'Payment', 'Total', 'Status', 'Date', 'Notes'],
    ...orders.map(o => [
      orderNum(o.id),
      `${o.first_name || ''} ${o.last_name || ''}`.trim(),
      o.phone || '', o.email || '', o.city || '',
      o.payment_method || 'cod',
      o.total || 0,
      o.status || 'pending',
      new Date(o.created_at).toLocaleString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      o.notes || '',
    ]),
  ];
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'secret-hour-orders.csv'; a.click();
  URL.revokeObjectURL(url);
}

function fmtItems(items, total) {
  if (!items?.length) return '';
  const lines = items.map(i =>
    `• ${i.product_title}${i.variation ? ` (${i.variation})` : ''} x${i.quantity} — Rs. ${((i.price || 0) * (i.quantity || 1)).toLocaleString()}`
  ).join('\n');
  return `\n\n*Order Details:*\n${lines}\n\n*Total: Rs. ${(total || 0).toLocaleString()}*`;
}

const WA_MSG = {
  pending:          (name, num, items, total) => `Assalam o Alaikum ${name}!\n\nWe have received your Secret Hour order *${num}*. We will confirm it shortly.${fmtItems(items, total)}\n\nThank you!\nSecretHour.pk`,
  confirmed:        (name, num, items, total) => `Assalam o Alaikum ${name}!\n\nGreat news! Your Secret Hour order *${num}* has been confirmed. We are preparing your package.${fmtItems(items, total)}\n\nThank you!\nSecretHour.pk`,
  shipped:          (name, num, items, total) => `Assalam o Alaikum ${name}!\n\nYour Secret Hour order *${num}* has been shipped! You will receive it within 2-3 business days.${fmtItems(items, total)}\n\nFor tracking, feel free to contact us.\n\nThank you!\nSecretHour.pk`,
  out_for_delivery: (name, num, items, total) => `Assalam o Alaikum ${name}!\n\nYour Secret Hour order *${num}* is out for delivery today! Our courier is on the way to you.${fmtItems(items, total)}\n\nPlease keep your phone available.\n\nThank you!\nSecretHour.pk`,
  delivered:        (name, num, items, total) => `Assalam o Alaikum ${name}!\n\nYour Secret Hour order *${num}* has been delivered! We hope you love it.${fmtItems(items, total)}\n\nWe would love to hear your feedback!\n\nThank you!\nSecretHour.pk`,
  cancelled:        (name, num, items, total) => `Assalam o Alaikum ${name}!\n\nUnfortunately, your Secret Hour order *${num}* has been cancelled. Please contact us if you have any questions.${fmtItems(items, total)}\n\nThank you!\nSecretHour.pk`,
  attempt:          (name, num, items, total) => `Assalam o Alaikum ${name}!\n\nWe attempted delivery of your Secret Hour order *${num}* but were unable to reach you.${fmtItems(items, total)}\n\nPlease contact us to reschedule.\n\nThank you!\nSecretHour.pk`,
};

function sendWhatsApp(order, status, items, total) {
  const raw   = (order.phone || '').replace(/\D/g, '');
  const phone = raw.startsWith('92') ? raw : raw.startsWith('0') ? '92' + raw.slice(1) : '92' + raw;
  const name  = `${order.first_name || ''} ${order.last_name || ''}`.trim();
  const num   = orderNum(order.id);
  const text  = WA_MSG[status]?.(name, num, items, total) || '';
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
}

const STATUS = {
  pending:          { label: 'Pending',          cls: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
  confirmed:        { label: 'Confirmed',        cls: 'bg-blue-50   text-blue-700   border-blue-300'   },
  shipped:          { label: 'Shipped',          cls: 'bg-purple-50 text-purple-700 border-purple-300' },
  out_for_delivery: { label: 'Out for Delivery', cls: 'bg-teal-50   text-teal-700   border-teal-300'   },
  delivered:        { label: 'Delivered',        cls: 'bg-green-50  text-green-700  border-green-300'  },
  cancelled:        { label: 'Cancelled',        cls: 'bg-red-50    text-red-700    border-red-300'    },
  returned:         { label: 'Returned',         cls: 'bg-orange-50 text-orange-700 border-orange-300' },
  attempt:          { label: 'Attempt',          cls: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
};

const STATUSES = ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'attempt', 'delivered', 'cancelled', 'returned'];

const INP = 'w-full px-3.5 py-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-100 transition placeholder:text-gray-400';
const LBL = 'block text-xs uppercase tracking-[0.18em] text-gray-500 font-medium mb-1.5';

/* ═══════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════ */
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [show,  setShow]  = useState(false);
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    if (email.trim() === ADMIN_EMAIL && pass === ADMIN_PASS) {
      sessionStorage.setItem('sh_admin', 'true');
      onLogin();
    } else {
      setError('Incorrect email or password.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8 space-y-2">
          <p className="text-gray-400 text-xs uppercase tracking-[0.35em]">Secret Hour</p>
          <h1 className="text-3xl italic text-gray-900" style={serif}>Admin Panel</h1>
          <p className="text-gray-500 text-sm">Sign in to manage your store</p>
        </div>
        <form onSubmit={submit} className="space-y-5 border border-gray-200 p-8 bg-white rounded-2xl shadow-sm">
          <div>
            <label className={LBL}>Email</label>
            <input type="email" value={email} autoFocus required
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="admin@email" className={INP} />
          </div>
          <div>
            <label className={LBL}>Password</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={pass} required
                onChange={e => { setPass(e.target.value); setError(''); }}
                placeholder="••••••••••" className={`${INP} pr-10`} />
              <button type="button" onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d={show
                      ? 'M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
                      : 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'} />
                </svg>
              </button>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>}
          <button type="submit"
            className="w-full bg-gray-900 text-white font-semibold text-xs uppercase tracking-[0.2em] py-3.5 rounded-lg hover:bg-black transition-all mt-2">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ORDER DRAWER
═══════════════════════════════════════════ */
function OrderDrawer({ order, items, onClose, onStatusChange, onDelete, onCustomerFilter }) {
  const [status,        setStatus]        = useState(order?.status || 'pending');
  const [custOrders,    setCustOrders]    = useState([]);
  const [custLoading,   setCustLoading]   = useState(false);
  const [postexInfo,    setPostexInfo]    = useState(null);
  const [postexLoading, setPostexLoading] = useState('');
  const [events,        setEvents]        = useState([]);
  const [newComment,    setNewComment]    = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [editing,       setEditing]       = useState(false);
  const [editForm,      setEditForm]      = useState({
    full_name:      `${order?.first_name || ''} ${order?.last_name || ''}`.trim(),
    phone:          order?.phone           || '',
    email:          order?.email           || '',
    address:        order?.address         || '',
    city:           order?.city            || '',
    payment_method: order?.payment_method  || 'cod',
  });
  const [savingOrder,   setSavingOrder]   = useState(false);
  const [bookingPostex, setBookingPostex] = useState(false);

  async function loadEvents() {
    const { data } = await supabase
      .from('order_events')
      .select('*')
      .eq('order_id', order.id)
      .order('created_at', { ascending: true });
    setEvents(data || []);
  }

  useEffect(() => {
    setStatus(order?.status || 'pending');
    setNewComment('');
    setEditing(false);
    setEditForm({
      full_name:      `${order?.first_name || ''} ${order?.last_name || ''}`.trim(),
      phone:          order?.phone           || '',
      email:          order?.email           || '',
      address:        order?.address         || '',
      city:           order?.city            || '',
      payment_method: order?.payment_method  || 'cod',
    });
    if (!order) return;
    loadEvents();
    setCustLoading(true);
    const key = order.phone || order.email;
    if (!key) { setCustLoading(false); return; }
    const query = order.phone
      ? supabase.from('orders').select('id, total, status, created_at').eq('phone', order.phone).order('created_at', { ascending: false })
      : supabase.from('orders').select('id, total, status, created_at').eq('email', order.email).order('created_at', { ascending: false });
    query.then(({ data }) => { setCustOrders(data || []); setCustLoading(false); });
  }, [order]);

  async function changeStatus(s) {
    setStatus(s);
    await supabase.from('orders').update({ status: s }).eq('id', order.id);
    await supabase.from('order_events').insert({
      order_id: order.id,
      type: 'status_change',
      content: `Status changed to ${STATUS[s]?.label || s}`,
    });
    onStatusChange(order.id, s);
    loadEvents();

    if (order.email) {
      const name = `${order.first_name || ''} ${order.last_name || ''}`.trim();
      fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'status_update',
          to: order.email,
          name,
          orderId: order.id,
          status: s,
          items,
          total: order.total,
        }),
      }).catch(() => {});
    }
  }

  async function addComment() {
    const text = newComment.trim();
    if (!text) return;
    setAddingComment(true);
    await supabase.from('order_events').insert({
      order_id: order.id,
      type: 'comment',
      content: text,
    });
    setNewComment('');
    setAddingComment(false);
    loadEvents();
  }

  async function saveOrder() {
    setSavingOrder(true);
    const nameParts = (editForm.full_name || '').trim().split(/\s+/);
    await supabase.from('orders').update({
      first_name:     nameParts[0] || '',
      last_name:      nameParts.slice(1).join(' ') || '',
      phone:          editForm.phone,
      email:          editForm.email,
      address:        editForm.address,
      city:           editForm.city,
      payment_method: editForm.payment_method,
    }).eq('id', order.id);
    await supabase.from('order_events').insert({
      order_id: order.id,
      type: 'comment',
      content: 'Order details updated by admin',
    });
    setSavingOrder(false);
    setEditing(false);
    loadEvents();
  }

  async function bookOnPostEx() {
    setBookingPostex(true);
    try {
      const customerName = (editForm.full_name || '').trim();
      const totalItems   = items?.reduce((s, i) => s + i.quantity, 0) || 1;
      const orderDetail  = items?.map(i => `${i.product_title}${i.variation ? ` (${i.variation})` : ''} x${i.quantity}`).join(', ') || '';
      const res  = await fetch('/api/postex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRefNumber:  order.id,
          invoicePayment:  order.total,
          orderDetail,
          customerName,
          customerPhone:   editForm.phone,
          deliveryAddress: editForm.address,
          cityName:        editForm.city,
          items:           totalItems,
        }),
      });
      const data = await res.json();
      if (data.trackingNumber) {
        await supabase.from('orders').update({ postex_tracking: data.trackingNumber }).eq('id', order.id);
        await supabase.from('order_events').insert({
          order_id: order.id,
          type: 'status_change',
          content: `Booked on PostEx — Tracking: ${data.trackingNumber}`,
        });
        onStatusChange(order.id, { postex_tracking: data.trackingNumber });
        loadEvents();
        setPostexInfo({ type: 'track', data: { transactionStatus: `Booked — ${data.trackingNumber}` } });
      } else {
        setPostexInfo({ type: 'track', error: data.message || JSON.stringify(data) });
      }
    } catch (err) {
      setPostexInfo({ type: 'track', error: err.message });
    }
    setBookingPostex(false);
  }

  async function deleteOrder() {
    if (!window.confirm(`Delete order ${orderNum(order.id)}? This cannot be undone.`)) return;
    await supabase.from('orders').delete().eq('id', order.id);
    onDelete?.(order.id);
    onClose();
  }

  async function trackOrder() {
    if (!order.postex_tracking) return;
    setPostexLoading('track');
    setPostexInfo(null);
    try {
      const res = await fetch(`/api/postex/track?tracking=${order.postex_tracking}`);
      const data = await res.json();
      setPostexInfo({ type: 'track', data });

      // Save live status back to DB — API returns transactionStatus (3.8 spec)
      const liveStatus = data?.transactionStatus || data?.transactionStatusMessage || data?.orderStatus;
      if (liveStatus) {
        const isDelivered = liveStatus.toLowerCase().includes('delivered');
        const isReturned  = liveStatus.toLowerCase().includes('returned');
        const updatePatch = {
          postex_status:     liveStatus,
          postex_updated_at: new Date().toISOString(),
          ...(isDelivered && { status: 'delivered' }),
          ...(isReturned  && { status: 'returned'  }),
        };
        await supabase.from('orders').update(updatePatch).eq('id', order.id);
        onStatusChange && onStatusChange(order.id, updatePatch);
        await supabase.from('order_events').insert({
          order_id: order.id,
          type: 'status_change',
          content: `PostEx: ${liveStatus}`,
        });
        loadEvents();
      }
    } catch (err) {
      setPostexInfo({ type: 'track', error: err.message });
    }
    setPostexLoading('');
  }

  async function cancelOrder() {
    if (!order.postex_tracking) return;
    if (!window.confirm(`Cancel PostEx shipment ${order.postex_tracking}?`)) return;
    setPostexLoading('cancel');
    setPostexInfo(null);
    try {
      const res = await fetch('/api/postex/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber: order.postex_tracking }),
      });
      const data = await res.json();
      setPostexInfo({ type: 'cancel', data });
    } catch (err) {
      setPostexInfo({ type: 'cancel', error: err.message });
    }
    setPostexLoading('');
  }

  async function shipperAdvice(statusId) {
    if (!order.postex_tracking) return;
    const key = statusId === 1 ? 'advice-return' : 'advice-retry';
    setPostexLoading(key);
    setPostexInfo(null);
    try {
      const res = await fetch('/api/postex/shipper-advice', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber: order.postex_tracking, statusId, remarks: statusId === 1 ? 'Return requested by merchant' : 'Retry delivery requested by merchant' }),
      });
      const data = await res.json();
      setPostexInfo({ type: 'advice', data });
    } catch (err) {
      setPostexInfo({ type: 'advice', error: err.message });
    }
    setPostexLoading('');
  }

  async function fetchPaymentStatus() {
    if (!order.postex_tracking) return;
    setPostexLoading('payment');
    setPostexInfo(null);
    try {
      const res = await fetch(`/api/postex/payment-status?tracking=${order.postex_tracking}`);
      const data = await res.json();
      setPostexInfo({ type: 'payment', data });
    } catch (err) {
      setPostexInfo({ type: 'payment', error: err.message });
    }
    setPostexLoading('');
  }

  if (!order) return null;

  const name       = `${order.first_name || ''} ${order.last_name || ''}`.trim();
  const num        = orderNum(order.id);
  const payment    = order.payment_method === 'bank' ? 'Bank Transfer' : 'Cash on Delivery';
  const phoneDigits = (order.phone || '').replace(/\D/g, '');
  const emailPart   = (order.email || '').split('@')[0].replace(/\W/g, '');
  const custId      = `CID-${(phoneDigits || emailPart).slice(-7).toUpperCase()}`;
  const totalOrders = custOrders.length;
  const totalSpent  = custOrders.reduce((s, o) => s + (o.total || 0), 0);
  const isRepeat    = totalOrders > 1;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col overflow-y-auto bg-white shadow-2xl border-l border-gray-200">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-200">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-1">Order</p>
            <h2 className="text-3xl italic text-gray-900" style={serif}>{num}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-gray-400 text-xs uppercase tracking-[0.15em]">{custId}</p>
              {isRepeat && (
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full">
                  Repeat Customer
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Customer details */}
        <div className="px-6 py-5 border-b border-gray-200 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 text-xs uppercase tracking-[0.2em]">Customer Details</span>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="text-xs text-blue-600 hover:text-blue-800 transition font-medium uppercase tracking-[0.12em]">Edit</button>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setEditing(false)} className="text-xs text-gray-400 hover:text-gray-700 transition uppercase tracking-[0.12em]">Cancel</button>
                <button onClick={saveOrder} disabled={savingOrder} className="text-xs text-white bg-gray-900 hover:bg-black px-3 py-1 rounded transition disabled:opacity-50 uppercase tracking-[0.12em]">{savingOrder ? 'Saving…' : 'Save'}</button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="space-y-3 pt-1">
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-[0.18em] mb-1">Full Name</p>
                <input value={editForm.full_name} onChange={e => setEditForm(f => ({...f, full_name: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-gray-500" />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-[0.18em] mb-1">WhatsApp</p>
                <input value={editForm.phone} onChange={e => setEditForm(f => ({...f, phone: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-gray-500" />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-[0.18em] mb-1">Email</p>
                <input value={editForm.email} onChange={e => setEditForm(f => ({...f, email: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-gray-500" />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-[0.18em] mb-1">Address</p>
                <input value={editForm.address} onChange={e => setEditForm(f => ({...f, address: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-gray-500" />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-[0.18em] mb-1">City</p>
                <input value={editForm.city} onChange={e => setEditForm(f => ({...f, city: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-gray-500" />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-[0.18em] mb-1">Payment Method</p>
                <select value={editForm.payment_method} onChange={e => setEditForm(f => ({...f, payment_method: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-gray-500 bg-white cursor-pointer">
                  <option value="cod">Cash on Delivery</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
            </div>
          ) : (
            <>
              {[
                ['CUSTOMER', name],
                ['WHATSAPP', order.phone],
                ['EMAIL',    order.email],
                ['ADDRESS',  order.address],
                ['CITY',     order.city],
                ['PAYMENT',  payment],
                ['DATE',     new Date(order.created_at).toLocaleString('en-PK', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })],
                ['POSTEX TRACKING', order.postex_tracking],
                ['POSTEX STATUS',   order.postex_status],
                ['POSTEX UPDATED',  order.postex_updated_at ? new Date(order.postex_updated_at).toLocaleString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : null],
              ].map(([l, v]) => v ? (
                <div key={l} className="flex justify-between gap-4">
                  <span className="text-gray-400 text-xs uppercase tracking-[0.2em] shrink-0">{l}</span>
                  <span className="text-gray-800 text-sm text-right">{v}</span>
                </div>
              ) : null)}
            </>
          )}

          {/* Customer order history */}
          {!custLoading && totalOrders > 0 && (
            <div className="mt-2 pt-3 border-t border-gray-100 space-y-2">
              <div className="flex justify-between gap-4">
                <span className="text-gray-400 text-xs uppercase tracking-[0.2em]">Total Orders</span>
                <span className="text-gray-800 text-sm font-semibold">{totalOrders}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400 text-xs uppercase tracking-[0.2em]">Total Spent</span>
                <span className="text-gray-800 text-sm font-semibold">Rs. {totalSpent.toLocaleString()}</span>
              </div>
              {totalOrders > 1 && (
                <div className="pt-1 space-y-1">
                  <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">Order History</p>
                  {custOrders.map(o => (
                    <div key={o.id} className={`flex justify-between text-xs px-2 py-1 rounded ${o.id === order.id ? 'bg-gray-100 font-medium' : ''}`}>
                      <span className="text-gray-500">{orderNum(o.id)}</span>
                      <span className={`capitalize ${STATUS[o.status]?.cls?.includes('yellow') ? 'text-yellow-600' : STATUS[o.status]?.cls?.includes('green') ? 'text-green-600' : 'text-gray-500'}`}>{o.status}</span>
                      <span className="text-gray-500">Rs. {(o.total || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {onCustomerFilter && (order.phone || order.email) && (
            <button
              onClick={() => { onCustomerFilter(order.phone || order.email); onClose(); }}
              className="text-xs uppercase tracking-[0.15em] text-blue-600 hover:text-blue-800 transition font-medium">
              View All Orders from This Customer →
            </button>
          )}
        </div>

        {/* Items */}
        {items?.length > 0 && (
          <div className="px-6 py-5 border-b border-gray-200">
            <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-4">ITEMS</p>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {item.product_img && (
                      <div className="relative w-9 h-9 shrink-0 bg-gray-100 border border-gray-200 rounded">
                        <Image src={item.product_img} alt="" fill className="object-contain" unoptimized />
                      </div>
                    )}
                    <span className="text-gray-700 text-sm">{item.product_title}{item.variation ? <span className="text-orange-500 text-xs ml-1">({item.variation})</span> : ''} <span className="text-gray-400">× {item.quantity}</span>
                      {item.custom_note && <span className="block text-purple-600 text-xs mt-0.5">Note: {item.custom_note}</span>}
                    </span>
                  </div>
                  <span className="text-gray-800 text-sm shrink-0 font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
              <span className="italic text-gray-900 text-base" style={serif}>Total</span>
              <span className="text-gray-900 font-bold text-base" style={serif}>Rs. {order.total?.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Book on PostEx */}
        {!order.postex_tracking && (
          <div className="px-6 py-5 border-b border-gray-200">
            <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-3">BOOK ON POSTEX</p>
            <button
              onClick={bookOnPostEx}
              disabled={bookingPostex}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-xs uppercase tracking-[0.2em] py-3.5 rounded-lg hover:bg-black transition disabled:opacity-50"
            >
              {bookingPostex ? 'Booking…' : 'Book on PostEx'}
            </button>
            {postexInfo?.error && (
              <p className="text-red-500 text-xs mt-2">{postexInfo.error}</p>
            )}
            {postexInfo?.data?.transactionStatus?.startsWith('Booked') && (
              <p className="text-green-600 text-xs mt-2 font-medium">{postexInfo.data.transactionStatus}</p>
            )}
          </div>
        )}

        {/* Status update */}
        <div className="px-6 py-5 border-b border-gray-200">
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-4">UPDATE STATUS</p>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button key={s} onClick={() => changeStatus(s)}
                className={`text-xs uppercase tracking-[0.12em] font-medium px-3.5 py-2 border rounded-lg transition ${
                  status === s ? STATUS[s].cls : 'border-gray-300 text-gray-500 hover:text-gray-800 hover:border-gray-500 bg-white'
                }`}>
                {STATUS[s]?.label || s}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="px-6 py-5 border-b border-gray-200">
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-4">ACTIVITY TIMELINE</p>

          {/* Order placed event always first */}
          <div className="relative pl-6 pb-4">
            <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-gray-300 border-2 border-white ring-1 ring-gray-300" />
            {events.length > 0 && <div className="absolute left-[5px] top-4 bottom-0 w-px bg-gray-200" />}
            <p className="text-gray-700 text-xs font-medium">Order placed</p>
            <p className="text-gray-400 text-[10px] mt-0.5">
              {new Date(order.created_at).toLocaleString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {events.map((ev, i) => {
            const isLast = i === events.length - 1;
            const isStatus = ev.type === 'status_change';
            const date = new Date(ev.created_at).toLocaleString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            return (
              <div key={ev.id} className="relative pl-6 pb-4">
                {!isLast && <div className="absolute left-[5px] top-4 bottom-0 w-px bg-gray-200" />}
                <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-white ring-1 ${isStatus ? 'bg-gray-800 ring-gray-700' : 'bg-blue-400 ring-blue-300'}`} />
                <p className={`text-xs font-medium ${isStatus ? 'text-gray-800' : 'text-blue-700'}`}>{ev.content}</p>
                <p className="text-gray-400 text-[10px] mt-0.5">{date}</p>
              </div>
            );
          })}

          {/* Add comment */}
          <div className="mt-2 space-y-2">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              rows={2}
              placeholder="Add a note (e.g. Called customer, confirmed address)…"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg outline-none focus:border-gray-500 transition placeholder:text-gray-400 resize-none"
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) addComment(); }}
            />
            <button onClick={addComment} disabled={addingComment || !newComment.trim()}
              className="text-xs uppercase tracking-[0.15em] font-medium px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition disabled:opacity-40">
              {addingComment ? 'Adding…' : '+ Add Note'}
            </button>
          </div>
        </div>

        {/* PostEx Actions */}
        {order.postex_tracking && (
          <div className="px-6 py-5 border-b border-gray-200">
            <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-4">POSTEX ACTIONS</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <button onClick={trackOrder} disabled={postexLoading === 'track'}
                className="text-xs uppercase tracking-[0.12em] font-medium px-3.5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:border-gray-500 bg-white transition disabled:opacity-50">
                {postexLoading === 'track' ? 'Tracking…' : 'Track'}
              </button>
              <button
                onClick={() => window.open(`/api/postex/airway-bill?tracking=${order.postex_tracking}`, '_blank')}
                className="text-xs uppercase tracking-[0.12em] font-medium px-3.5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:border-gray-500 bg-white transition">
                Airway Bill
              </button>
              <button onClick={cancelOrder} disabled={postexLoading === 'cancel'}
                className="text-xs uppercase tracking-[0.12em] font-medium px-3.5 py-2 border border-red-300 rounded-lg text-red-600 hover:text-red-800 hover:border-red-500 bg-white transition disabled:opacity-50">
                {postexLoading === 'cancel' ? 'Cancelling…' : 'Cancel'}
              </button>
              <button onClick={() => shipperAdvice(1)} disabled={postexLoading === 'advice-return'}
                className="text-xs uppercase tracking-[0.12em] font-medium px-3.5 py-2 border border-orange-300 rounded-lg text-orange-600 hover:text-orange-800 hover:border-orange-500 bg-white transition disabled:opacity-50">
                {postexLoading === 'advice-return' ? 'Marking…' : 'Mark Return'}
              </button>
              <button onClick={() => shipperAdvice(2)} disabled={postexLoading === 'advice-retry'}
                className="text-xs uppercase tracking-[0.12em] font-medium px-3.5 py-2 border border-blue-300 rounded-lg text-blue-600 hover:text-blue-800 hover:border-blue-500 bg-white transition disabled:opacity-50">
                {postexLoading === 'advice-retry' ? 'Marking…' : 'Retry Delivery'}
              </button>
              <button onClick={fetchPaymentStatus} disabled={postexLoading === 'payment'}
                className="text-xs uppercase tracking-[0.12em] font-medium px-3.5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:border-gray-500 bg-white transition disabled:opacity-50">
                {postexLoading === 'payment' ? 'Loading…' : 'Payment Status'}
              </button>
            </div>
            {postexInfo && (
              <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 space-y-1">
                {postexInfo.error ? (
                  <p className="text-red-600">Error: {postexInfo.error}</p>
                ) : postexInfo.type === 'track' ? (
                  <>
                    {/* Current status */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400 uppercase tracking-[0.15em]">Current:</span>
                      <span className="font-semibold text-gray-900">{postexInfo.data?.transactionStatus || postexInfo.data?.transactionStatusMessage || postexInfo.data?.orderStatus || '—'}</span>
                    </div>
                    {postexInfo.data?.updatedDate && (
                      <p className="text-gray-400 text-[10px] mb-2">Updated: {postexInfo.data.updatedDate}</p>
                    )}
                    {/* Status history timeline */}
                    {postexInfo.data?.transactionStatusHistory?.length > 0 && (
                      <div className="mt-2 border-t border-gray-200 pt-2 space-y-1.5">
                        <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] mb-1">Status History</p>
                        {postexInfo.data.transactionStatusHistory.map((h, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <div>
                              <p className="text-gray-800 text-xs font-medium">{h.transactionStatusMessage || h.status}</p>
                              <p className="text-gray-400 text-[10px]">{h.updatedDate || h.date || ''}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : postexInfo.type === 'payment' ? (
                  <>
                    <p><span className="text-gray-400 uppercase tracking-[0.15em]">Settled:</span> <span className={postexInfo.data?.settle === true ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{postexInfo.data?.settle === true ? 'Yes' : 'No'}</span></p>
                    {postexInfo.data?.settlementDate && <p><span className="text-gray-400 uppercase tracking-[0.15em]">Settlement Date:</span> {postexInfo.data.settlementDate}</p>}
                    {postexInfo.data?.upfrontPaymentDate && <p><span className="text-gray-400 uppercase tracking-[0.15em]">Upfront Payment:</span> {postexInfo.data.upfrontPaymentDate}</p>}
                    {postexInfo.data?.cprNumber_1 && <p><span className="text-gray-400 uppercase tracking-[0.15em]">CPR #1:</span> {postexInfo.data.cprNumber_1}</p>}
                    {postexInfo.data?.reservePaymentDate && <p><span className="text-gray-400 uppercase tracking-[0.15em]">Reserve Payment:</span> {postexInfo.data.reservePaymentDate}</p>}
                    {postexInfo.data?.cprNumber_2 && <p><span className="text-gray-400 uppercase tracking-[0.15em]">CPR #2:</span> {postexInfo.data.cprNumber_2}</p>}
                  </>
                ) : (
                  <p>{postexInfo.data?.statusMessage || JSON.stringify(postexInfo.data)}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* WhatsApp send */}
        <div className="px-6 py-5 border-b border-gray-200">
          <button
            onClick={() => sendWhatsApp(order, status, items, order.total)}
            className="w-full flex items-center justify-center gap-2.5 bg-green-600 text-white text-xs uppercase tracking-[0.25em] py-4 rounded-lg hover:bg-green-700 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Send WhatsApp Update
          </button>
          <p className="text-gray-400 text-xs text-center mt-2 uppercase tracking-[0.15em]">
            Opens WhatsApp for {order.phone || 'customer'}
          </p>
        </div>

        {/* Delete order */}
        <div className="px-6 py-5">
          <button
            onClick={deleteOrder}
            className="w-full text-xs uppercase tracking-[0.2em] font-medium py-3 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 rounded-lg transition">
            Delete Order
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   ORDERS CHART
═══════════════════════════════════════════ */
function OrdersChart({ orders }) {
  const [mode,  setMode]  = useState('orders'); // 'orders' | 'revenue'
  const [range, setRange] = useState('30d');    // '30d' | '3m' | '1y' | 'all'

  const W = 560, H = 160, PAD = { t: 12, r: 8, b: 36, l: 44 };
  const iW = W - PAD.l - PAD.r;
  const iH = H - PAD.t - PAD.b;

  const skip = (o) => ['cancelled', 'returned'].includes(o.status);

  // Build buckets based on range
  const { buckets, title } = (() => {
    const now = new Date();

    if (range === '30d') {
      const keys = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(now); d.setDate(d.getDate() - (29 - i));
        return d.toISOString().slice(0, 10);
      });
      const map = {};
      for (const k of keys) map[k] = { label: k.slice(5), orders: 0, revenue: 0 };
      for (const o of orders) {
        const k = o.created_at?.slice(0, 10);
        if (map[k]) { map[k].orders++; if (!skip(o)) map[k].revenue += Number(o.total) || 0; }
      }
      return { buckets: keys.map(k => ({ key: k, ...map[k] })), title: 'Last 30 Days' };
    }

    if (range === '3m') {
      // weekly buckets — 13 week-start dates
      const starts = Array.from({ length: 13 }, (_, i) => {
        const d = new Date(now); d.setDate(d.getDate() - (12 - i) * 7);
        return d.toISOString().slice(0, 10);
      });
      const map = {};
      for (const k of starts) map[k] = { label: k.slice(5), orders: 0, revenue: 0 };
      for (const o of orders) {
        const oDate = o.created_at?.slice(0, 10);
        if (!oDate) continue;
        // assign to latest bucket start <= oDate
        let bucket = null;
        for (let i = starts.length - 1; i >= 0; i--) {
          if (oDate >= starts[i]) { bucket = starts[i]; break; }
        }
        if (bucket && map[bucket]) {
          map[bucket].orders++;
          if (!skip(o)) map[bucket].revenue += Number(o.total) || 0;
        }
      }
      return { buckets: starts.map(k => ({ key: k, ...map[k] })), title: 'Last 3 Months' };
    }

    if (range === '1y') {
      // monthly buckets — last 12 months
      const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now); d.setDate(1); d.setMonth(d.getMonth() - (11 - i));
        return d.toISOString().slice(0, 7);
      });
      const map = {};
      for (const k of months) map[k] = { label: k.slice(5), orders: 0, revenue: 0 };
      for (const o of orders) {
        const k = o.created_at?.slice(0, 7);
        if (k && map[k]) { map[k].orders++; if (!skip(o)) map[k].revenue += Number(o.total) || 0; }
      }
      return { buckets: months.map(k => ({ key: k, ...map[k] })), title: 'Last 12 Months' };
    }

    // 'all' — monthly from first order to today
    if (!orders.length) return { buckets: [], title: 'All Time' };
    const firstStr = orders.reduce((min, o) => (!min || o.created_at < min ? o.created_at : min), null);
    const months = [];
    const cur = new Date(firstStr.slice(0, 7) + '-01');
    const nowYM = now.toISOString().slice(0, 7);
    while (cur.toISOString().slice(0, 7) <= nowYM) {
      months.push(cur.toISOString().slice(0, 7));
      cur.setMonth(cur.getMonth() + 1);
    }
    const map = {};
    for (const k of months) map[k] = { label: k.slice(5), orders: 0, revenue: 0 };
    for (const o of orders) {
      const k = o.created_at?.slice(0, 7);
      if (k && map[k]) { map[k].orders++; if (!skip(o)) map[k].revenue += Number(o.total) || 0; }
    }
    return { buckets: months.map(k => ({ key: k, ...map[k] })), title: 'All Time' };
  })();

  const values  = buckets.map(b => b[mode]);
  const maxVal  = Math.max(...values, 1);
  const N       = buckets.length || 1;
  const barW    = iW / N;
  const barGap  = barW * 0.25;
  const every   = N <= 15 ? 1 : N <= 30 ? 3 : N <= 60 ? 7 : N <= 90 ? 10 : 1; // label every Nth

  return (
    <div className="border border-gray-200 bg-white rounded-xl shadow-sm p-5 md:p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl italic text-gray-800" style={serif}>{title}</h2>
        <div className="flex gap-1 flex-wrap justify-end">
          {[['30d','30 Days'],['3m','3 Months'],['1y','1 Year'],['all','All Time']].map(([v, l]) => (
            <button key={v} onClick={() => setRange(v)}
              className={`text-xs uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg border font-medium transition ${range === v ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-300 hover:border-gray-500'}`}>
              {l}
            </button>
          ))}
          <div className="w-px bg-gray-200 mx-1 self-stretch" />
          {[['orders','Orders'],['revenue','Revenue']].map(([v, l]) => (
            <button key={v} onClick={() => setMode(v)}
              className={`text-xs uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg border font-medium transition ${mode === v ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-300 hover:border-gray-500'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 320 }}>
          {[0, 0.25, 0.5, 0.75, 1].map(f => {
            const y = PAD.t + iH * (1 - f);
            const val = Math.round(maxVal * f);
            return (
              <g key={f}>
                <line x1={PAD.l} y1={y} x2={PAD.l + iW} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                <text x={PAD.l - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">
                  {mode === 'revenue' && val >= 1000 ? `${Math.round(val / 1000)}k` : val}
                </text>
              </g>
            );
          })}
          {buckets.map((b, i) => {
            const val = values[i];
            const bH  = iH * (val / maxVal);
            const x   = PAD.l + i * barW + barGap / 2;
            const y   = PAD.t + iH - bH;
            return (
              <g key={b.key}>
                <rect x={x} y={y} width={barW - barGap} height={bH} fill={val > 0 ? '#1f2937' : '#e5e7eb'} rx="2" />
                {i % every === 0 && (
                  <text x={x + (barW - barGap) / 2} y={H - PAD.b + 14} textAnchor="middle" fontSize="8.5" fill="#9ca3af">{b.label}</text>
                )}
                <title>{b.key}: {mode === 'revenue' ? `Rs. ${val.toLocaleString()}` : `${val} orders`}</title>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex gap-6 text-sm">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-0.5">Period Orders</p>
          <p className="text-gray-900 font-bold">{buckets.reduce((s, b) => s + b.orders, 0)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-0.5">Period Revenue</p>
          <p className="text-gray-900 font-bold">Rs. {buckets.reduce((s, b) => s + b.revenue, 0).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════ */
function Dashboard() {
  const [stats,         setStats]         = useState({ total: 0, revenue: 0, pending: 0, deliveryRate: 0 });
  const [recent,        setRecent]        = useState([]);
  const [allOrders,     setAllOrders]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [itemsMap,      setItemsMap]      = useState({});

  useEffect(() => {
    (async () => {
      const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (orders) {
        const delivered = orders.filter(o => o.status === 'delivered').length;
        setStats({
          total:        orders.length,
          revenue:      orders.filter(o => !['cancelled','returned'].includes(o.status)).reduce((s, o) => s + (Number(o.total) || 0), 0),
          pending:      orders.filter(o => o.status === 'pending').length,
          deliveryRate: orders.length ? Math.round((delivered / orders.length) * 100) : 0,
        });
        setAllOrders(orders);
        setRecent(orders.slice(0, 8));
      }
      setLoading(false);
    })();
  }, []);

  async function viewOrder(order) {
    setSelectedOrder(order);
    if (!itemsMap[order.id]) {
      const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id);
      setItemsMap(m => ({ ...m, [order.id]: data || [] }));
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-1">Admin</p>
        <h1 className="text-4xl italic text-gray-900" style={serif}>Dashboard</h1>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders',  value: stats.total },
          { label: 'Revenue',       value: `Rs. ${stats.revenue.toLocaleString()}` },
          { label: 'Pending',       value: stats.pending },
          { label: 'Delivery Rate', value: `${stats.deliveryRate}%` },
        ].map(s => (
          <div key={s.label} className="border border-gray-200 p-5 bg-white rounded-xl shadow-sm">
            <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-2">{s.label}</p>
            <p className="text-3xl text-gray-900 font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <OrdersChart orders={allOrders} />

      <div>
        <h2 className="text-xl italic text-gray-800 mb-4" style={serif}>Recent Orders</h2>
        {recent.length === 0
          ? <p className="text-gray-400 text-sm italic">No orders yet.</p>
          : (
            <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
              {recent.map(o => (
                <div key={o.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                  <span className="text-gray-900 text-sm font-bold w-20 shrink-0">{orderNum(o.id)}</span>
                  <span className="text-gray-700 text-sm">{o.first_name} {o.last_name}</span>
                  <span className="text-gray-400 text-sm">{[o.address, o.city].filter(Boolean).join(', ')}</span>
                  <span className="text-xs text-gray-500 border border-gray-200 px-2 py-0.5 rounded ml-1">{o.payment_method === 'bank' ? 'Bank' : 'COD'}</span>
                  <span className="text-gray-900 text-sm font-semibold ml-auto">Rs. {o.total?.toLocaleString()}</span>
                  <span className={`text-xs uppercase tracking-[0.12em] px-2.5 py-1 border rounded-lg ${STATUS[o.status]?.cls || STATUS.pending.cls}`}>
                    {STATUS[o.status]?.label || o.status}
                  </span>
                  <button onClick={() => viewOrder(o)}
                    className="text-gray-400 hover:text-gray-900 text-xs uppercase tracking-[0.2em] transition font-medium">
                    View →
                  </button>
                </div>
              ))}
            </div>
          )
        }
      </div>
      {selectedOrder && (
        <OrderDrawer
          order={selectedOrder}
          items={itemsMap[selectedOrder.id]}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={(id, s) => setRecent(prev => prev.map(o => o.id === id ? { ...o, status: s } : o))}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ORDERS TAB
═══════════════════════════════════════════ */
function OrdersTab() {
  const [orders,           setOrders]           = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [filter,           setFilter]           = useState('all');
  const [search,           setSearch]           = useState('');
  const [selectedOrder,    setSelectedOrder]    = useState(null);
  const [itemsMap,         setItemsMap]         = useState({});
  const [selected,         setSelected]         = useState(new Set());
  const [bulkStatus,       setBulkStatus]       = useState('');
  const [sheetLoading,     setSheetLoading]     = useState(false);
  const [syncingPostex,    setSyncingPostex]    = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
    setSelected(new Set());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function syncAllPostex() {
    const withTracking = orders.filter(o => o.postex_tracking);
    if (!withTracking.length) return;
    setSyncingPostex(true);
    try {
      // Use Bulk Track API (3.9) — more efficient than individual calls
      const res = await fetch('/api/postex/track-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumbers: withTracking.map(o => o.postex_tracking) }),
      });
      const results = await res.json(); // array of { trackingNumber, transactionStatus, ... }
      for (const item of (results || [])) {
        const trackNum = item.trackingNumber;
        const liveStatus = item.trackingResponse?.transactionStatus || item.transactionStatus;
        if (!liveStatus || !trackNum) continue;
        const order = withTracking.find(o => o.postex_tracking === trackNum);
        if (!order) continue;
        const isDelivered = liveStatus.toLowerCase().includes('delivered');
        const isReturned  = liveStatus.toLowerCase().includes('returned');
        const patch = {
          postex_status:     liveStatus,
          postex_updated_at: new Date().toISOString(),
          ...(isDelivered && { status: 'delivered' }),
          ...(isReturned  && { status: 'returned'  }),
        };
        await supabase.from('orders').update(patch).eq('id', order.id);
        setOrders(prev => prev.map(x => x.id === order.id ? { ...x, ...patch } : x));
      }
    } catch { /* silent */ }
    setSyncingPostex(false);
  }

  async function viewOrder(order) {
    setSelectedOrder(order);
    if (!itemsMap[order.id]) {
      const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id);
      setItemsMap(m => ({ ...m, [order.id]: data || [] }));
    }
  }

  function handleStatusChange(id, s) {
    const patch = typeof s === 'object' ? s : { status: s };
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o));
    if (selectedOrder?.id === id) setSelectedOrder(o => ({ ...o, ...patch }));
  }

  const visible = orders.filter(o => {
    const mf = filter === 'all' || o.status === filter;
    const q  = search.toLowerCase();
    const ms = !q || `${o.first_name} ${o.last_name} ${o.phone} ${o.email} ${o.city} ${orderNum(o.id)}`.toLowerCase().includes(q);
    return mf && ms;
  });

  const allSelected = visible.length > 0 && visible.every(o => selected.has(o.id));

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(visible.map(o => o.id)));
  }

  function toggleOne(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function applyBulkStatus() {
    if (!bulkStatus || selected.size === 0) return;
    const ids = [...selected];
    await supabase.from('orders').update({ status: bulkStatus }).in('id', ids);
    setOrders(prev => prev.map(o => selected.has(o.id) ? { ...o, status: bulkStatus } : o));
    setSelected(new Set());
    setBulkStatus('');
  }

  async function deleteSelectedOrders() {
    if (selected.size === 0) return;
    if (!window.confirm(`Delete ${selected.size} order(s)? This cannot be undone.`)) return;
    const ids = [...selected];
    await supabase.from('orders').delete().in('id', ids);
    setOrders(prev => prev.filter(o => !selected.has(o.id)));
    setSelected(new Set());
  }

  function handleDeleteOrder(id) {
    setOrders(prev => prev.filter(o => o.id !== id));
    setSelectedOrder(null);
  }

  async function generateLoadSheet() {
    const trackingNumbers = visible
      .filter(o => o.postex_tracking)
      .map(o => o.postex_tracking);
    if (trackingNumbers.length === 0) {
      alert('No orders with PostEx tracking numbers in current view.');
      return;
    }
    setSheetLoading(true);
    try {
      const res = await fetch('/api/postex/load-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumbers }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert('Load sheet error: ' + (err.error || 'Unknown error'));
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      alert('Load sheet error: ' + err.message);
    }
    setSheetLoading(false);
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-1">Admin</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-4xl italic text-gray-900" style={serif}>Order Management</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => exportCSV(selected.size > 0 ? orders.filter(o => selected.has(o.id)) : visible)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-xs uppercase tracking-[0.2em] border border-gray-300 px-3.5 py-2 rounded-lg hover:bg-gray-50 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export {selected.size > 0 ? `(${selected.size})` : 'All'}
            </button>

            <button onClick={syncAllPostex} disabled={syncingPostex}
              className="flex items-center gap-1.5 text-purple-600 hover:text-purple-900 text-xs uppercase tracking-[0.2em] border border-purple-300 px-3.5 py-2 rounded-lg hover:bg-purple-50 transition disabled:opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 1-.987-1.106v-.828" />
              </svg>
              {syncingPostex ? 'Syncing PostEx…' : 'Sync PostEx'}
            </button>
            <button onClick={generateLoadSheet} disabled={sheetLoading}
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-900 text-xs uppercase tracking-[0.2em] border border-blue-300 px-3.5 py-2 rounded-lg hover:bg-blue-50 transition disabled:opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              {sheetLoading ? 'Loading…' : 'Load Sheet'}
            </button>
            <button onClick={load}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-xs uppercase tracking-[0.2em] border border-gray-300 px-3.5 py-2 rounded-lg hover:bg-gray-50 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Orders',  value: orders.length },
          { label: 'Revenue',       value: `Rs. ${orders.filter(o => !['cancelled','returned'].includes(o.status)).reduce((s, o) => s + (Number(o.total) || 0), 0).toLocaleString()}` },
          { label: 'Pending',       value: orders.filter(o => o.status === 'pending').length },
          { label: 'Delivery Rate', value: orders.length ? `${Math.round((orders.filter(o => o.status === 'delivered').length / orders.length) * 100)}%` : '0%' },
        ].map(s => (
          <div key={s.label} className="border border-gray-200 px-4 py-4 bg-white rounded-xl shadow-sm">
            <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-1">{s.label}</p>
            <p className="text-2xl text-gray-900 font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + filter + bulk */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID, customer, WhatsApp, email…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:border-gray-500 transition placeholder:text-gray-400" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="bg-white border border-gray-300 text-gray-700 text-sm px-3.5 py-2.5 rounded-lg outline-none focus:border-gray-500 cursor-pointer transition">
          <option value="all">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS[s].label}</option>)}
        </select>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">{selected.size} selected</span>
            <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 text-sm px-3 py-2 rounded-lg outline-none focus:border-gray-500 cursor-pointer">
              <option value="">Bulk status…</option>
              {STATUSES.map(s => <option key={s} value={s}>{STATUS[s].label}</option>)}
            </select>
            <button onClick={applyBulkStatus} disabled={!bulkStatus}
              className="bg-gray-900 text-white text-xs uppercase tracking-[0.15em] px-3.5 py-2 rounded-lg hover:bg-black transition disabled:opacity-40">
              Apply
            </button>
            <button onClick={deleteSelectedOrders}
              className="bg-red-600 text-white text-xs uppercase tracking-[0.15em] px-3.5 py-2 rounded-lg hover:bg-red-700 transition">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Table — desktop */}
      <div className="border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Desktop header */}
        <div className="hidden md:grid grid-cols-[32px_100px_1fr_120px_90px_100px_100px_110px_80px] gap-x-3 px-5 py-3.5 border-b border-gray-200 bg-gray-50">
          <input type="checkbox" checked={allSelected} onChange={toggleAll}
            className="accent-gray-800 mt-0.5 cursor-pointer" />
          {['ORDER', 'CUSTOMER', 'WHATSAPP', 'PAYMENT', 'TOTAL', 'DATE', 'STATUS', 'ACTION'].map(h => (
            <span key={h} className="text-xs text-gray-500 uppercase tracking-[0.2em] font-semibold">{h}</span>
          ))}
        </div>

        {visible.length === 0
          ? <p className="text-gray-400 text-sm italic text-center py-12">No orders found.</p>
          : visible.map(o => (
            <div key={o.id} className={`border-b border-gray-100 last:border-0 transition ${selected.has(o.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>

              {/* Desktop row */}
              <div
                className="hidden md:grid grid-cols-[32px_100px_1fr_120px_90px_100px_100px_110px_80px] gap-x-3 items-center px-5 py-4 cursor-pointer"
                onClick={() => toggleOne(o.id)}>
                <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggleOne(o.id)}
                  onClick={e => e.stopPropagation()} className="accent-gray-800 mt-0.5 cursor-pointer" />
                <div className="min-w-0">
                  <span className="text-gray-900 text-sm font-bold">{orderNum(o.id)}</span>
                  {o.postex_tracking && (
                    <p className="text-[10px] text-indigo-500 font-mono truncate mt-0.5">{o.postex_tracking}</p>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-gray-800 text-sm truncate font-medium">{o.first_name} {o.last_name}</p>
                  <p className="text-gray-400 text-xs truncate">{[o.address, o.city].filter(Boolean).join(', ')}</p>
                  {o.postex_status && <p className="text-[10px] text-purple-600 font-semibold uppercase tracking-wide mt-0.5">🚚 PostEx: {o.postex_status}</p>}
                  {o.notes && <p className="text-blue-500 text-xs break-words whitespace-normal mt-0.5">📝 {o.notes}</p>}
                </div>
                <span className="text-gray-500 text-sm">{o.phone}</span>
                <span className={`text-xs px-2 py-1 rounded border font-medium ${o.payment_method === 'bank' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {o.payment_method === 'bank' ? 'Bank' : 'COD'}
                </span>
                <span className="text-gray-900 text-sm font-semibold">Rs. {o.total?.toLocaleString()}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(o.created_at).toLocaleString('en-PK', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className={`text-xs uppercase tracking-[0.12em] px-2 py-1 border rounded-lg text-center ${STATUS[o.status]?.cls || STATUS.pending.cls}`}>
                  {STATUS[o.status]?.label || o.status}
                </span>
                <button onClick={e => { e.stopPropagation(); viewOrder(o); }}
                  className="text-gray-400 hover:text-gray-900 text-xs uppercase tracking-[0.2em] transition font-medium text-center">
                  View →
                </button>
              </div>

              {/* Mobile card */}
              <div className="md:hidden px-4 py-3.5 cursor-pointer" onClick={() => viewOrder(o)}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-gray-900 text-sm font-bold">{orderNum(o.id)}</span>
                    {o.postex_tracking && <span className="text-[10px] text-indigo-500 font-mono ml-2">{o.postex_tracking}</span>}
                  </div>
                  <span className={`text-[10px] uppercase tracking-[0.1em] px-2 py-1 border rounded-lg shrink-0 ${STATUS[o.status]?.cls || STATUS.pending.cls}`}>
                    {STATUS[o.status]?.label || o.status}
                  </span>
                </div>
                <p className="text-gray-800 text-sm font-medium">{o.first_name} {o.last_name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{o.city} · {o.phone}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 text-sm font-semibold">Rs. {o.total?.toLocaleString()}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${o.payment_method === 'bank' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {o.payment_method === 'bank' ? 'Bank' : 'COD'}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {new Date(o.created_at).toLocaleString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {o.postex_status && <p className="text-[10px] text-purple-600 font-semibold uppercase tracking-wide mt-1.5">🚚 {o.postex_status}</p>}
                {o.notes && <p className="text-blue-500 text-xs mt-1">📝 {o.notes}</p>}
              </div>
            </div>
          ))
        }
      </div>

      {selectedOrder && (
        <OrderDrawer
          order={selectedOrder}
          items={itemsMap[selectedOrder.id]}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteOrder}
          onCustomerFilter={val => setSearch(val)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRODUCTS TAB
═══════════════════════════════════════════ */
const EMPTY = {
  slug: '', title: '', subtitle: '', category: '', tagline: '',
  numeric_price: '', stock_note: '', description: '',
  features: '', included: '', how_it_works: '',
  quote: '', quote_label: '', upsell_slug: '', tag: '',
  in_stock: true, hidden: false, custom_text_enabled: false,
  bulk_discount_qty: '', bulk_discount_pct: '',
};


async function uploadImg(file, slug) {
  const ext  = file.name.split('.').pop();
  const path = `${Date.now()}-${slug.replace(/[^a-z0-9]/gi, '-')}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
  const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
  if (error) throw error;
  return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
}

function ImgSlot({ label, file, preview, required, onChange, onClear }) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium">{label}</p>
      <div className="flex items-center gap-3">
        {preview ? (
          <div className="relative w-16 h-16 border border-gray-200 bg-gray-50 rounded-lg shrink-0 group">
            <Image src={preview} alt="" fill className="object-contain" unoptimized />
            <button type="button" onClick={onClear}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              ×
            </button>
          </div>
        ) : (
          <label className="cursor-pointer flex items-center gap-2 border border-dashed border-gray-300 hover:border-gray-500 px-3 py-2.5 rounded-lg transition text-sm text-gray-400 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            {file ? file.name : 'Upload'}
            <input type="file" accept="image/*" onChange={onChange} className="hidden" required={required && !preview} />
          </label>
        )}
      </div>
    </div>
  );
}

function ProductsTab() {
  const [products,      setProducts]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [showForm,      setShowForm]      = useState(false);
  const [form,          setForm]          = useState(EMPTY);
  const [imgFile,       setImgFile]       = useState(null);
  const [preview,       setPreview]       = useState('');
  const [extraFiles,    setExtraFiles]    = useState([null, null, null]);
  const [extraPreviews, setExtraPreviews] = useState(['', '', '']);
  const [faq,           setFaq]           = useState([]);
  const [variations,    setVariations]    = useState([]);
  const [varInput,      setVarInput]      = useState('');
  const [varPrice,      setVarPrice]      = useState('');
  const [varDesc,       setVarDesc]       = useState('');
  const [varTagline,    setVarTagline]    = useState('');
  const [saving,        setSaving]        = useState(false);
  const [editId,        setEditId]        = useState(null);
  const [search,        setSearch]        = useState('');
  const [selectedProds, setSelectedProds] = useState(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  function setExtraFile(i, file) {
    setExtraFiles(prev => { const n = [...prev]; n[i] = file; return n; });
    setExtraPreviews(prev => { const n = [...prev]; n[i] = URL.createObjectURL(file); return n; });
  }
  function clearExtra(i) {
    setExtraFiles(prev => { const n = [...prev]; n[i] = null; return n; });
    setExtraPreviews(prev => { const n = [...prev]; n[i] = ''; return n; });
  }

  function addFaq()         { setFaq(f => [...f, { q: '', a: '' }]); }
  function removeFaq(i)     { setFaq(f => f.filter((_, j) => j !== i)); }
  function editFaq(i, k, v) { setFaq(f => f.map((row, j) => j === i ? { ...row, [k]: v } : row)); }

  function startEdit(p) {
    setEditId(p.id);
    setForm({
      slug: p.slug, title: p.title, subtitle: p.subtitle || '',
      category: p.category || '', tagline: p.tagline || '',
      numeric_price: String(p.numeric_price || ''),
      stock_note: p.stock_note || '', description: p.description || '',
      features:     (p.features     || []).join(', '),
      included:     (p.included     || []).join(', '),
      how_it_works: (p.how_it_works || []).join(', '),
      quote:        p.quote       || '',
      quote_label:  p.quote_label || '',
      upsell_slug:  p.upsell_slug || '',
      tag:          p.tag         || '',
      in_stock:            p.in_stock !== false,
      hidden:              p.hidden === true,
      custom_text_enabled: p.custom_text_enabled === true,
      bulk_discount_qty: p.bulk_discount_qty ? String(p.bulk_discount_qty) : '',
      bulk_discount_pct: p.bulk_discount_pct ? String(p.bulk_discount_pct) : '',
    });
    const imgs = p.images?.length ? p.images : [p.img].filter(Boolean);
    setPreview(imgs[0] || '');
    setExtraPreviews([imgs[1] || '', imgs[2] || '', imgs[3] || '']);
    setExtraFiles([null, null, null]);
    setImgFile(null);
    setFaq(p.faq?.length ? p.faq : []);
    setVariations(p.variations?.length ? p.variations : []);
    setVarInput('');
    setVarPrice('');
    setVarDesc('');
    setVarTagline('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancel() {
    setShowForm(false); setEditId(null);
    setForm(EMPTY); setImgFile(null); setPreview('');
    setExtraFiles([null, null, null]); setExtraPreviews(['', '', '']);
    setFaq([]); setVariations([]); setVarInput(''); setVarPrice(''); setVarDesc(''); setVarTagline('');
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    const slugKey = form.slug.trim().toLowerCase().replace(/\s+/g, '-');
    try {
      let primaryUrl = preview;
      if (imgFile) primaryUrl = await uploadImg(imgFile, slugKey);
      const extraUrls = [...extraPreviews];
      for (let i = 0; i < 3; i++) {
        if (extraFiles[i]) extraUrls[i] = await uploadImg(extraFiles[i], slugKey);
      }
      const allImages = [primaryUrl, ...extraUrls].filter(Boolean);
      const payload = {
        slug:          slugKey,
        title:         form.title.trim(),
        subtitle:      form.subtitle.trim(),
        category:      form.category.trim(),
        tagline:       form.tagline.trim(),
        price:         `Rs. ${parseInt(form.numeric_price).toLocaleString()}`,
        numeric_price: parseInt(form.numeric_price) || 0,
        stock_note:    form.stock_note.trim(),
        img:           primaryUrl,
        images:        allImages,
        description:   form.description.trim(),
        features:      form.features.split(',').map(s => s.trim()).filter(Boolean),
        included:      form.included.split(',').map(s => s.trim()).filter(Boolean),
        how_it_works:  form.how_it_works.split(',').map(s => s.trim()).filter(Boolean),
        quote:         form.quote.trim(),
        quote_label:   form.quote_label.trim(),
        upsell_slug:   form.upsell_slug.trim() || null,
        tag:           form.tag.trim() || null,
        in_stock:            form.in_stock,
        hidden:              form.hidden,
        custom_text_enabled: form.custom_text_enabled,
        bulk_discount_qty: parseInt(form.bulk_discount_qty) || null,
        bulk_discount_pct: parseInt(form.bulk_discount_pct) || null,
        faq:               faq.filter(r => r.q.trim()),
        variations:        variations.filter(v => v?.name?.trim()),
      };
      const { error } = editId
        ? await supabase.from('products').update(payload).eq('id', editId)
        : await supabase.from('products').insert(payload);
      if (error) throw error;
      cancel(); load();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
    setSaving(false);
  }

  async function del(id, title) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    await supabase.from('products').delete().eq('id', id);
    setSelectedProds(prev => { const n = new Set(prev); n.delete(id); return n; });
    load();
  }

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const allProdsSelected = filtered.length > 0 && filtered.every(p => selectedProds.has(p.id));
  function toggleAllProds() {
    if (allProdsSelected) setSelectedProds(new Set());
    else setSelectedProds(new Set(filtered.map(p => p.id)));
  }
  function toggleOneProd(id) {
    setSelectedProds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  async function deleteSelectedProds() {
    if (selectedProds.size === 0) return;
    if (!window.confirm(`Delete ${selectedProds.size} product(s)? This cannot be undone.`)) return;
    await supabase.from('products').delete().in('id', [...selectedProds]);
    setSelectedProds(new Set());
    load();
  }

  async function quickToggle(id, field, value) {
    await supabase.from('products').update({ [field]: !value }).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: !value } : p));
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-1">Admin</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-4xl italic text-gray-900" style={serif}>Products</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                className="pl-8 pr-3 py-2 bg-white border border-gray-300 text-gray-800 text-sm rounded-lg outline-none focus:border-gray-500 transition placeholder:text-gray-400 w-44" />
            </div>
            {!showForm && (
              <button onClick={() => setShowForm(true)}
                className="bg-gray-900 text-white font-semibold text-xs uppercase tracking-[0.18em] px-5 py-2.5 rounded-lg hover:bg-black transition-all">
                + Add Product
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-gray-400 text-sm">{products.length} products total</p>
          {selectedProds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">{selectedProds.size} selected</span>
              <button onClick={deleteSelectedProds}
                className="bg-red-600 text-white text-xs uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg hover:bg-red-700 transition">
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="border border-gray-200 p-6 md:p-8 bg-white rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl italic text-gray-900" style={serif}>{editId ? 'Edit Product' : 'New Product'}</h3>
            <button onClick={cancel} className="text-gray-400 hover:text-gray-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={save} className="space-y-8">

            {/* ─ Basic Info ─ */}
            <section className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.25em] text-gray-400 border-b border-gray-200 pb-2 font-semibold">Basic Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['Slug (URL key) *', 'slug', 'e.g. my-product', true],
                  ['Title *', 'title', 'Product title', true],
                  ['Subtitle', 'subtitle', 'Italic line below title'],
                  ['Category', 'category', 'e.g. Card Game'],
                  ['Tagline', 'tagline', 'Small italic above title'],
                  ['Price in PKR *', 'numeric_price', 'e.g. 3499', true],
                  ['Stock Note', 'stock_note', 'e.g. Limited stock available'],
                ].map(([l, k, ph, req]) => (
                  <div key={k}>
                    <label className={LBL}>{l}</label>
                    <input type={k === 'numeric_price' ? 'number' : 'text'}
                      value={form[k]} onChange={f(k)} placeholder={ph} required={!!req} className={INP} />
                  </div>
                ))}
                <div>
                  <label className={LBL}>Tag</label>
                  <select value={form.tag} onChange={f('tag')} className={INP}>
                    <option value="">— No Tag —</option>
                    <option value="best-seller">Best Seller</option>
                    <option value="new-arrival">New Arrival</option>
                    <option value="on-sale">On Sale</option>
                  </select>
                </div>
              </div>
              {/* Bulk Discount */}
              <div className="space-y-2">
                <label className={LBL}>Bulk Discount <span className="normal-case tracking-normal text-gray-400 font-normal">(optional — leave blank to disable)</span></label>
                <div className="flex gap-3 flex-wrap">
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-1">Min Qty to Unlock</label>
                    <input type="number" min="2" value={form.bulk_discount_qty} onChange={f('bulk_discount_qty')}
                      placeholder="e.g. 2" className={INP} />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-1">Discount %</label>
                    <input type="number" min="1" max="100" value={form.bulk_discount_pct} onChange={f('bulk_discount_pct')}
                      placeholder="e.g. 10" className={INP} />
                  </div>
                </div>
                {form.bulk_discount_qty && form.bulk_discount_pct && (
                  <p className="text-green-600 text-xs">Buy {form.bulk_discount_qty}+ → {form.bulk_discount_pct}% discount applied automatically</p>
                )}
              </div>

              {/* Stock & Visibility toggles */}
              <div className="flex flex-wrap gap-6 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div
                    onClick={() => setForm(p => ({ ...p, in_stock: !p.in_stock }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${form.in_stock ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.in_stock ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{form.in_stock ? 'In Stock' : 'Out of Stock'}</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div
                    onClick={() => setForm(p => ({ ...p, hidden: !p.hidden }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${form.hidden ? 'bg-red-400' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.hidden ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{form.hidden ? 'Hidden from Shop' : 'Visible in Shop'}</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div
                    onClick={() => setForm(p => ({ ...p, custom_text_enabled: !p.custom_text_enabled }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${form.custom_text_enabled ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.custom_text_enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{form.custom_text_enabled ? 'Secret Note: On' : 'Secret Note: Off'}</span>
                </label>
              </div>
              <div>
                <label className={LBL}>Description</label>
                <textarea value={form.description} onChange={f('description')} rows={4}
                  className={`${INP} resize-none`} placeholder="Full product description shown on product page…" />
              </div>
            </section>

            {/* ─ Images ─ */}
            <section className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.25em] text-gray-400 border-b border-gray-200 pb-2 font-semibold">Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ImgSlot
                  label={`Primary Image${!editId ? ' *' : ''}`}
                  file={imgFile} preview={preview} required={!editId}
                  onChange={e => { const file = e.target.files[0]; if (file) { setImgFile(file); setPreview(URL.createObjectURL(file)); } }}
                  onClear={() => { setImgFile(null); setPreview(''); }}
                />
                {[0, 1, 2].map(i => (
                  <ImgSlot key={i} label={`Image ${i + 2}`}
                    file={extraFiles[i]} preview={extraPreviews[i]} required={false}
                    onChange={e => { const file = e.target.files[0]; if (file) setExtraFile(i, file); }}
                    onClear={() => clearExtra(i)}
                  />
                ))}
              </div>
              <p className="text-gray-400 text-sm">Primary image is required. Extra images show as gallery thumbnails on the product page.</p>
            </section>

            {/* ─ Lists ─ */}
            <section className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.25em] text-gray-400 border-b border-gray-200 pb-2 font-semibold">Lists (comma-separated)</h4>
              {[
                ['Features ✓ checklist', 'features', 'Easy to use, No awkwardness, Made for couples'],
                ["What's Included • list", 'included', '48 premium cards, Velvet gift box, Story booklet'],
                ['How It Works  1. 2. 3. steps', 'how_it_works', 'Light a candle, Draw a card, Follow the prompt'],
              ].map(([l, k, ph]) => (
                <div key={k}>
                  <label className={LBL}>{l}</label>
                  <input value={form[k]} onChange={f(k)} placeholder={ph} className={INP} />
                </div>
              ))}
            </section>

            {/* ─ Quote Strip ─ */}
            <section className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.25em] text-gray-400 border-b border-gray-200 pb-2 font-semibold">Quote Strip (optional)</h4>
              <div>
                <label className={LBL}>Quote text</label>
                <textarea value={form.quote} onChange={f('quote')} rows={2}
                  className={`${INP} resize-none`} placeholder="For the nights that turn ordinary into unforgettable…" />
              </div>
              <div>
                <label className={LBL}>Quote label</label>
                <input value={form.quote_label} onChange={f('quote_label')} placeholder="e.g. A Secret Hour Promise" className={INP} />
              </div>
            </section>

            {/* ─ Upsell ─ */}
            <section className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.25em] text-gray-400 border-b border-gray-200 pb-2 font-semibold">Upsell — Complete Your Experience (optional)</h4>
              <div>
                <label className={LBL}>Upsell product</label>
                <select value={form.upsell_slug} onChange={f('upsell_slug')} className={INP}>
                  <option value="">— None —</option>
                  {products.filter(p => p.id !== editId).map(p => (
                    <option key={p.slug} value={p.slug}>{p.title}</option>
                  ))}
                </select>
              </div>
            </section>

            {/* ─ Variations ─ */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h4 className="text-xs uppercase tracking-[0.25em] text-gray-400 font-semibold">Variations (optional)</h4>
              </div>
              <p className="text-gray-400 text-sm">Enter name, combination, tagline, and price for each variation.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={varInput}
                  onChange={e => setVarInput(e.target.value)}
                  placeholder="Name (e.g. Midnight Oud)"
                  className={INP}
                />
                <input
                  type="text"
                  value={varDesc}
                  onChange={e => setVarDesc(e.target.value)}
                  placeholder="Combination (e.g. Oud + Vanilla)"
                  className={INP}
                />
                <input
                  type="text"
                  value={varTagline}
                  onChange={e => setVarTagline(e.target.value)}
                  placeholder="Tagline (e.g. A rich blend of oud and soft vanilla…)"
                  className={INP}
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={varPrice}
                    onChange={e => setVarPrice(e.target.value)}
                    placeholder="Price"
                    className={INP + ' flex-1'}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const name = varInput.trim();
                      const price = parseInt(varPrice) || 0;
                      const description = varDesc.trim();
                      const tagline = varTagline.trim();
                      if (name && !variations.find(x => x.name === name)) {
                        setVariations(prev => [...prev, { name, price, description, tagline }]);
                        setVarInput(''); setVarPrice(''); setVarDesc(''); setVarTagline('');
                      }
                    }}
                    className="bg-gray-900 text-white text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-lg hover:bg-black transition whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
              </div>
              {variations.length > 0 && (
                <div className="space-y-2">
                  {variations.map((v, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-700 leading-relaxed">
                        <span className="font-semibold">{v?.name ?? v}</span>
                        {v?.description ? <span className="text-gray-400"> · {v.description}</span> : ''}
                        {v?.price ? <span className="text-gray-500"> · Rs. {Number(v.price).toLocaleString()}</span> : ''}
                        {v?.tagline ? <p className="text-gray-400 mt-0.5 italic">{v.tagline}</p> : ''}
                      </div>
                      <button type="button" onClick={() => setVariations(prev => prev.filter((_, j) => j !== i))}
                        className="text-gray-300 hover:text-red-500 transition leading-none font-bold shrink-0 mt-0.5">×</button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ─ FAQ ─ */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h4 className="text-xs uppercase tracking-[0.25em] text-gray-400 font-semibold">FAQ (optional)</h4>
                <button type="button" onClick={addFaq}
                  className="text-xs uppercase tracking-[0.15em] text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-500 px-3 py-1.5 rounded-lg transition font-medium">
                  + Add Question
                </button>
              </div>
              {faq.length === 0 && <p className="text-gray-400 text-sm italic">No FAQ entries. Click "+ Add Question" to add one.</p>}
              {faq.map((row, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">Question {i + 1}</span>
                    <button type="button" onClick={() => removeFaq(i)} className="text-red-500 hover:text-red-700 text-xs font-medium transition">Remove</button>
                  </div>
                  <input value={row.q} onChange={e => editFaq(i, 'q', e.target.value)} placeholder="Question…"
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:border-gray-500 transition placeholder:text-gray-400" />
                  <textarea value={row.a} onChange={e => editFaq(i, 'a', e.target.value)} placeholder="Answer…" rows={2}
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg outline-none focus:border-gray-500 transition placeholder:text-gray-400 resize-none" />
                </div>
              ))}
            </section>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="bg-gray-900 text-white font-semibold text-xs uppercase tracking-[0.18em] px-8 py-3.5 rounded-lg hover:bg-black transition-all disabled:opacity-50">
                {saving ? 'Saving…' : editId ? 'Update Product' : 'Save Product'}
              </button>
              <button type="button" onClick={cancel}
                className="border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-500 text-xs uppercase tracking-[0.18em] px-6 py-3.5 rounded-lg transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product list */}
      <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
        {/* Desktop header */}
        <div className="hidden md:grid grid-cols-[32px_64px_1fr_100px_80px_200px] gap-x-4 px-5 py-3.5 border-b border-gray-200 bg-gray-50">
          <input type="checkbox" checked={allProdsSelected} onChange={toggleAllProds} className="accent-gray-800 mt-0.5 cursor-pointer" />
          {['', 'PRODUCT', 'CATEGORY', 'PRICE', 'ACTIONS'].map(h => (
            <span key={h} className="text-xs text-gray-500 uppercase tracking-[0.2em] font-semibold">{h}</span>
          ))}
        </div>
        {filtered.length === 0
          ? <p className="text-gray-400 text-sm italic text-center py-12">No products found.</p>
          : filtered.map(p => (
            <div key={p.id} className={`border-b border-gray-100 last:border-0 transition ${selectedProds.has(p.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>

              {/* Desktop row */}
              <div className="hidden md:grid grid-cols-[32px_64px_1fr_100px_80px_200px] gap-x-4 items-center px-5 py-4">
                <input type="checkbox" checked={selectedProds.has(p.id)} onChange={() => toggleOneProd(p.id)} className="accent-gray-800 cursor-pointer" />
                <div className="relative w-12 h-12 border border-gray-200 bg-gray-50 rounded-lg">
                  {p.img ? <Image src={p.img} alt="" fill className="object-contain" unoptimized />
                    : <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">📦</div>}
                </div>
                <div className="min-w-0">
                  <p className="text-gray-800 text-sm font-medium truncate">{p.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {p.in_stock === false && <span className="text-red-600 text-[10px] font-bold uppercase tracking-[0.1em] bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">Out of Stock</span>}
                    {p.hidden && <span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.1em] bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded">Hidden</span>}
                    {p.tag && <span className="text-blue-600 text-[10px] font-bold uppercase tracking-[0.1em]">{p.tag}</span>}
                  </div>
                </div>
                <span className="text-gray-500 text-sm">{p.category}</span>
                <span className="text-gray-900 text-sm font-semibold">{p.price}</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button onClick={() => quickToggle(p.id, 'in_stock', p.in_stock !== false)}
                    className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2.5 py-1.5 border rounded-lg transition ${p.in_stock !== false ? 'border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-600' : 'border-green-300 text-green-700 bg-green-50'}`}>
                    {p.in_stock !== false ? 'Stock ✓' : 'Restock'}
                  </button>
                  <button onClick={() => quickToggle(p.id, 'hidden', p.hidden)}
                    className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2.5 py-1.5 border rounded-lg transition ${!p.hidden ? 'border-gray-300 text-gray-500 hover:border-gray-500' : 'border-orange-300 text-orange-700 bg-orange-50'}`}>
                    {p.hidden ? 'Show' : 'Hide'}
                  </button>
                  <a href={`/product/${p.slug}?preview=1`} target="_blank" rel="noreferrer"
                    className="text-gray-600 hover:text-gray-900 text-[10px] uppercase tracking-[0.1em] border border-gray-300 hover:border-gray-500 px-2.5 py-1.5 rounded-lg transition font-medium">
                    View
                  </a>
                  <button onClick={() => startEdit(p)}
                    className="text-gray-600 hover:text-gray-900 text-[10px] uppercase tracking-[0.1em] border border-gray-300 hover:border-gray-500 px-2.5 py-1.5 rounded-lg transition font-medium">
                    Edit
                  </button>
                  <button onClick={() => del(p.id, p.title)}
                    className="text-red-500 hover:text-red-700 text-[10px] uppercase tracking-[0.1em] border border-red-200 hover:border-red-400 px-2.5 py-1.5 rounded-lg transition font-medium">
                    Del
                  </button>
                </div>
              </div>

              {/* Mobile card */}
              <div className="md:hidden px-4 py-3.5">
                <div className="flex items-center gap-3 mb-3">
                  <input type="checkbox" checked={selectedProds.has(p.id)} onChange={() => toggleOneProd(p.id)} className="accent-gray-800 cursor-pointer shrink-0" />
                  <div className="relative w-14 h-14 shrink-0 border border-gray-200 bg-gray-50 rounded-lg">
                    {p.img ? <Image src={p.img} alt="" fill className="object-contain" unoptimized />
                      : <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">📦</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm font-medium leading-snug">{p.title}</p>
                    <p className="text-gray-900 text-sm font-semibold mt-0.5">{p.price}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      {p.in_stock === false && <span className="text-red-600 text-[10px] font-bold uppercase bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">Out of Stock</span>}
                      {p.hidden && <span className="text-gray-500 text-[10px] font-bold uppercase bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded">Hidden</span>}
                      {p.tag && <span className="text-blue-600 text-[10px] font-bold uppercase">{p.tag}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => quickToggle(p.id, 'in_stock', p.in_stock !== false)}
                    className={`text-[10px] uppercase tracking-[0.1em] font-medium px-3 py-2 border rounded-lg transition ${p.in_stock !== false ? 'border-gray-300 text-gray-500' : 'border-green-300 text-green-700 bg-green-50'}`}>
                    {p.in_stock !== false ? 'Stock ✓' : 'Restock'}
                  </button>
                  <button onClick={() => quickToggle(p.id, 'hidden', p.hidden)}
                    className={`text-[10px] uppercase tracking-[0.1em] font-medium px-3 py-2 border rounded-lg transition ${!p.hidden ? 'border-gray-300 text-gray-500' : 'border-orange-300 text-orange-700 bg-orange-50'}`}>
                    {p.hidden ? 'Show' : 'Hide'}
                  </button>
                  <a href={`/product/${p.slug}?preview=1`} target="_blank" rel="noreferrer"
                    className="text-gray-600 text-[10px] uppercase tracking-[0.1em] border border-gray-300 px-3 py-2 rounded-lg transition font-medium">
                    View
                  </a>
                  <button onClick={() => startEdit(p)}
                    className="text-gray-600 text-[10px] uppercase tracking-[0.1em] border border-gray-300 px-3 py-2 rounded-lg transition font-medium">
                    Edit
                  </button>
                  <button onClick={() => del(p.id, p.title)}
                    className="text-red-500 text-[10px] uppercase tracking-[0.1em] border border-red-200 px-3 py-2 rounded-lg transition font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   REVIEWS TAB
═══════════════════════════════════════════ */
function ReviewsSection({ title, rows, onToggle, onDelete }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        {title}
        <span className="ml-2 text-sm font-normal text-gray-400">
          {rows.length} total · {rows.filter(r => !r.approved).length} pending
        </span>
      </h2>
      {rows.length === 0 ? (
        <p className="text-gray-400 text-sm italic py-6 text-center border border-dashed border-gray-200 rounded-xl">
          None yet.
        </p>
      ) : (
        <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
          {rows.map(r => (
            <div key={r.id} className="px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-gray-900 text-sm font-semibold">
                      {r.reviewer_name || r.name || 'Anonymous'}
                    </span>
                    {r.product_slug && (
                      <span className="text-gray-400 text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {r.product_slug}
                      </span>
                    )}
                    {r.location && (
                      <span className="text-gray-400 text-xs">{r.location}</span>
                    )}
                    {r.rating != null && (
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < r.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                        ))}
                      </div>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      r.approved
                        ? 'bg-green-50 text-green-700 border-green-300'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-300'
                    }`}>
                      {r.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{r.body}</p>
                  {r.email && (
                    <p className="text-gray-400 text-xs mt-1">{r.email}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-0.5">
                    {new Date(r.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onToggle(r.id, r.approved)}
                    className={`text-xs uppercase tracking-[0.12em] font-medium px-3 py-1.5 border rounded-lg transition ${
                      r.approved
                        ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
                        : 'border-green-300 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {r.approved ? 'Unpublish' : 'Approve'}
                  </button>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="text-xs uppercase tracking-[0.12em] font-medium px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewsTab() {
  const [testimonials,    setTestimonials]    = useState([]);
  const [productReviews,  setProductReviews]  = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [err,             setErr]             = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');

    const [{ data: tData, error: tErr }, { data: pData, error: pErr }] = await Promise.all([
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      supabase.from('product_reviews').select('*').order('created_at', { ascending: false }),
    ]);

    if (tErr) { setErr(tErr.message); setLoading(false); return; }
    if (pErr && pErr.code !== 'PGRST116') { setErr(pErr.message); setLoading(false); return; }

    setTestimonials(tData || []);
    setProductReviews(pData || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleTestimonial(id, approved) {
    await supabase.from('testimonials').update({ approved: !approved }).eq('id', id);
    setTestimonials(prev => prev.map(r => r.id === id ? { ...r, approved: !approved } : r));
  }

  async function deleteTestimonial(id) {
    if (!window.confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    setTestimonials(prev => prev.filter(r => r.id !== id));
  }

  async function toggleProductReview(id, approved) {
    await supabase.from('product_reviews').update({ approved: !approved }).eq('id', id);
    setProductReviews(prev => prev.map(r => r.id === id ? { ...r, approved: !approved } : r));
  }

  async function deleteProductReview(id) {
    if (!window.confirm('Delete this review?')) return;
    await supabase.from('product_reviews').delete().eq('id', id);
    setProductReviews(prev => prev.filter(r => r.id !== id));
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-1">Admin</p>
          <h1 className="text-4xl italic text-gray-900" style={serif}>Reviews</h1>
        </div>
        <button onClick={load} className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg transition">
          Refresh
        </button>
      </div>

      {err && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          <strong>Error:</strong> {err}
        </div>
      )}

      <ReviewsSection
        title="Testimonials"
        rows={testimonials}
        onToggle={toggleTestimonial}
        onDelete={deleteTestimonial}
      />

      <ReviewsSection
        title="Product Reviews"
        rows={productReviews}
        onToggle={toggleProductReview}
        onDelete={deleteProductReview}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   SETTINGS TAB (Promo Codes)
═══════════════════════════════════════════ */
function SettingsTab() {
  const [codes,   setCodes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState('');
  const [newPct,  setNewPct]  = useState('10');
  const [adding,  setAdding]  = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('promo_codes').select('*').order('created_at');
    setCodes(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addCode(e) {
    e.preventDefault();
    if (!newCode.trim()) return;
    setAdding(true);
    await supabase.from('promo_codes').insert({ code: newCode.trim().toUpperCase(), discount_pct: parseInt(newPct) || 10, active: true });
    setNewCode(''); setNewPct('10');
    load();
    setAdding(false);
  }

  async function toggleCode(id, active) {
    await supabase.from('promo_codes').update({ active: !active }).eq('id', id);
    setCodes(prev => prev.map(c => c.id === id ? { ...c, active: !active } : c));
  }

  async function deleteCode(id, code) {
    if (!window.confirm(`Delete promo code "${code}"?`)) return;
    await supabase.from('promo_codes').delete().eq('id', id);
    setCodes(prev => prev.filter(c => c.id !== id));
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-1">Admin</p>
        <h1 className="text-4xl italic text-gray-900" style={serif}>Settings</h1>
      </div>

      {/* Promo Codes */}
      <div className="border border-gray-200 bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6">
        <h2 className="text-xl italic text-gray-900" style={serif}>Promo Codes</h2>

        {/* Add new */}
        <form onSubmit={addCode} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className={LBL}>Code</label>
            <input value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())} required
              placeholder="e.g. SUMMER20" className={INP} />
          </div>
          <div className="w-28">
            <label className={LBL}>Discount %</label>
            <input type="number" min="1" max="100" value={newPct} onChange={e => setNewPct(e.target.value)} required className={INP} />
          </div>
          <button type="submit" disabled={adding}
            className="bg-gray-900 text-white font-semibold text-xs uppercase tracking-[0.18em] px-5 py-2.5 rounded-lg hover:bg-black transition-all disabled:opacity-50 h-[42px]">
            {adding ? 'Adding…' : '+ Add Code'}
          </button>
        </form>

        {/* Code list */}
        {codes.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No promo codes yet. Add one above.</p>
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_80px_160px] gap-x-4 px-5 py-3 border-b border-gray-200 bg-gray-50">
              {['CODE', 'DISCOUNT', 'STATUS', 'ACTIONS'].map(h => (
                <span key={h} className="text-xs text-gray-500 uppercase tracking-[0.2em] font-semibold">{h}</span>
              ))}
            </div>
            {codes.map(c => (
              <div key={c.id} className="grid grid-cols-[1fr_80px_80px_160px] gap-x-4 items-center px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                <span className="text-gray-900 font-bold tracking-wider text-sm">{c.code}</span>
                <span className="text-gray-700 text-sm font-semibold">{c.discount_pct}% off</span>
                <span className={`text-xs font-bold uppercase tracking-[0.1em] ${c.active ? 'text-green-700' : 'text-gray-400'}`}>
                  {c.active ? 'Active' : 'Off'}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleCode(c.id, c.active)}
                    className={`text-xs uppercase tracking-[0.12em] font-medium px-3 py-1.5 border rounded-lg transition ${c.active ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50' : 'border-green-300 text-green-700 hover:bg-green-50'}`}>
                    {c.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => deleteCode(c.id, c.code)}
                    className="text-xs uppercase tracking-[0.12em] font-medium px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-gray-400 text-xs">
          Active codes can be entered at checkout by customers. Run supabase-setup.sql to create the promo_codes table if not done yet.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROMO CODES TAB
═══════════════════════════════════════════ */
function PromoCodesTab() {
  const [codes,   setCodes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [code,    setCode]    = useState('');
  const [pct,     setPct]     = useState(10);
  const [saving,  setSaving]  = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
    setCodes(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    if (!code.trim()) return;
    setSaving(true);
    await supabase.from('promo_codes').insert({ code: code.trim().toUpperCase(), discount_pct: Number(pct), active: true });
    setCode(''); setPct(10);
    await load();
    setSaving(false);
  }

  async function toggle(id, active) {
    await supabase.from('promo_codes').update({ active: !active }).eq('id', id);
    setCodes(prev => prev.map(c => c.id === id ? { ...c, active: !active } : c));
  }

  async function remove(id) {
    if (!window.confirm('Delete this promo code?')) return;
    await supabase.from('promo_codes').delete().eq('id', id);
    setCodes(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-1">Admin</p>
        <h1 className="text-4xl italic text-gray-900" style={serif}>Promo Codes</h1>
      </div>

      <form onSubmit={add} className="border border-gray-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
        <p className="text-sm font-medium text-gray-700 uppercase tracking-[0.15em]">Create New Code</p>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className={LBL}>Promo Code</label>
            <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} required placeholder="e.g. SAVE10" className={INP} />
          </div>
          <div className="w-28">
            <label className={LBL}>Discount %</label>
            <input type="number" min={1} max={100} value={pct} onChange={e => setPct(e.target.value)} required className={INP} />
          </div>
          <button type="submit" disabled={saving}
            className="bg-gray-900 text-white text-xs uppercase tracking-[0.15em] px-5 py-2.5 rounded-lg hover:bg-black transition disabled:opacity-50 shrink-0">
            {saving ? 'Adding…' : 'Add Code'}
          </button>
        </div>
      </form>

      <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-[1fr_80px_80px_80px] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200">
          {['CODE', 'DISCOUNT', 'STATUS', 'ACTION'].map(h => (
            <span key={h} className="text-xs text-gray-500 uppercase tracking-[0.2em] font-semibold">{h}</span>
          ))}
        </div>
        {loading
          ? <Spinner />
          : codes.length === 0
            ? <p className="text-gray-400 text-sm italic text-center py-10">No promo codes yet.</p>
            : codes.map(c => (
              <div key={c.id} className="grid grid-cols-[1fr_80px_80px_80px] gap-3 items-center px-5 py-3.5 border-b border-gray-100 last:border-0">
                <span className="text-gray-900 font-mono font-bold text-sm">{c.code}</span>
                <span className="text-gray-700 text-sm">{c.discount_pct}%</span>
                <button onClick={() => toggle(c.id, c.active)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${c.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                  {c.active ? 'Active' : 'Off'}
                </button>
                <button onClick={() => remove(c.id)}
                  className="text-red-400 hover:text-red-600 text-xs uppercase tracking-[0.15em] transition font-medium">
                  Delete
                </button>
              </div>
            ))
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ABANDONED CARTS TAB
═══════════════════════════════════════════ */
function AbandonedCartsTab() {
  const [carts,   setCarts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setApiError('');
    try {
      const res  = await fetch('/api/abandoned-cart');
      const data = await res.json();
      if (!res.ok || data?.error) { setApiError(data?.error || `HTTP ${res.status}`); setCarts([]); }
      else setCarts(Array.isArray(data) ? data : []);
    } catch (err) { setApiError(err.message); setCarts([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function del(id) {
    if (!window.confirm('Delete this abandoned cart record?')) return;
    await fetch(`/api/abandoned-cart?id=${id}`, { method: 'DELETE' });
    setCarts(prev => prev.filter(c => c.id !== id));
  }

  function waFollowUp(cart) {
    const raw   = (cart.phone || '').replace(/\D/g, '');
    const phone = raw.startsWith('92') ? raw : raw.startsWith('0') ? '92' + raw.slice(1) : raw ? '92' + raw : '';
    if (!phone) return;
    const name = cart.name || 'there';
    const itemsList = (cart.items || []).map(i => `• ${i.title} x${i.qty}`).join('\n');
    const text = `Assalam o Alaikum ${name}!\n\nWe noticed you were checking out on SecretHour.pk but didn't complete your order.\n\nYour cart:\n${itemsList}\n\nTotal: Rs. ${(cart.total || 0).toLocaleString()}\n\nCan we help? We'd love to get your order to you. 😊\n\nSecretHour.pk`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-1">Admin</p>
          <h1 className="text-4xl italic text-gray-900" style={serif}>Abandoned Carts</h1>
        </div>
        <button onClick={load} className="text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-lg border border-gray-300 text-gray-500 hover:border-gray-500 bg-white transition">
          Refresh
        </button>
      </div>

      {loading ? <Spinner /> : apiError ? (
        <p className="text-red-500 text-sm py-10 text-center border border-dashed border-red-200 rounded-xl bg-red-50">
          API Error: {apiError}
        </p>
      ) : carts.length === 0 ? (
        <p className="text-gray-400 text-sm italic py-10 text-center border border-dashed border-gray-200 rounded-xl">
          No abandoned carts yet.
        </p>
      ) : (
        <div className="space-y-3">
          {carts.map(c => {
            const date = new Date(c.updated_at || c.created_at).toLocaleString('en-PK', {
              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
            });
            const cartItems = Array.isArray(c.items) ? c.items : [];
            return (
              <div key={c.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm hover:border-gray-300 transition">
                {/* Top row: name + status + actions */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="text-gray-900 text-sm font-semibold">{c.name || 'Anonymous'}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-full border ${c.status === 'converted' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                      {c.status}
                    </span>
                    {c.phone && c.status !== 'converted' && (
                      <button onClick={() => waFollowUp(c)}
                        className="text-xs font-medium px-3 py-1.5 border border-green-300 text-green-700 hover:bg-green-50 rounded-lg transition">
                        WA
                      </button>
                    )}
                    <button onClick={() => del(c.id)}
                      className="text-xs font-medium px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition">
                      Del
                    </button>
                  </div>
                </div>

                {/* Cart items */}
                {cartItems.length > 0 && (
                  <div className="mb-3 space-y-1.5">
                    <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] mb-1.5">Cart Items</p>
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                        {item.img && (
                          <div className="relative w-8 h-8 shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-200">
                            <Image src={item.img} alt={item.title || ''} fill className="object-cover" unoptimized />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 text-xs font-medium truncate">{item.title}</p>
                          {item.variation && <p className="text-orange-500 text-[10px]">{item.variation}</p>}
                        </div>
                        <span className="text-gray-400 text-xs shrink-0">×{item.qty}</span>
                        {item.price && <span className="text-gray-700 text-xs font-medium shrink-0">{item.price}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] mb-0.5">Email</p>
                    <p className="text-gray-700 break-all">{c.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] mb-0.5">Phone</p>
                    <p className="text-gray-700">{c.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] mb-0.5">City</p>
                    <p className="text-gray-700">{c.city || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] mb-0.5">Total</p>
                    <p className="text-gray-900 font-semibold">Rs. {(c.total || 0).toLocaleString()}</p>
                  </div>
                  {c.address && (
                    <div className="col-span-2 sm:col-span-4">
                      <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] mb-0.5">Address</p>
                      <p className="text-gray-700">{c.address}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SHARED
═══════════════════════════════════════════ */
function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN
═══════════════════════════════════════════ */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab,    setTab]    = useState('orders');

  useEffect(() => {
    if (sessionStorage.getItem('sh_admin') === 'true') setAuthed(true);
  }, []);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  const TABS = [
    { id: 'orders',    label: 'Orders' },
    { id: 'abandoned', label: 'Abandoned' },
    { id: 'products',  label: 'Products' },
    { id: 'reviews',   label: 'Reviews' },
    { id: 'promos',    label: 'Promos' },
    { id: 'settings',  label: 'Settings' },
    { id: 'dashboard', label: 'Dashboard' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center gap-6">
          <div className="flex items-center gap-2 shrink-0">
            <p className="text-gray-900 text-xs uppercase tracking-[0.35em] font-bold">Secret Hour</p>
            <span className="text-gray-300 hidden sm:block">·</span>
            <p className="text-gray-400 text-xs uppercase tracking-[0.2em] hidden sm:block">Admin</p>
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`text-xs uppercase tracking-[0.2em] px-4 py-2.5 border-b-2 font-medium transition whitespace-nowrap ${
                  tab === t.id ? 'text-gray-900 border-gray-900' : 'text-gray-400 hover:text-gray-700 border-transparent'
                }`}>
                {t.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => { sessionStorage.removeItem('sh_admin'); setAuthed(false); }}
            className="ml-auto text-gray-400 hover:text-gray-700 text-xs uppercase tracking-[0.2em] transition flex items-center gap-1.5 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {tab === 'orders'    && <OrdersTab />}
        {tab === 'abandoned' && <AbandonedCartsTab />}
        {tab === 'products'  && <ProductsTab />}
        {tab === 'reviews'   && <ReviewsTab />}
        {tab === 'promos'    && <PromoCodesTab />}
        {tab === 'settings'  && <SettingsTab />}
        {tab === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}
