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
      new Date(o.created_at).toLocaleDateString('en-PK'),
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

const WA_MSG = {
  pending:   (name, num) => `Assalamualaikum ${name}! 🌙\n\nAapka Secret Hour order *${num}* receive ho gaya hai. Hum jald hi confirm karenge.\n\nShukriya! 🖤\nSecretHour.pk`,
  confirmed: (name, num) => `Assalamualaikum ${name}! 🌙\n\nKhushi ki khabar! Aapka Secret Hour order *${num}* confirm ho gaya hai. Hum packaging shuru kar rahe hain.\n\nShukriya! 🖤\nSecretHour.pk`,
  shipped:   (name, num) => `Assalamualaikum ${name}! 🌙\n\nAapka Secret Hour order *${num}* ship ho gaya hai! 2-3 din mein aap receive kar lenge.\n\nTrack karne ke liye humse contact karein.\n\nShukriya! 🖤\nSecretHour.pk`,
  delivered: (name, num) => `Assalamualaikum ${name}! 🌙\n\nAapka Secret Hour order *${num}* deliver ho gaya! Umeed hai aapko pasand aaya hoga. 💕\n\nApna review zaroor share karein!\n\nShukriya! 🖤\nSecretHour.pk`,
  cancelled: (name, num) => `Assalamualaikum ${name}!\n\nAfsos ke saath, aapka Secret Hour order *${num}* cancel ho gaya hai. Kisi bhi sawaal ke liye humse rabta karein.\n\nShukriya!\nSecretHour.pk`,
};

function sendWhatsApp(order, status) {
  const raw   = (order.phone || '').replace(/\D/g, '');
  const phone = raw.startsWith('92') ? raw : raw.startsWith('0') ? '92' + raw.slice(1) : '92' + raw;
  const name  = `${order.first_name || ''} ${order.last_name || ''}`.trim();
  const num   = orderNum(order.id);
  const text  = WA_MSG[status]?.(name, num) || '';
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
}

