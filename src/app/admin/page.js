'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

const STATUS_COLORS = {
  pending:   'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  confirmed: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  shipped:   'bg-purple-500/20 text-purple-300 border-purple-500/40',
  delivered: 'bg-green-500/20 text-green-300 border-green-500/40',
  cancelled: 'bg-red-500/20 text-red-300 border-red-500/40',
};

const inputCls = 'w-full px-3 py-2.5 bg-black/40 border border-gold-border/40 text-cream/80 text-sm outline-none focus:border-gold-muted transition-colors placeholder:text-cream/25';
const labelCls = 'block text-[10px] uppercase tracking-[0.18em] text-cream/45 mb-1.5';

/* ─────────────────────────────────────────────
   LOGIN
───────────────────────────────────────────── */
function Login({ onLogin }) {
  const [pass, setPass]   = useState('');
  const [error, setError] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (pass === ADMIN_PASS) {
      sessionStorage.setItem('sh_admin', 'true');
      onLogin();
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen bg-sh-bg flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(at top, hsl(350 60% 6%), hsl(20 5% 3%) 60%)' }}>
      <form onSubmit={submit} className="w-full max-w-sm space-y-6 border border-gold-border/40 p-8 bg-black/50">
        <div className="text-center space-y-2">
          <p className="text-gold text-[10px] uppercase tracking-[0.35em]">Secret Hour</p>
          <h1 className="text-2xl italic text-cream" style={serif}>Admin Panel</h1>
        </div>
        <div>
          <label className={labelCls}>Password</label>
          <input
            type="password"
            value={pass}
            onChange={e => { setPass(e.target.value); setError(false); }}
            className={inputCls}
            autoFocus
          />
          {error && <p className="text-red-400 text-xs mt-2">Incorrect password.</p>}
        </div>
        <button type="submit"
          className="w-full bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] uppercase tracking-[0.2em] py-3 btn-glow transition-all">
          Enter
        </button>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────── */
function Dashboard() {
  const [stats,  setStats]  = useState({ total: 0, revenue: 0, pending: 0, today: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (orders) {
        const todayStr = new Date().toDateString();
        setStats({
          total:   orders.length,
          revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
          pending: orders.filter(o => o.status === 'pending').length,
          today:   orders.filter(o => new Date(o.created_at).toDateString() === todayStr).length,
        });
        setRecent(orders.slice(0, 6));
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders',  value: stats.total },
          { label: 'Revenue (PKR)', value: `Rs. ${stats.revenue.toLocaleString()}` },
          { label: 'Pending',       value: stats.pending },
          { label: 'Today',         value: stats.today },
        ].map(s => (
          <div key={s.label} className="border border-gold-border/30 p-5 bg-sh-card/30">
            <p className="text-cream/40 text-[10px] uppercase tracking-[0.2em] mb-2">{s.label}</p>
            <p className="text-2xl md:text-3xl text-gold" style={serif}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="text-cream italic text-lg mb-4" style={serif}>Recent Orders</h2>
        {recent.length === 0
          ? <p className="text-cream/40 text-sm italic">No orders yet.</p>
          : (
            <div className="border border-gold-border/30 divide-y divide-gold-border/20 overflow-x-auto">
              {recent.map(o => (
                <div key={o.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm min-w-0">
                  <span className="text-cream/35 text-[10px] font-mono shrink-0">{o.id.slice(0, 8)}</span>
                  <span className="text-cream shrink-0">{o.first_name} {o.last_name}</span>
                  <span className="text-cream/50 text-xs shrink-0">{o.city}</span>
                  <span className="text-gold ml-auto shrink-0">Rs. {o.total?.toLocaleString()}</span>
                  <span className={`text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 rounded border shrink-0 ${STATUS_COLORS[o.status] || STATUS_COLORS.pending}`}>
                    {o.status}
                  </span>
                  <span className="text-cream/30 text-[10px] shrink-0">
                    {new Date(o.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCTS TAB
───────────────────────────────────────────── */
const EMPTY_FORM = {
  slug: '', title: '', subtitle: '', category: '', tagline: '',
  numeric_price: '', stock_note: '', description: '',
  features: '', included: '', how_it_works: '',
};

function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [imgFile,  setImgFile]  = useState(null);
  const [preview,  setPreview]  = useState('');
  const [saving,   setSaving]   = useState(false);
  const [editId,   setEditId]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function field(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })); }

  function handleImg(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function startEdit(p) {
    setEditId(p.id);
    setForm({
      slug:         p.slug,
      title:        p.title,
      subtitle:     p.subtitle || '',
      category:     p.category || '',
      tagline:      p.tagline || '',
      numeric_price: String(p.numeric_price || ''),
      stock_note:   p.stock_note || '',
      description:  p.description || '',
      features:     (p.features || []).join(', '),
      included:     (p.included || []).join(', '),
      how_it_works: (p.how_it_works || []).join(', '),
    });
    setPreview(p.img || '');
    setImgFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelForm() {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setImgFile(null);
    setPreview('');
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    let imgUrl = preview; // keep existing if editing without new image

    if (imgFile) {
      const ext  = imgFile.name.split('.').pop();
      const path = `${Date.now()}-${form.slug.replace(/[^a-z0-9]/gi, '-')}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('product-images')
        .upload(path, imgFile, { upsert: true });
      if (upErr) { alert('Image upload failed: ' + upErr.message); setSaving(false); return; }
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
      imgUrl = urlData.publicUrl;
    }

    const payload = {
      slug:          form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      title:         form.title.trim(),
      subtitle:      form.subtitle.trim(),
      category:      form.category.trim(),
      tagline:       form.tagline.trim(),
      price:         `Rs. ${parseInt(form.numeric_price).toLocaleString()}`,
      numeric_price: parseInt(form.numeric_price) || 0,
      stock_note:    form.stock_note.trim(),
      img:           imgUrl,
      images:        imgUrl ? [imgUrl] : [],
      description:   form.description.trim(),
      features:      form.features.split(',').map(s => s.trim()).filter(Boolean),
      included:      form.included.split(',').map(s => s.trim()).filter(Boolean),
      how_it_works:  form.how_it_works.split(',').map(s => s.trim()).filter(Boolean),
      faq:           [],
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from('products').update(payload).eq('id', editId));
    } else {
      ({ error } = await supabase.from('products').insert(payload));
    }

    if (error) {
      alert('Save failed: ' + error.message);
    } else {
      cancelForm();
      load();
    }
    setSaving(false);
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`"${title}" delete karna chahte hain?`)) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-cream italic text-lg" style={serif}>Products ({products.length})</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="bg-burgundy border border-gold-muted text-gold-btn-text text-[10px] uppercase tracking-[0.18em] px-5 py-2.5 btn-glow transition-all">
            + Add Product
          </button>
        )}
      </div>

      {/* ── FORM ── */}
      {showForm && (
        <form onSubmit={handleSave} className="border border-gold-border/40 p-6 md:p-8 space-y-5 bg-sh-card/20">
          <div className="flex items-center justify-between">
            <h3 className="text-cream italic text-lg" style={serif}>{editId ? 'Edit Product' : 'New Product'}</h3>
            <button type="button" onClick={cancelForm} className="text-cream/40 hover:text-cream text-sm transition-colors">✕ Cancel</button>
          </div>

          {/* Image upload */}
          <div>
            <label className={labelCls}>Product Image {!editId && '*'}</label>
            <input type="file" accept="image/*" onChange={handleImg} className="text-cream/60 text-sm file:mr-3 file:bg-sh-card file:border file:border-gold-border/40 file:text-cream/70 file:text-xs file:px-3 file:py-1.5 file:cursor-pointer" required={!editId} />
            {preview && (
              <div className="mt-3 relative w-24 h-24 border border-gold-border/30 bg-sh-bg">
                <Image src={preview} alt="" fill className="object-contain" unoptimized />
              </div>
            )}
          </div>

          {/* Basic fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['Slug (URL key)', 'slug', 'e.g. my-product', true],
              ['Title', 'title', 'Product title', true],
              ['Subtitle', 'subtitle', 'Short tagline', false],
              ['Category', 'category', 'e.g. Card Game', false],
              ['Tagline', 'tagline', 'Small label above title', false],
              ['Price in PKR (numbers only)', 'numeric_price', 'e.g. 3499', true],
              ['Stock Note', 'stock_note', 'e.g. Limited stock available', false],
            ].map(([lbl, key, ph, req]) => (
              <div key={key}>
                <label className={labelCls}>{lbl}{req && ' *'}</label>
                <input type={key === 'numeric_price' ? 'number' : 'text'} value={form[key]} onChange={field(key)}
                  placeholder={ph} required={req}
                  className={inputCls} />
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={field('description')} rows={3}
              className={`${inputCls} resize-none`} placeholder="Product description..." />
          </div>

          {/* Comma-separated fields */}
          {[
            ['Features (comma-separated)', 'features', 'Easy to use, No awkwardness, ...'],
            ["What's Included (comma-separated)", 'included', '48 cards, Gift box, ...'],
            ['How It Works (comma-separated steps)', 'how_it_works', 'Step 1, Step 2, ...'],
          ].map(([lbl, key, ph]) => (
            <div key={key}>
              <label className={labelCls}>{lbl}</label>
              <input type="text" value={form[key]} onChange={field(key)} placeholder={ph} className={inputCls} />
            </div>
          ))}

          <button type="submit" disabled={saving}
            className="bg-burgundy border border-gold-muted text-gold-btn-text text-[10px] uppercase tracking-[0.18em] px-8 py-3 btn-glow transition-all disabled:opacity-50">
            {saving ? 'Saving…' : editId ? 'Update Product' : 'Save Product'}
          </button>
        </form>
      )}

      {/* ── PRODUCT LIST ── */}
      {products.length === 0
        ? <p className="text-cream/40 text-sm italic">No products yet. Add your first product above.</p>
        : (
          <div className="space-y-2">
            {products.map(p => (
              <div key={p.id} className="border border-gold-border/25 flex items-center gap-4 p-3 bg-sh-card/20 hover:bg-sh-card/30 transition-colors">
                {p.img && (
                  <div className="relative w-14 h-14 shrink-0 bg-sh-bg border border-gold-border/20">
                    <Image src={p.img} alt={p.title} fill className="object-contain" unoptimized />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-cream text-sm truncate">{p.title}</p>
                  <p className="text-gold/70 text-xs mt-0.5">{p.price} <span className="text-cream/30">·</span> {p.category}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => startEdit(p)}
                    className="text-gold/60 hover:text-gold text-[10px] uppercase tracking-[0.15em] border border-gold/20 hover:border-gold/50 px-3 py-1.5 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id, p.title)}
                    className="text-red-400/60 hover:text-red-400 text-[10px] uppercase tracking-[0.15em] border border-red-500/20 hover:border-red-400/50 px-3 py-1.5 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

/* ─────────────────────────────────────────────
   ORDERS TAB
───────────────────────────────────────────── */
function OrdersTab() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [itemsMap, setItemsMap] = useState({});
  const [filter,   setFilter]   = useState('all');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    })();
  }, []);

  async function toggleExpand(id) {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!itemsMap[id]) {
      const { data } = await supabase.from('order_items').select('*').eq('order_id', id);
      setItemsMap(m => ({ ...m, [id]: data || [] }));
    }
  }

  async function updateStatus(id, status) {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-cream italic text-lg" style={serif}>Orders ({orders.length})</h2>
        <div className="flex items-center gap-1 flex-wrap">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 border transition-colors ${
                filter === s
                  ? 'border-gold text-gold'
                  : 'border-gold-border/30 text-cream/40 hover:text-cream/70'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0
        ? <p className="text-cream/40 text-sm italic">No orders found.</p>
        : (
          <div className="space-y-2">
            {filtered.map(o => (
              <div key={o.id} className="border border-gold-border/25 bg-sh-card/20">
                {/* Row header */}
                <button onClick={() => toggleExpand(o.id)}
                  className="w-full flex flex-wrap items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors">
                  <span className="text-cream/35 text-[10px] font-mono">{o.id.slice(0, 8)}</span>
                  <span className="text-cream text-sm">{o.first_name} {o.last_name}</span>
                  <span className="text-cream/50 text-xs">{o.city}</span>
                  <span className="text-cream/40 text-xs">{o.payment_method?.toUpperCase()}</span>
                  <span className="text-gold text-sm ml-auto">Rs. {o.total?.toLocaleString()}</span>
                  <span className={`text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 rounded border ${STATUS_COLORS[o.status] || STATUS_COLORS.pending}`}>
                    {o.status}
                  </span>
                  <span className="text-cream/30 text-[10px]">
                    {new Date(o.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    className={`text-gold/40 transition-transform ${expanded === o.id ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Expanded details */}
                {expanded === o.id && (
                  <div className="border-t border-gold-border/20 px-4 py-5 space-y-5">
                    {/* Shipping info */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 text-sm">
                      {[
                        ['Email',   o.email],
                        ['Phone',   o.phone],
                        ['Address', o.address],
                        ['City',    o.city],
                        ['Payment', o.payment_method?.toUpperCase()],
                        ['Subtotal', `Rs. ${o.subtotal?.toLocaleString()}`],
                      ].map(([l, v]) => v ? (
                        <div key={l}>
                          <p className="text-cream/35 text-[10px] uppercase tracking-[0.15em]">{l}</p>
                          <p className="text-cream/80 mt-0.5 break-all">{v}</p>
                        </div>
                      ) : null)}
                    </div>

                    {/* Order items */}
                    {(itemsMap[o.id] || []).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-cream/35 text-[10px] uppercase tracking-[0.18em]">Items</p>
                        {itemsMap[o.id].map(item => (
                          <div key={item.id} className="flex items-center gap-3 border border-gold-border/20 p-2.5">
                            {item.product_img && (
                              <div className="relative w-10 h-10 shrink-0 bg-sh-bg">
                                <Image src={item.product_img} alt="" fill className="object-contain" unoptimized />
                              </div>
                            )}
                            <span className="text-cream/75 text-sm flex-1">{item.product_title}</span>
                            <span className="text-cream/45 text-xs">×{item.quantity}</span>
                            <span className="text-gold text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Status update */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <label className="text-cream/35 text-[10px] uppercase tracking-[0.18em]">Update Status:</label>
                      <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                        className="bg-sh-bg border border-gold-border/40 text-cream/80 text-sm px-3 py-2 outline-none focus:border-gold-muted cursor-pointer">
                        {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHARED
───────────────────────────────────────────── */
function Spinner() {
  return <p className="text-cream/40 text-sm italic py-8 animate-pulse">Loading…</p>;
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab,    setTab]    = useState('dashboard');

  useEffect(() => {
    if (sessionStorage.getItem('sh_admin') === 'true') setAuthed(true);
  }, []);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  const TABS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products',  label: 'Products' },
    { id: 'orders',    label: 'Orders' },
  ];

  return (
    <div className="min-h-screen bg-sh-bg text-cream">
      {/* Header */}
      <header className="border-b border-gold-border/30 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center gap-6">
          <div className="flex items-center gap-2 shrink-0">
            <p className="text-gold text-[10px] uppercase tracking-[0.3em]">Secret Hour</p>
            <span className="text-gold-border/40">·</span>
            <p className="text-cream/50 text-[10px] uppercase tracking-[0.2em]">Admin</p>
          </div>
          <nav className="flex items-center gap-1 flex-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-colors border-b-2 ${
                  tab === t.id
                    ? 'text-gold border-gold'
                    : 'text-cream/45 hover:text-cream/80 border-transparent'
                }`}>
                {t.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => { sessionStorage.removeItem('sh_admin'); setAuthed(false); }}
            className="text-cream/30 hover:text-cream/60 text-[10px] uppercase tracking-[0.2em] transition-colors shrink-0">
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'products'  && <ProductsTab />}
        {tab === 'orders'    && <OrdersTab />}
      </main>
    </div>
  );
}
