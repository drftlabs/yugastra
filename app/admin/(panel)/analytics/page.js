import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { inr } from '@/lib/data';
import Preview from '@/components/admin/Preview';
export const metadata = { title: 'Analytics' };
const ist = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : '—');
function Bars({ rows, money }) {
  const max = Math.max(1, ...rows.map((r) => r.v));
  return <div className="an-bars">{rows.map((r) => <div key={r.k} className="an-bar" title={`${r.k}: ${money ? inr(r.v) : r.v}`}><i style={{ height: `${Math.max(2, (r.v / max) * 100)}%` }} /><small>{r.k.slice(8)}</small></div>)}</div>;
}
function List({ rows, empty = 'No data yet' }) {
  if (!rows.length) return <p style={{ color: 'var(--muted)', fontSize: 13 }}>{empty}</p>;
  const max = Math.max(1, ...rows.map((r) => r.v));
  return <div className="an-list">{rows.map((r) => <div key={r.k} className="an-li"><span className="an-fill" style={{ width: `${(r.v / max) * 100}%` }} /><span className="an-k">{r.k}</span><b>{r.v}</b></div>)}</div>;
}
const top = (m, n = 8) => [...m.entries()].map(([k, v]) => ({ k, v })).sort((a, b) => b.v - a.v).slice(0, n);
export default async function Analytics({ searchParams }) {
  const { db } = await requireAdmin('analytics'); if (!db) return <Preview />;
  const days = [7, 30, 90].includes(Number(searchParams.days)) ? Number(searchParams.days) : 30;
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const [{ data: ordAll }, pvRes] = await Promise.all([
    db.from('orders').select('order_number,status,total,email,phone,payment_method,items,created_at,city,state').order('created_at', { ascending: false }).limit(5000),
    db.from('page_views').select('visitor,path,ref,device,created_at').gte('created_at', since).limit(50000),
  ]);
  const pv = pvRes.data || []; const noPv = !!pvRes.error;
  const good = (ordAll || []).filter((o) => o.status !== 'pending_payment' && o.status !== 'cancelled');
  const ord = good.filter((o) => o.created_at >= since);
  const rev = ord.reduce((a, o) => a + Number(o.total), 0);
  // customers & repeat rate (lifetime)
  const byCust = new Map(); good.forEach((o) => { const k = (o.email || o.phone || '').toLowerCase(); if (k) byCust.set(k, (byCust.get(k) || 0) + 1); });
  const custs = byCust.size, repeat = [...byCust.values()].filter((n) => n > 1).length;
  const newInRange = new Set(ord.map((o) => (o.email || o.phone || '').toLowerCase())); let returning = 0; newInRange.forEach((k) => { if ((byCust.get(k) || 0) > 1) returning++; });
  // per-day
  const dayKeys = Array.from({ length: Math.min(days, 30) }, (_, i) => ist(Date.now() - (Math.min(days, 30) - 1 - i) * 864e5));
  const od = new Map(dayKeys.map((k) => [k, 0])), rd = new Map(dayKeys.map((k) => [k, 0])), vd = new Map(dayKeys.map((k) => [k, new Set()]));
  ord.forEach((o) => { const k = ist(o.created_at); if (od.has(k)) { od.set(k, od.get(k) + 1); rd.set(k, rd.get(k) + Number(o.total)); } });
  pv.forEach((p) => { const k = ist(p.created_at); if (vd.has(k)) vd.get(k).add(p.visitor); });
  // visitors
  const visitors = new Set(pv.map((p) => p.visitor)); const vc = new Map(); pv.forEach((p) => vc.set(p.visitor, (vc.get(p.visitor) || 0) + 1));
  const retVis = [...vc.values()].filter((n) => n > 1).length;
  const prodViewers = new Set(pv.filter((p) => /\/products\//.test(p.path)).map((p) => p.visitor));
  const pages = new Map(), refs = new Map(), dev = new Map();
  pv.forEach((p) => { const k = p.path.replace(/^\/hi/, '') || '/'; pages.set(k, (pages.get(k) || 0) + 1); refs.set(p.ref || 'Direct', (refs.get(p.ref || 'Direct') || 0) + 1); dev.set(p.device || 'desktop', (dev.get(p.device || 'desktop') || 0) + 1); });
  // products sold, payment, status, places
  const sold = new Map(); ord.forEach((o) => (o.items || []).forEach((i) => sold.set(i.name, (sold.get(i.name) || 0) + (i.qty || 1))));
  const pm = new Map(); ord.forEach((o) => pm.set(o.payment_method || '—', (pm.get(o.payment_method || '—') || 0) + 1));
  const st = new Map(); (ordAll || []).filter((o) => o.created_at >= since).forEach((o) => st.set(o.status.replace('_', ' '), (st.get(o.status.replace('_', ' ')) || 0) + 1));
  const city = new Map(); ord.forEach((o) => { const k = o.city || o.state; if (k) city.set(k, (city.get(k) || 0) + 1); });
  const T = ({ l, v, s }) => <div className="stat"><span>{l}</span><b>{v}</b>{s && <small className="an-s">{s}</small>}</div>;
  return (<>
    <h1>Analytics</h1>
    <div className="tabs"><Link className="on" href="/admin/analytics">Overview</Link><Link href="/admin/analytics/traffic">Traffic &amp; funnel</Link></div>
    <div className="tabs">{[7, 30, 90].map((d) => <Link key={d} className={days === d ? 'on' : ''} href={`/admin/analytics?days=${d}`}>Last {d} days</Link>)}</div>
    <div className="cards">
      <T l="Orders" v={ord.length} s={`${inr(rev)} revenue`} />
      <T l="Avg. order value" v={inr(ord.length ? Math.round(rev / ord.length) : 0)} />
      <T l="Visitors" v={noPv ? '—' : visitors.size} s={noPv ? 'Run supabase/analytics.sql' : `${pv.length} page views`} />
      <T l="Conversion" v={noPv ? '—' : pct(ord.length, visitors.size)} s="orders ÷ visitors" />
      <T l="Customers (all time)" v={custs} s={`${repeat} repeat · ${pct(repeat, custs)}`} />
      <T l="Returning buyers" v={returning} s={`of ${newInRange.size} buyers in this range`} />
      {!noPv && <T l="Returning visitors" v={retVis} s={pct(retVis, visitors.size)} />}
      {!noPv && <T l="Viewed a watch" v={prodViewers.size} s={pct(prodViewers.size, visitors.size)} />}
    </div>
    {noPv && <div className="box" style={{ marginBottom: 20 }}><b>Visitor tracking is not set up yet.</b> <span style={{ color: 'var(--muted)' }}>Run <code>supabase/analytics.sql</code> once in the Supabase SQL editor. Order figures below already work.</span></div>}
    <div className="an-grid">
      <div className="box"><div className="eyebrow">Orders per day{days > 30 ? ' (last 30)' : ''}</div><Bars rows={[...od].map(([k, v]) => ({ k, v }))} /></div>
      <div className="box"><div className="eyebrow">Revenue per day</div><Bars money rows={[...rd].map(([k, v]) => ({ k, v }))} /></div>
      {!noPv && <div className="box"><div className="eyebrow">Visitors per day</div><Bars rows={[...vd].map(([k, s]) => ({ k, v: s.size }))} /></div>}
      <div className="box"><div className="eyebrow">Best-selling watches</div><List rows={top(sold)} empty="No orders in this range" /></div>
      {!noPv && <div className="box"><div className="eyebrow">Top pages</div><List rows={top(pages, 10)} /></div>}
      {!noPv && <div className="box"><div className="eyebrow">Where visitors come from</div><List rows={top(refs)} /></div>}
      {!noPv && <div className="box"><div className="eyebrow">Phone vs desktop</div><List rows={top(dev)} /></div>}
      <div className="box"><div className="eyebrow">Payment method</div><List rows={top(pm)} empty="No orders" /></div>
      <div className="box"><div className="eyebrow">Order status</div><List rows={top(st)} empty="No orders" /></div>
      <div className="box"><div className="eyebrow">Top cities</div><List rows={top(city)} empty="No orders" /></div>
    </div></>);
}
