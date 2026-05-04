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

/* ── order display number from UUID ── */
function orderNum(id) {
  let h = 0;
  for (const c of (id || '').replace(/-/g, '')) h = ((h << 5) - h + parseInt(c, 16)) | 0;
  return `SH-${Math.abs(h % 9000) + 1000}`;
}

/* ── WhatsApp message templates ── */
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

/* ── status config ── */
const STATUS = {
  pending:   { label: 'Pending',   cls: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50' },
  confirmed: { label: 'Confirmed', cls: 'bg-blue-900/40   text-blue-300   border-blue-700/50'   },
  shipped:   { label: 'Shipped',   cls: 'bg-purple-900/40 text-purple-300 border-purple-700/50' },
  delivered: { label: 'Delivered', cls: 'bg-green-900/40  text-green-300  border-green-700/50'  },
  cancelled: { label: 'Cancelled', cls: 'bg-red-900/40    text-red-300    border-red-700/50'    },
};

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

/* shared input / label classes */
const INP = 'w-full px-3.5 py-2.5 bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-700 transition placeholder:text-slate-600';
const LBL = 'block text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1.5';

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-900">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8 space-y-2">
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.35em]">Secret Hour</p>
          <h1 className="text-3xl italic text-slate-100" style={serif}>Admin Panel</h1>
          <p className="text-slate-500 text-sm">Sign in to manage your store</p>
        </div>

        <form onSubmit={submit} className="space-y-4 border border-slate-700 p-8 bg-slate-800 rounded-xl shadow-2xl shadow-black/40">
          <div>
            <label className={LBL}>Email</label>
            <input type="email" value={email} autoFocus required
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="admin@secrethour.pk"
              className={INP} />
          </div>

          <div>
            <label className={LBL}>Password</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={pass} required
                onChange={e => { setPass(e.target.value); setError(''); }}
                placeholder="••••••••••"
                className={`${INP} pr-10`} />
              <button type="button" onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d={show
                      ? 'M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
                      : 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'} />
                </svg>
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-900/20 border border-red-700/40 px-3 py-2 rounded">{error}</p>
          )}

          <button type="submit"
            className="w-full bg-slate-100 text-slate-900 font-semibold text-[11px] uppercase tracking-[0.2em] py-3.5 rounded hover:bg-white transition-all mt-2">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ORDER DRAWER (right slide-in panel)