const STATUS = {
  pending:   { label: 'Pending',   cls: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
  confirmed: { label: 'Confirmed', cls: 'bg-blue-50   text-blue-700   border-blue-300'   },
  shipped:   { label: 'Shipped',   cls: 'bg-purple-50 text-purple-700 border-purple-300' },
  delivered: { label: 'Delivered', cls: 'bg-green-50  text-green-700  border-green-300'  },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50    text-red-700    border-red-300'    },
};

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

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
              placeholder="admin@secrethour.pk" className={INP} />
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
function OrderDrawer({ order, items, onClose, onStatusChange, onCustomerFilter }) {
  const [status,    setStatus]    = useState(order?.status || 'pending');
  const [note,      setNote]      = useState(order?.notes  || '');
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => { setStatus(order?.status || 'pending'); setNote(order?.notes || ''); setNoteSaved(false); }, [order]);

  async function changeStatus(s) {
    setStatus(s);
    await supabase.from('orders').update({ status: s }).eq('id', order.id);
    onStatusChange(order.id, s);
  }

  async function saveNote() {
    await supabase.from('orders').update({ notes: note }).eq('id', order.id);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  }

  if (!order) return null;

  const name    = `${order.first_name || ''} ${order.last_name || ''}`.trim();
  const num     = orderNum(order.id);
  const payment = order.payment_method === 'bank' ? 'Bank Transfer' : 'Cash on Delivery';
  const custId  = `CID-${(order.email || order.phone || '').replace(/\W/g, '').slice(-6).toUpperCase()}`;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm z-50 flex flex-col overflow-y-auto bg-white shadow-2xl border-l border-gray-200">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-200">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-1">Order</p>
            <h2 className="text-3xl italic text-gray-900" style={serif}>{num}</h2>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-[0.15em]">{custId}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Customer details */}
        <div className="px-6 py-5 border-b border-gray-200 space-y-3">
          {[
            ['CUSTOMER', name],
            ['WHATSAPP', order.phone],
            ['EMAIL',    order.email],
            ['CITY',     order.city],
            ['PAYMENT',  payment],
            ['DATE',     new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })],
          ].map(([l, v]) => v ? (
            <div key={l} className="flex justify-between gap-4">
              <span className="text-gray-400 text-xs uppercase tracking-[0.2em] shrink-0">{l}</span>
              <span className="text-gray-800 text-sm text-right">{v}</span>
            </div>
          ) : null)}
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
                    <span className="text-gray-700 text-sm">{item.product_title} <span className="text-gray-400">× {item.quantity}</span></span>
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

        {/* Status update */}
        <div className="px-6 py-5 border-b border-gray-200">
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-4">UPDATE STATUS</p>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button key={s} onClick={() => changeStatus(s)}
                className={`text-xs uppercase tracking-[0.12em] font-medium px-3.5 py-2 border rounded-lg transition ${
                  status === s ? STATUS[s].cls : 'border-gray-300 text-gray-500 hover:text-gray-800 hover:border-gray-500 bg-white'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Notes */}
        <div className="px-6 py-5 border-b border-gray-200">
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-3">ADMIN NOTES</p>
          <textarea
            value={note}
            onChange={e => { setNote(e.target.value); setNoteSaved(false); }}
            rows={3}
            placeholder="Internal note (not visible to customer)…"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg outline-none focus:border-gray-500 transition placeholder:text-gray-400 resize-none"
          />
          <button onClick={saveNote}
            className="mt-2 text-xs uppercase tracking-[0.15em] font-medium px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-500 text-gray-600 hover:text-gray-900 transition">
            {noteSaved ? '✓ Saved' : 'Save Note'}
          </button>
        </div>

        {/* WhatsApp send */}
        <div className="px-6 py-5">
          <button
            onClick={() => sendWhatsApp(order, status)}
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
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════ */
function Dashboard() {
  const [stats,         setStats]         = useState({ total: 0, revenue: 0, pending: 0, deliveryRate: 0 });
  const [recent,        setRecent]        = useState([]);
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
          revenue:      orders.reduce((s, o) => s + (o.total || 0), 0),
          pending:      orders.filter(o => o.status === 'pending').length,
          deliveryRate: orders.length ? Math.round((delivered / orders.length) * 100) : 0,
        });
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
                  <span className="text-gray-400 text-sm">{o.city}</span>
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
  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [filter,        setFilter]        = useState('all');
  const [search,        setSearch]        = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [itemsMap,      setItemsMap]      = useState({});
  const [selected,      setSelected]      = useState(new Set());
  const [bulkStatus,    setBulkStatus]    = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
    setSelected(new Set());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function viewOrder(order) {
    setSelectedOrder(order);
    if (!itemsMap[order.id]) {
      const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id);
      setItemsMap(m => ({ ...m, [order.id]: data || [] }));
    }
  }

  function handleStatusChange(id, s) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: s } : o));
    if (selectedOrder?.id === id) setSelectedOrder(o => ({ ...o, status: s }));
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

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-1">Admin</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-4xl italic text-gray-900" style={serif}>Order Management</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => exportCSV(selected.size > 0 ? orders.filter(o => selected.has(o.id)) : visible)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-xs uppercase tracking-[0.2em] border border-gray-300 px-3.5 py-2 rounded-lg hover:bg-gray-50 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export {selected.size > 0 ? `(${selected.size})` : 'All'}
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
          { label: 'Revenue',       value: `Rs. ${orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString()}` },
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
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border border-gray-200 bg-white rounded-xl overflow-x-auto shadow-sm">
        <div className="grid grid-cols-[32px_100px_1fr_120px_90px_100px_100px_110px_80px] gap-x-3 px-5 py-3.5 border-b border-gray-200 bg-gray-50">
          <input type="checkbox" checked={allSelected} onChange={toggleAll}
            className="accent-gray-800 mt-0.5 cursor-pointer" />
          {['ORDER', 'CUSTOMER', 'WHATSAPP', 'PAYMENT', 'TOTAL', 'DATE', 'STATUS', 'ACTION'].map(h => (
            <span key={h} className="text-xs text-gray-500 uppercase tracking-[0.2em] font-semibold">{h}</span>
          ))}
        </div>

        {visible.length === 0
          ? <p className="text-gray-400 text-sm italic text-center py-12">No orders found.</p>
          : visible.map(o => (
            <div key={o.id}
              className={`grid grid-cols-[32px_100px_1fr_120px_90px_100px_100px_110px_80px] gap-x-3 items-center px-5 py-4 border-b border-gray-100 last:border-0 transition cursor-pointer ${selected.has(o.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              onClick={() => toggleOne(o.id)}>
              <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggleOne(o.id)}
                onClick={e => e.stopPropagation()}
                className="accent-gray-800 mt-0.5 cursor-pointer" />
              <span className="text-gray-900 text-sm font-bold">{orderNum(o.id)}</span>
              <div className="min-w-0">
                <p className="text-gray-800 text-sm truncate font-medium">{o.first_name} {o.last_name}</p>
                <p className="text-gray-400 text-xs truncate">{o.city}</p>
                {o.notes && <p className="text-blue-500 text-xs truncate">📝 {o.notes}</p>}
              </div>
              <span className="text-gray-500 text-sm">{o.phone}</span>
              <span className={`text-xs px-2 py-1 rounded border font-medium ${o.payment_method === 'bank' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                {o.payment_method === 'bank' ? 'Bank' : 'COD'}
              </span>
              <span className="text-gray-900 text-sm font-semibold">Rs. {o.total?.toLocaleString()}</span>
              <span className="text-gray-500 text-sm">
                {new Date(o.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: '2-digit' })}
              </span>
              <span className={`text-xs uppercase tracking-[0.12em] px-2 py-1 border rounded-lg text-center ${STATUS[o.status]?.cls || STATUS.pending.cls}`}>
                {STATUS[o.status]?.label || o.status}
              </span>
              <button onClick={e => { e.stopPropagation(); viewOrder(o); }}
                className="text-gray-400 hover:text-gray-900 text-xs uppercase tracking-[0.2em] transition font-medium text-center">
                View →
              </button>
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
  in_stock: true, hidden: false,
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
  const [saving,        setSaving]        = useState(false);
  const [editId,        setEditId]        = useState(null);
  const [search,        setSearch]        = useState('');

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
      in_stock:     p.in_stock !== false,
      hidden:       p.hidden === true,
    });
    const imgs = p.images?.length ? p.images : [p.img].filter(Boolean);
    setPreview(imgs[0] || '');
    setExtraPreviews([imgs[1] || '', imgs[2] || '', imgs[3] || '']);
    setExtraFiles([null, null, null]);
    setImgFile(null);
    setFaq(p.faq?.length ? p.faq : []);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancel() {
    setShowForm(false); setEditId(null);
    setForm(EMPTY); setImgFile(null); setPreview('');
    setExtraFiles([null, null, null]); setExtraPreviews(['', '', '']);
    setFaq([]);
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
        in_stock:      form.in_stock,
        hidden:        form.hidden,
        faq:           faq.filter(r => r.q.trim()),
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
    load();
  }

  async function quickToggle(id, field, value) {
    await supabase.from('products').update({ [field]: !value }).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: !value } : p));
  }

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

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
        <p className="text-gray-400 text-sm mt-1">{products.length} products total</p>
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
        <div className="grid grid-cols-[64px_1fr_100px_80px_200px] gap-x-4 px-5 py-3.5 border-b border-gray-200 bg-gray-50">
          {['', 'PRODUCT', 'CATEGORY', 'PRICE', 'ACTIONS'].map(h => (
            <span key={h} className="text-xs text-gray-500 uppercase tracking-[0.2em] font-semibold">{h}</span>
          ))}
        </div>
        {filtered.length === 0
          ? <p className="text-gray-400 text-sm italic text-center py-12">No products found.</p>
          : filtered.map(p => (
            <div key={p.id} className="grid grid-cols-[64px_1fr_100px_80px_200px] gap-x-4 items-center px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
              <div className="relative w-12 h-12 border border-gray-200 bg-gray-50 rounded-lg">
                {p.img
                  ? <Image src={p.img} alt="" fill className="object-contain" unoptimized />
                  : <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">📦</div>
                }
              </div>
              <div className="min-w-0">
                <p className="text-gray-800 text-sm font-medium truncate">{p.title}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {p.in_stock === false && (
                    <span className="text-red-600 text-[10px] font-bold uppercase tracking-[0.1em] bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">Out of Stock</span>
                  )}
                  {p.hidden && (
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.1em] bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded">Hidden</span>
                  )}
                  {p.tag && (
                    <span className="text-blue-600 text-[10px] font-bold uppercase tracking-[0.1em]">{p.tag}</span>
                  )}
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
          ))
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   REVIEWS TAB
═══════════════════════════════════════════ */
function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('product_reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setReviews(data || []); setLoading(false); });
  }, []);

  async function toggleApprove(id, approved) {
    await supabase.from('product_reviews').update({ approved: !approved }).eq('id', id);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: !approved } : r));
  }

  async function deleteReview(id) {
    if (!window.confirm('Delete this review?')) return;
    await supabase.from('product_reviews').delete().eq('id', id);
    setReviews(prev => prev.filter(r => r.id !== id));
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-1">Admin</p>
        <h1 className="text-4xl italic text-gray-900" style={serif}>Reviews</h1>
        <p className="text-gray-400 text-sm mt-1">{reviews.length} total · {reviews.filter(r => !r.approved).length} pending approval</p>
      </div>
      {reviews.length === 0 ? (
        <p className="text-gray-400 text-sm italic">No reviews yet. Create the product_reviews table in Supabase to enable this feature.</p>
      ) : (
        <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
          {reviews.map(r => (
            <div key={r.id} className="px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-gray-900 text-sm font-semibold">{r.reviewer_name}</span>
                    <span className="text-gray-400 text-xs">{r.product_slug}</span>
                    <div className="flex">{[...Array(5)].map((_, i) => <span key={i} className={`text-sm ${i < r.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>)}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${r.approved ? 'bg-green-50 text-green-700 border-green-300' : 'bg-yellow-50 text-yellow-700 border-yellow-300'}`}>
                      {r.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{r.body}</p>
                  <p className="text-gray-400 text-xs mt-1">{new Date(r.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleApprove(r.id, r.approved)}
                    className={`text-xs uppercase tracking-[0.12em] font-medium px-3 py-1.5 border rounded-lg transition ${r.approved ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50' : 'border-green-300 text-green-700 hover:bg-green-50'}`}>
                    {r.approved ? 'Unpublish' : 'Approve'}
                  </button>
                  <button onClick={() => deleteReview(r.id)}
                    className="text-xs uppercase tracking-[0.12em] font-medium px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition">
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
    { id: 'products',  label: 'Products' },
    { id: 'reviews',   label: 'Reviews' },
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
        {tab === 'products'  && <ProductsTab />}
        {tab === 'reviews'   && <ReviewsTab />}
        {tab === 'settings'  && <SettingsTab />}
        {tab === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}
