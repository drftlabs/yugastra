import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { inr } from '@/lib/data';
import Preview from '@/components/admin/Preview';
export const metadata = { title: 'Traffic' };
const IST = 19800000;
const T = (t) => new Date(t).getTime() + IST;
const hourOf = (t) => new Date(T(t)).getUTCHours();
const dayOf = (t) => new Date(T(t)).toISOString().slice(0, 10);
const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : '—');
const fmtT = (s) => (!s ? '—' : s < 60 ? `${Math.round(s)}s` : `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`);
const norm = (p) => { const x = (p || '/').replace(/^\/hi(?=\/|$)/, '') || '/'; return x.length > 1 ? x.replace(/\/$/, '') : x; };
const NOT_BOUGHT = ['pending_payment', 'otp_pending', 'cancelled', 'failed', 'refunded'];
const PAY = { online: 'Prepaid (online)', cod: 'Cash on delivery', advance: 'COD with advance' };
const chanOf = (ref, med) => {
  const r = (ref || '').toLowerCase(); if (!r) return 'Direct';
  if (/instagram|^ig$/.test(r)) return 'Instagram'; if (/facebook|^fb$|^meta$|fb\.|messenger/.test(r)) return 'Facebook';
  if (/google|^g\.co/.test(r)) return 'Google'; if (/whatsapp|wa\.me/.test(r)) return 'WhatsApp'; if (/youtube|youtu\.be/.test(r)) return 'YouTube';
  if (/mail|newsletter|resend/.test(r + (med || '').toLowerCase())) return 'Email'; return 'Other websites';
};
const isPaid = (med) => /cpc|paid|ppc|cpm|ads|social_paid/.test((med || '').toLowerCase());
async function all(q, max = 60) {
  const out = [];
  for (let i = 0; i < max; i++) {
    const { data, error } = await q().range(i * 1000, i * 1000 + 999);
    if (error) return { data: out, error: out.length ? null : error };
    out.push(...(data || [])); if (!data || data.length < 1000) break;
  }
  return { data: out, error: null };
}
const top = (m, n = 10) => [...m.entries()].map(([k, v]) => ({ k, v })).sort((a, b) => b.v - a.v).slice(0, n);
const inc = (m, k, by = 1) => m.set(k, (m.get(k) || 0) + by);
function Bars({ rows, money }) {
  const max = Math.max(1, ...rows.map((r) => r.v));
  return <div className="an-bars">{rows.map((r) => <div key={r.k} className="an-bar" title={`${r.t || r.k}: ${money ? inr(r.v) : r.v}`}><i style={{ height: `${Math.max(2, (r.v / max) * 100)}%` }} /><small>{r.l}</small></div>)}</div>;
}
function List({ rows, empty = 'No data yet' }) {
  if (!rows.length) return <p style={{ color: 'var(--muted)', fontSize: 13 }}>{empty}</p>;
  const max = Math.max(1, ...rows.map((r) => r.v));
  return <div className="an-list">{rows.map((r) => <div key={r.k} className="an-li"><span className="an-fill" style={{ width: `${(r.v / max) * 100}%` }} /><span className="an-k">{r.k}</span><b>{r.v}</b></div>)}</div>;
}
function Tbl({ head, rows, empty = 'No data yet' }) {
  if (!rows.length) return <p style={{ color: 'var(--muted)', fontSize: 13 }}>{empty}</p>;
  return <div className="an-tw"><table className="an-tbl"><thead><tr>{head.map((h, i) => <th key={h} className={i ? 'n' : ''}>{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={j ? 'n' : ''}>{c}</td>)}</tr>)}</tbody></table></div>;
}
export default async function Traffic({ searchParams }) {
  const { db } = await requireAdmin('analytics'); if (!db) return <Preview />;
  const days = [1, 7, 30, 90].includes(Number(searchParams.days)) ? Number(searchParams.days) : 30;
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const FULL = 'id,visitor,session,pid,path,ref,device,medium,campaign,city,country,landing,dur,created_at', BASE = 'id,visitor,path,ref,device,created_at';
  let pvRes = await all(() => db.from('page_views').select(FULL).gte('created_at', since).order('id'));
  let v2 = true; if (pvRes.error) { v2 = false; pvRes = await all(() => db.from('page_views').select(BASE).gte('created_at', since).order('id')); }
  const [evRes, ordRes0] = await Promise.all([
    all(() => db.from('site_events').select('name,path,visitor,created_at').in('name', ['add_to_cart', 'begin_checkout']).gte('created_at', since).order('id')),
    all(() => db.from('orders').select('order_number,status,total,payment_method,items,created_at,city,visitor').gte('created_at', since).order('created_at')),
  ]);
  let ordRes = ordRes0; if (ordRes0.error) ordRes = await all(() => db.from('orders').select('order_number,status,total,payment_method,items,created_at,city').gte('created_at', since).order('created_at'));
  const pv = pvRes.data, evs = evRes.error ? [] : evRes.data, noEv = !!evRes.error || !v2;
  const orders = ordRes.data.filter((o) => o.status !== 'cancelled');
  const bought = orders.filter((o) => !NOT_BOUGHT.includes(o.status));
  const rev = bought.reduce((a, o) => a + Number(o.total || 0), 0);
  const noPv = !!pvRes.error && !pv.length;

  // visitors, sessions, first touch
  const visitors = new Set(), first = new Map(), sess = new Map(), vSess = new Map();
  const sk = (p) => p.session || `${p.visitor}|${dayOf(p.created_at)}`;
  pv.forEach((p) => {
    visitors.add(p.visitor);
    if (!first.has(p.visitor)) first.set(p.visitor, p);
    const k = sk(p); let s = sess.get(k);
    if (!s) { s = { v: p.visitor, n: 0, dur: 0, p0: p, dev: p.device }; sess.set(k, s); if (!vSess.has(p.visitor)) vSess.set(p.visitor, new Set()); vSess.get(p.visitor).add(k); }
    s.n++; s.dur += Number(p.dur || 0);
  });
  const sessions = [...sess.values()];
  const withDur = sessions.filter((s) => s.dur > 0);
  const avgTime = withDur.length ? withDur.reduce((a, s) => a + s.dur, 0) / withDur.length : 0;
  const bounce = sessions.filter((s) => s.n === 1).length;
  const retVis = [...vSess.values()].filter((x) => x.size > 1).length;

  // funnel
  const prodV = new Set(pv.filter((p) => /^\/products\//.test(norm(p.path))).map((p) => p.visitor));
  const cartEv = evs.filter((e) => e.name === 'add_to_cart'), chkEv = evs.filter((e) => e.name === 'begin_checkout');
  const cartV = new Set(cartEv.map((e) => e.visitor));
  const chkV = new Set([...chkEv.map((e) => e.visitor), ...pv.filter((p) => norm(p.path) === '/checkout').map((p) => p.visitor)]);
  const prepaid = bought.filter((o) => o.payment_method === 'online'), cod = bought.filter((o) => o.payment_method === 'cod');
  const funnel = [
    ['Visitors', visitors.size, 'visitors'], ['Viewed a watch', prodV.size, 'visitors'], ['Added to cart', cartV.size, 'visitors'], ['Reached checkout', chkV.size, 'visitors'],
    ['Order placed (incl. unconfirmed)', orders.length, 'orders'], ['Purchased (paid or COD confirmed)', bought.length, 'orders'],
  ];
  const fmax = Math.max(1, funnel[0][1]);

  // payment types
  const pmRows = new Map(); orders.forEach((o) => { const k = o.payment_method || 'other'; const r = pmRows.get(k) || { p: 0, b: 0, rev: 0 }; r.p++; if (!NOT_BOUGHT.includes(o.status)) { r.b++; r.rev += Number(o.total || 0); } pmRows.set(k, r); });

  // hour / day
  const hrV = Array.from({ length: 24 }, () => new Set()), hrP = Array(24).fill(0);
  pv.forEach((p) => { const h = hourOf(p.created_at); hrP[h]++; hrV[h].add(p.visitor); });
  const nDays = Math.max(1, days === 1 ? 1 : Math.min(days, 90));
  const dkeys = Array.from({ length: nDays }, (_, i) => dayOf(Date.now() - (nDays - 1 - i) * 864e5));
  const dV = new Map(dkeys.map((k) => [k, new Set()])), dP = new Map(dkeys.map((k) => [k, 0])), dO = new Map(dkeys.map((k) => [k, 0]));
  pv.forEach((p) => { const k = dayOf(p.created_at); if (dP.has(k)) { dP.set(k, dP.get(k) + 1); dV.get(k).add(p.visitor); } });
  bought.forEach((o) => { const k = dayOf(o.created_at); if (dO.has(k)) dO.set(k, dO.get(k) + 1); });

  // attribution: purchased orders matched to a tracked visitor
  const buyer = new Map(); bought.forEach((o) => { if (o.visitor) inc(buyer, o.visitor); });
  const matched = [...buyer.values()].reduce((a, b) => a + b, 0);
  const ordersOf = (set) => { let n = 0; set.forEach((v) => { n += buyer.get(v) || 0; }); return n; };
  const group = (keyFn) => { const m = new Map(); visitors.forEach((v) => { const k = keyFn(first.get(v)); if (!m.has(k)) m.set(k, new Set()); m.get(k).add(v); }); return m; };
  const chanG = group((p) => chanOf(p.ref, p.medium)), devG = group((p) => p.device || 'desktop');
  const paidG = group((p) => (isPaid(p.medium) ? 'Paid' : 'Organic / direct'));
  const attrRow = (name, set) => { const c = [...set].filter((v) => cartV.has(v)).length; const o = ordersOf(set); return [name, set.size, c, o, pct(o, set.size)]; };
  const srcCount = new Map(), campCount = new Map(); visitors.forEach((v) => { const p = first.get(v); inc(srcCount, p.ref || 'Direct'); if (p.campaign) inc(campCount, p.campaign); });
  const devSess = new Map(); sessions.forEach((s) => inc(devSess, s.dev || 'desktop'));

  // cities / countries
  const cityV = new Map(), countryV = new Map(); visitors.forEach((v) => { const p = first.get(v); if (p.city) inc(cityV, p.city); if (p.country) inc(countryV, p.country); });
  const cityO = new Map(); bought.forEach((o) => { if (o.city) inc(cityO, o.city.trim().toLowerCase()); });
  const cityKeys = new Map(); cityV.forEach((n, c) => cityKeys.set(c.toLowerCase(), c)); cityO.forEach((n, c) => { if (!cityKeys.has(c)) cityKeys.set(c, c.replace(/\b\w/g, (m) => m.toUpperCase())); });
  const cityRows = [...cityKeys].map(([k, name]) => [name, cityV.get(name) || 0, cityO.get(k) || 0]).sort((a, b) => b[1] + b[2] * 5 - (a[1] + a[2] * 5)).slice(0, 15).map(([n, v, o]) => [n, v, o]);

  // pages
  const pg = new Map();
  pv.forEach((p) => { const k = norm(p.path); let r = pg.get(k); if (!r) { r = { v: new Set(), n: 0, d: 0, dn: 0 }; pg.set(k, r); } r.n++; r.v.add(p.visitor); if (p.dur) { r.d += Number(p.dur); r.dn++; } });
  const atc = new Map(); cartEv.forEach((e) => inc(atc, norm(e.path)));
  const sold = new Map(); bought.forEach((o) => (o.items || []).forEach((i) => inc(sold, `/products/${i.slug}`, i.qty || 1)));
  const pageRows = [...pg].sort((a, b) => b[1].n - a[1].n).slice(0, 15).map(([k, r]) => {
    const o = ordersOf(r.v); const prod = k.startsWith('/products/');
    return [k, r.n, r.v.size, r.dn ? fmtT(r.d / r.dn) : '—', prod ? atc.get(k) || 0 : '—', prod ? sold.get(k) || 0 : '—', o, pct(o, r.v.size)];
  });
  const land = new Map(); sessions.forEach((s) => { if (!s.p0) return; const k = norm(s.p0.path); const r = land.get(k) || { n: 0, b: 0, vs: new Set() }; r.n++; if (s.n === 1) r.b++; r.vs.add(s.v); land.set(k, r); });
  const landRows = [...land].sort((a, b) => b[1].n - a[1].n).slice(0, 8).map(([k, r]) => [k, r.n, pct(r.b, r.n), ordersOf(r.vs)]);

  const S = ({ l, v, s }) => <div className="stat"><span>{l}</span><b>{v}</b>{s && <small className="an-s">{s}</small>}</div>;
  return (<>
    <h1>Analytics</h1>
    <div className="tabs"><Link href="/admin/analytics">Overview</Link><Link className="on" href="/admin/analytics/traffic">Traffic &amp; funnel</Link></div>
    <div className="tabs">{[[1, 'Today'], [7, 'Last 7 days'], [30, 'Last 30 days'], [90, 'Last 90 days']].map(([d, l]) => <Link key={d} className={days === d ? 'on' : ''} href={`/admin/analytics/traffic?days=${d}`}>{l}</Link>)}</div>
    {noPv && <div className="box" style={{ marginBottom: 20 }}><b>Visitor tracking is not set up yet.</b> <span style={{ color: 'var(--muted)' }}>Run <code>supabase/analytics.sql</code> then <code>supabase/analytics-v2.sql</code> in the Supabase SQL editor.</span></div>}
    {!noPv && noEv && <div className="box" style={{ marginBottom: 20 }}><b>Sessions, time on site, cities and the cart / checkout funnel need one more step.</b> <span style={{ color: 'var(--muted)' }}>Run <code>supabase/analytics-v2.sql</code> once. They fill in from then on.</span></div>}
    <div className="cards">
      <S l="Unique visitors" v={visitors.size} s={`${retVis} returning (${pct(retVis, visitors.size)})`} />
      <S l="Sessions" v={sessions.length} s={`${pct(bounce, sessions.length)} bounce`} />
      <S l="Page views" v={pv.length} s={`${sessions.length ? (pv.length / sessions.length).toFixed(1) : '—'} pages per session`} />
      <S l="Avg. time on site" v={fmtT(avgTime)} s="per session, visible time" />
      <S l="Added to cart" v={cartV.size} s={`${cartEv.length} adds · ${pct(cartV.size, visitors.size)} of visitors`} />
      <S l="Reached checkout" v={chkV.size} s={`${pct(chkV.size, cartV.size)} of cart adders`} />
      <S l="Orders placed" v={orders.length} s={`${orders.length - bought.length} not completed`} />
      <S l="Purchases" v={bought.length} s={`${inr(rev)} · avg ${inr(bought.length ? Math.round(rev / bought.length) : 0)}`} />
      <S l="Prepaid purchases" v={prepaid.length} s={`${pct(prepaid.length, bought.length)} of purchases · ${inr(prepaid.reduce((a, o) => a + Number(o.total || 0), 0))}`} />
      <S l="COD purchases" v={cod.length} s={`${pct(cod.length, bought.length)} of purchases`} />
      <S l="Conversion" v={pct(bought.length, visitors.size)} s="purchases ÷ visitors" />
      <S l="Cart → purchase" v={pct(bought.length, cartV.size)} s="purchases ÷ cart adders" />
    </div>

    <div className="box" style={{ marginBottom: 14 }}>
      <div className="eyebrow">Funnel</div>
      <div className="fn">{funnel.map(([l, n, u], i) => (
        <div key={l} className="fn-r"><div className="fn-l">{l}<small>{u}</small></div>
          <div className="fn-t"><i style={{ width: `${Math.max(1.5, (n / fmax) * 100)}%` }} /></div>
          <div className="fn-n"><b>{n}</b><small>{i ? `${pct(n, funnel[i - 1][1])} of previous · −${Math.max(0, funnel[i - 1][1] - n)}` : '100%'}</small></div></div>))}
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 10 }}>The first four steps count unique visitors; the last two count orders. “Order placed” includes COD orders still waiting for the WhatsApp code and online orders where payment was not completed.</p>
    </div>

    <div className="an-grid">
      <div className="box"><div className="eyebrow">Orders by payment type</div>
        <Tbl head={['Type', 'Placed', 'Purchased', 'Completed', 'Revenue']} rows={[...pmRows].map(([k, r]) => [PAY[k] || k, r.p, r.b, pct(r.b, r.p), inr(r.rev)])} empty="No orders" /></div>
      <div className="box"><div className="eyebrow">Visits by hour of day (IST)</div><Bars rows={hrP.map((n, h) => ({ k: h, l: h % 3 === 0 ? String(h) : '', t: `${h}:00, ${hrV[h].size} visitors`, v: hrP[h] }))} /><p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 8 }}>Page views per hour. Busiest: {hrP.some(Boolean) ? `${hrP.indexOf(Math.max(...hrP))}:00` : '—'}</p></div>
      <div className="box"><div className="eyebrow">Visitors per day</div><Bars rows={dkeys.map((k) => ({ k, l: k.slice(8), t: k, v: dV.get(k).size }))} /></div>
      <div className="box"><div className="eyebrow">Page views per day</div><Bars rows={dkeys.map((k) => ({ k, l: k.slice(8), t: k, v: dP.get(k) }))} /></div>
      <div className="box"><div className="eyebrow">Purchases per day</div><Bars rows={dkeys.map((k) => ({ k, l: k.slice(8), t: k, v: dO.get(k) }))} /></div>
      <div className="box"><div className="eyebrow">Top cities</div><Tbl head={['City', 'Visitors', 'Orders']} rows={cityRows} empty="No city data yet" /></div>
      <div className="box"><div className="eyebrow">Countries</div><List rows={top(countryV, 8)} /></div>
      <div className="box"><div className="eyebrow">Paid vs organic</div><Tbl head={['Type', 'Visitors', 'Added to cart', 'Orders', 'Conv.']} rows={[...paidG].map(([k, s]) => attrRow(k, s))} /></div>
    </div>

    <div className="box" style={{ marginTop: 14 }}><div className="eyebrow">Source / channel</div>
      <Tbl head={['Channel', 'Visitors', 'Added to cart', 'Orders', 'Conv.']} rows={[...chanG].map(([k, s]) => attrRow(k, s)).sort((a, b) => b[1] - a[1])} />
      <div className="an-grid" style={{ marginTop: 14 }}>
        <div><div className="eyebrow">Sources</div><List rows={top(srcCount, 10)} /></div>
        <div><div className="eyebrow">Campaigns (utm_campaign)</div><List rows={top(campCount, 10)} empty="No campaign tags yet. Add utm_campaign to your ad links." /></div>
      </div></div>

    <div className="box" style={{ marginTop: 14 }}><div className="eyebrow">Devices</div>
      <Tbl head={['Device', 'Visitors', 'Added to cart', 'Orders', 'Conv.']} rows={[...devG].map(([k, s]) => attrRow(`${k[0].toUpperCase()}${k.slice(1)} · ${devSess.get(k) || 0} sessions`, s)).sort((a, b) => b[1] - a[1])} /></div>

    <div className="box" style={{ marginTop: 14 }}><div className="eyebrow">Top pages and conversion</div>
      <Tbl head={['Page', 'Views', 'Visitors', 'Avg. time', 'Added to cart', 'Watch ordered', 'Orders from visitors', 'Conv.']} rows={pageRows} />
      <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 10 }}>“Added to cart” and “Watch ordered” apply to watch pages. “Orders from visitors” counts purchases made by people who viewed that page; conversion is that number ÷ the page’s visitors.</p></div>

    <div className="box" style={{ marginTop: 14 }}><div className="eyebrow">Landing pages</div>
      <Tbl head={['Page', 'Sessions', 'Bounce', 'Orders from visitors']} rows={landRows} empty="No session data yet" /></div>

    {bought.length > 0 && <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 14 }}>{matched} of {bought.length} purchases carry a visitor id and feed the channel, device and page conversion figures. Older orders and orders made before the tracking update are not attributed.</p>}
  </>);
}
