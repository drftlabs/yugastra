import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { inr } from '@/lib/data';
import { orderLabel } from '@/lib/orderLabel';
import { riskMap, riskLabel } from '@/lib/risk';
import RowClick from '@/components/admin/RowClick';
import Preview from '@/components/admin/Preview';
const ST = ['all', 'paid', 'processing', 'shipped', 'delivered', 'risk', 'otp_pending', 'pending_payment'];
const TAB = { otp_pending: 'unconfirmed (WhatsApp)', pending_payment: 'payment not completed', risk: 'risk (repeat phone / email)' };
const HIDE = '(pending_payment,cancelled,otp_pending)';
export default async function Orders({ searchParams }) {
  const { db } = await requireAdmin('orders'); if (!db) return <Preview />;
  const st = searchParams.status || 'all'; const qs = String(searchParams.q || '').replace(/[,()%*]/g, ' ').trim().slice(0, 60);
  const { data: lite } = await db.from('orders').select('id,order_number,email,phone,status,created_at,total').order('created_at', { ascending: false }).limit(3000);
  const risk = riskMap(lite || []);
  let q = db.from('orders').select('*').order('created_at', { ascending: false }).limit(300);
  if (qs) q = q.or(`email.ilike.%${qs}%,phone.ilike.%${qs}%,name.ilike.%${qs}%,order_number.ilike.%${qs}%`);
  if (st === 'risk') q = q.in('id', [...risk.keys()].slice(0, 300).concat(['00000000-0000-0000-0000-000000000000']));
  else if (st === 'all') { if (!qs) q = q.not('status', 'in', HIDE); } else q = q.eq('status', st);
  const { data: rows } = await q;
  const href = (s) => `/admin/orders?status=${s}${qs ? `&q=${encodeURIComponent(qs)}` : ''}`;
  return (<><RowClick /><h1>Orders</h1><p style={{ color: 'var(--muted)', margin: '-10px 0 16px', fontSize: 13 }}>Only confirmed orders are listed here. COD orders whose WhatsApp code was not entered are under “unconfirmed”, and unpaid online orders under “payment not completed”. Nothing is shipped or stock-held for those.</p>
    <form className="ord-search" action="/admin/orders"><input type="hidden" name="status" value={st} /><input className="inp" name="q" defaultValue={qs} placeholder="Search name, phone, email or order number" /><button className="btn sm">Search</button>{qs && <Link className="btn sm" href={`/admin/orders?status=${st}`}>Clear</Link>}</form>
    <div className="tabs">{ST.map((s) => <Link key={s} className={st === s ? 'on' : ''} href={href(s)}>{TAB[s] || s}{s === 'risk' && risk.size ? ` (${risk.size})` : ''}</Link>)}<a href="/admin/orders/export" className="btn sm" style={{ marginLeft: 'auto' }}>Export CSV</a></div>
    <div className="ord-wrap"><table className="tbl ord"><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Method</th><th>Status</th><th>Total</th><th>COD due</th><th /></tr></thead>
      <tbody>{(rows || []).map((o) => { const r = risk.get(o.id); return <tr key={o.id} data-href={`/admin/orders/${o.id}`} className="ord-row-click"><td className="o-no"><Link href={`/admin/orders/${o.id}`}><b>{o.order_number}</b></Link></td><td className="o-date">{new Date(o.created_at).toLocaleDateString('en-IN')}</td><td className="o-cust">{o.name}<br /><small style={{ color: 'var(--muted)' }}>{o.phone}</small>{r && <span className="risk-tag" title={riskLabel(r)}>⚠ {riskLabel(r)}</span>}</td><td className="o-pm"><span className={`pm ${o.payment_method === 'cod' ? 'cod' : 'pre'}`}>{o.payment_method === 'cod' ? 'COD' : 'Prepaid'}</span></td><td className="o-st"><span className={`pill ${o.status}`}>{orderLabel(o)}</span></td><td className="o-tot">{inr(o.total)}</td><td className="o-due">{o.amount_due > 0 ? <><small className="o-lbl">COD due </small>{inr(o.amount_due)}</> : ''}</td><td className="o-go"><Link className="btn sm" href={`/admin/orders/${o.id}`}>View</Link></td></tr>; })}
        {!rows?.length && <tr><td colSpan="8" style={{ color: 'var(--muted)', textAlign: 'center', padding: 30 }}>No orders.</td></tr>}</tbody></table></div></>);
}