═══════════════════════════════════════════ */
function OrderDrawer({ order, items, onClose, onStatusChange }) {
  const [status, setStatus] = useState(order?.status || 'pending');

  useEffect(() => { setStatus(order?.status || 'pending'); }, [order]);

  async function changeStatus(s) {
    setStatus(s);
    await supabase.from('orders').update({ status: s }).eq('id', order.id);
    onStatusChange(order.id, s);
  }

  if (!order) return null;

  const name = `${order.first_name || ''} ${order.last_name || ''}`.trim();
  const num  = orderNum(order.id);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm z-50 flex flex-col overflow-y-auto bg-slate-800 shadow-2xl shadow-black/60 border-l border-slate-700">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-700">
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] mb-1">Order</p>
            <h2 className="text-3xl italic text-slate-100" style={serif}>{num}</h2>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-300 transition mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Customer details */}
        <div className="px-6 py-5 border-b border-slate-700 space-y-3">
          {[
            ['CUSTOMER', name],
            ['WHATSAPP', order.phone],
            ['EMAIL',    order.email],
            ['CITY',     order.city],
            ['DATE',     new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })],
          ].map(([l, v]) => v ? (
            <div key={l} className="flex justify-between gap-4">
              <span className="text-slate-600 text-[10px] uppercase tracking-[0.2em] shrink-0">{l}</span>
              <span className="text-slate-300 text-sm text-right">{v}</span>
            </div>
          ) : null)}
        </div>

        {/* Items */}
        {items?.length > 0 && (
          <div className="px-6 py-5 border-b border-slate-700">
            <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em] mb-4">ITEMS</p>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {item.product_img && (
                      <div className="relative w-8 h-8 shrink-0 bg-slate-700 border border-slate-600 rounded">
                        <Image src={item.product_img} alt="" fill className="object-contain" unoptimized />
                      </div>
                    )}
                    <span className="text-slate-300 text-sm">{item.product_title} <span className="text-slate-600">× {item.quantity}</span></span>
                  </div>
                  <span className="text-slate-300 text-sm shrink-0">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-slate-700">
              <span className="italic text-slate-200 text-base" style={serif}>Total</span>
              <span className="text-slate-100 font-semibold text-base" style={serif}>Rs. {order.total?.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Status update */}
        <div className="px-6 py-5 border-b border-slate-700">
          <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em] mb-4">UPDATE STATUS</p>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button key={s} onClick={() => changeStatus(s)}
                className={`text-[10px] uppercase tracking-[0.12em] font-medium px-3.5 py-2 border rounded transition ${
                  status === s
                    ? STATUS[s].cls
                    : 'border-slate-600 text-slate-500 hover:text-slate-300 hover:border-slate-500 bg-slate-700/30'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* WhatsApp send */}
        <div className="px-6 py-5">
          <button
            onClick={() => sendWhatsApp(order, status)}
            className="w-full flex items-center justify-center gap-2.5 bg-green-700 text-white text-[11px] uppercase tracking-[0.25em] py-4 rounded hover:bg-green-600 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Send WhatsApp Update
          </button>
          <p className="text-slate-600 text-[10px] text-center mt-2 uppercase tracking-[0.15em]">
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
        <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] mb-1">Admin</p>
        <h1 className="text-4xl italic text-slate-100" style={serif}>Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders',  value: stats.total },
          { label: 'Revenue',       value: `Rs. ${stats.revenue.toLocaleString()}` },
          { label: 'Pending',       value: stats.pending },
          { label: 'Delivery Rate', value: `${stats.deliveryRate}%` },
        ].map(s => (
          <div key={s.label} className="border border-slate-700 p-5 bg-slate-800 rounded-lg">
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] mb-2">{s.label}</p>
            <p className="text-3xl text-slate-100 font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl italic text-slate-200 mb-4" style={serif}>Recent Orders</h2>
        {recent.length === 0
          ? <p className="text-slate-500 text-sm italic">No orders yet.</p>
          : (
            <div className="border border-slate-700 bg-slate-800 rounded-lg overflow-hidden">
              {recent.map(o => (
                <div key={o.id} className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-slate-700 last:border-0 hover:bg-slate-700/40 transition">
                  <span className="text-slate-100 text-sm font-semibold w-20 shrink-0">{orderNum(o.id)}</span>
                  <span className="text-slate-300 text-sm">{o.first_name} {o.last_name}</span>
                  <span className="text-slate-500 text-xs">{o.city}</span>
                  <span className="text-slate-200 text-sm font-medium ml-auto">Rs. {o.total?.toLocaleString()}</span>
                  <span className={`text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 border rounded ${STATUS[o.status]?.cls || STATUS.pending.cls}`}>
                    {STATUS[o.status]?.label || o.status}
                  </span>
                  <button onClick={() => viewOrder(o)}
                    className="text-slate-500 hover:text-slate-200 text-[10px] uppercase tracking-[0.2em] transition">
                    View
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

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
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

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] mb-1">Admin</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-4xl italic text-slate-100" style={serif}>Order Management</h1>
          <button onClick={load}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-200 text-[10px] uppercase tracking-[0.2em] border border-slate-600 px-3 py-2 rounded hover:bg-slate-700/50 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh
          </button>
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
          <div key={s.label} className="border border-slate-700 px-4 py-4 bg-slate-800 rounded-lg">
            <p className="text-slate-500 text-[9px] uppercase tracking-[0.2em] mb-1">{s.label}</p>
            <p className="text-2xl text-slate-100 font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID, customer, WhatsApp..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded outline-none focus:border-slate-400 transition placeholder:text-slate-600" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="bg-slate-800 border border-slate-600 text-slate-300 text-sm px-3 py-2.5 rounded outline-none focus:border-slate-400 cursor-pointer transition">
          <option value="all">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS[s].label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="border border-slate-700 bg-slate-800 rounded-lg overflow-x-auto">
        <div className="grid grid-cols-[100px_1fr_130px_80px_110px_110px_110px_70px] gap-x-4 px-5 py-3 border-b border-slate-700 bg-slate-900/60">
          {['ORDER', 'CUSTOMER', 'WHATSAPP', 'ITEMS', 'TOTAL', 'DATE', 'STATUS', 'ACTIONS'].map(h => (
            <span key={h} className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-medium">{h}</span>
          ))}
        </div>

        {visible.length === 0
          ? <p className="text-slate-500 text-sm italic text-center py-12">No orders found.</p>
          : visible.map(o => (
            <div key={o.id}
              className="grid grid-cols-[100px_1fr_130px_80px_110px_110px_110px_70px] gap-x-4 items-center px-5 py-3.5 border-b border-slate-700 last:border-0 hover:bg-slate-700/40 transition">
              <span className="text-slate-100 text-sm font-semibold">{orderNum(o.id)}</span>
              <div className="min-w-0">
                <p className="text-slate-300 text-sm truncate">{o.first_name} {o.last_name}</p>
                <p className="text-slate-500 text-xs truncate">{o.city}</p>
              </div>
              <span className="text-slate-500 text-xs">{o.phone}</span>
              <span className="text-slate-600 text-xs text-center">— items</span>
              <span className="text-slate-200 text-sm font-medium">Rs. {o.total?.toLocaleString()}</span>
              <span className="text-slate-500 text-xs">
                {new Date(o.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: '2-digit' })}
              </span>
              <span className={`text-[10px] uppercase tracking-[0.12em] px-2 py-1 border rounded text-center ${STATUS[o.status]?.cls || STATUS.pending.cls}`}>
                {STATUS[o.status]?.label || o.status}
              </span>
              <button onClick={() => viewOrder(o)}
                className="text-slate-500 hover:text-slate-200 text-[10px] uppercase tracking-[0.2em] transition text-center">
                View
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
  quote: '', quote_label: '', upsell_slug: '',
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
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="flex items-center gap-3">
        {preview ? (
          <div className="relative w-16 h-16 border border-slate-600 bg-slate-700/50 rounded shrink-0 group">
            <Image src={preview} alt="" fill className="object-contain" unoptimized />
            <button type="button" onClick={onClear}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              ×
            </button>
          </div>
        ) : (
          <label className="cursor-pointer flex items-center gap-2 border border-dashed border-slate-600 hover:border-slate-400 px-3 py-2.5 rounded transition text-sm text-slate-500 hover:text-slate-300">
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

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] mb-1">Admin</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-4xl italic text-slate-100" style={serif}>Products</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                className="pl-8 pr-3 py-2 bg-slate-800 border border-slate-600 text-slate-300 text-sm rounded outline-none focus:border-slate-400 transition placeholder:text-slate-600 w-40" />
            </div>
            {!showForm && (
              <button onClick={() => setShowForm(true)}
                className="bg-slate-100 text-slate-900 font-semibold text-[10px] uppercase tracking-[0.18em] px-5 py-2.5 rounded hover:bg-white transition-all">
                + Add Product
              </button>
            )}
          </div>
        </div>
        <p className="text-slate-500 text-xs mt-1">{products.length} products total</p>
      </div>

      {/* Form */}
      {showForm && (
        <div className="border border-slate-700 p-6 md:p-8 bg-slate-800 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl italic text-slate-100" style={serif}>{editId ? 'Edit Product' : 'New Product'}</h3>
            <button onClick={cancel} className="text-slate-600 hover:text-slate-300 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={save} className="space-y-8">

            {/* ─ Basic Info ─ */}
            <section className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.25em] text-slate-500 border-b border-slate-700 pb-2">Basic Info</h4>
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
              </div>
              <div>
                <label className={LBL}>Description</label>
                <textarea value={form.description} onChange={f('description')} rows={4}
                  className={`${INP} resize-none`} placeholder="Full product description shown on product page…" />
              </div>
            </section>

            {/* ─ Images ─ */}
            <section className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.25em] text-slate-500 border-b border-slate-700 pb-2">Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ImgSlot
                  label={`Primary Image${!editId ? ' *' : ''}`}
                  file={imgFile} preview={preview}
                  required={!editId}
                  onChange={e => { const file = e.target.files[0]; if (file) { setImgFile(file); setPreview(URL.createObjectURL(file)); } }}
                  onClear={() => { setImgFile(null); setPreview(''); }}
                />
                {[0, 1, 2].map(i => (
                  <ImgSlot key={i}
                    label={`Image ${i + 2}`}
                    file={extraFiles[i]} preview={extraPreviews[i]}
                    required={false}
                    onChange={e => { const file = e.target.files[0]; if (file) setExtraFile(i, file); }}
                    onClear={() => clearExtra(i)}
                  />
                ))}
              </div>
              <p className="text-slate-600 text-xs">Primary image is required. Extra images show as gallery thumbnails on the product page.</p>
            </section>

            {/* ─ Lists ─ */}
            <section className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.25em] text-slate-500 border-b border-slate-700 pb-2">Lists (comma-separated)</h4>
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
              <h4 className="text-[10px] uppercase tracking-[0.25em] text-slate-500 border-b border-slate-700 pb-2">Quote Strip (optional)</h4>
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
              <h4 className="text-[10px] uppercase tracking-[0.25em] text-slate-500 border-b border-slate-700 pb-2">Upsell — Complete Your Experience (optional)</h4>
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
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <h4 className="text-[10px] uppercase tracking-[0.25em] text-slate-500">FAQ (optional)</h4>
                <button type="button" onClick={addFaq}
                  className="text-[10px] uppercase tracking-[0.15em] text-slate-400 hover:text-slate-100 border border-slate-600 hover:border-slate-400 px-3 py-1.5 rounded transition">
                  + Add Question
                </button>
              </div>
              {faq.length === 0 && (
                <p className="text-slate-600 text-sm italic">No FAQ entries. Click "+ Add Question" to add one.</p>
              )}
              {faq.map((row, i) => (
                <div key={i} className="border border-slate-700 rounded-lg p-4 space-y-3 bg-slate-900/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Question {i + 1}</span>
                    <button type="button" onClick={() => removeFaq(i)}
                      className="text-red-500 hover:text-red-400 text-[10px] transition">Remove</button>
                  </div>
                  <input value={row.q} onChange={e => editFaq(i, 'q', e.target.value)}
                    placeholder="Question…"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded outline-none focus:border-slate-400 transition placeholder:text-slate-600" />
                  <textarea value={row.a} onChange={e => editFaq(i, 'a', e.target.value)}
                    placeholder="Answer…" rows={2}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 text-slate-300 text-sm rounded outline-none focus:border-slate-400 transition placeholder:text-slate-600 resize-none" />
                </div>
              ))}
            </section>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="bg-slate-100 text-slate-900 font-semibold text-[10px] uppercase tracking-[0.18em] px-8 py-3 rounded hover:bg-white transition-all disabled:opacity-50">
                {saving ? 'Saving…' : editId ? 'Update Product' : 'Save Product'}
              </button>
              <button type="button" onClick={cancel}
                className="border border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-400 text-[10px] uppercase tracking-[0.18em] px-6 py-3 rounded transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product list */}
      <div className="border border-slate-700 bg-slate-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[64px_1fr_100px_80px_140px] gap-x-4 px-5 py-3 border-b border-slate-700 bg-slate-900/60">
          {['', 'PRODUCT', 'CATEGORY', 'PRICE', 'ACTIONS'].map(h => (
            <span key={h} className="text-[9px] text-slate-500 uppercase tracking-[0.25em]">{h}</span>
          ))}
        </div>
        {filtered.length === 0
          ? <p className="text-slate-500 text-sm italic text-center py-12">No products found.</p>
          : filtered.map(p => (
            <div key={p.id} className="grid grid-cols-[64px_1fr_100px_80px_140px] gap-x-4 items-center px-5 py-3.5 border-b border-slate-700 last:border-0 hover:bg-slate-700/40 transition">
              <div className="relative w-12 h-12 border border-slate-600 bg-slate-700/50 rounded">
                {p.img
                  ? <Image src={p.img} alt="" fill className="object-contain" unoptimized />
                  : <div className="w-full h-full flex items-center justify-center text-slate-600 text-lg">📦</div>
                }
              </div>
              <div className="min-w-0">
                <p className="text-slate-300 text-sm truncate">{p.title}</p>
                {p.stock_note && <p className="text-slate-600 text-xs truncate">{p.stock_note}</p>}
              </div>
              <span className="text-slate-500 text-xs">{p.category}</span>
              <span className="text-slate-200 text-sm font-medium">{p.price}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(p)}
                  className="text-slate-400 hover:text-slate-100 text-[10px] uppercase tracking-[0.15em] border border-slate-600 hover:border-slate-400 px-3 py-1.5 rounded transition">
                  Edit
                </button>
                <button onClick={() => del(p.id, p.title)}
                  className="text-red-500 hover:text-red-400 text-[10px] uppercase tracking-[0.15em] border border-red-800/50 hover:border-red-600/50 px-3 py-1.5 rounded transition">
                  Delete
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
   SHARED
═══════════════════════════════════════════ */
function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-slate-700 border-t-slate-400 rounded-full animate-spin" />
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
    { id: 'dashboard', label: 'Dashboard' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center gap-6">
          <div className="flex items-center gap-2 shrink-0">
            <p className="text-slate-200 text-[10px] uppercase tracking-[0.35em] font-semibold">Secret Hour</p>
            <span className="text-slate-600 hidden sm:block">·</span>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] hidden sm:block">Admin</p>
          </div>
          <nav className="flex items-center gap-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 border-b-2 transition ${
                  tab === t.id ? 'text-white border-white' : 'text-slate-500 hover:text-slate-300 border-transparent'
                }`}>
                {t.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => { sessionStorage.removeItem('sh_admin'); setAuthed(false); }}
            className="ml-auto text-slate-500 hover:text-slate-300 text-[10px] uppercase tracking-[0.2em] transition flex items-center gap-1.5 shrink-0">
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
        {tab === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}
