import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { inr } from '@/lib/data';
import Preview from '@/components/admin/Preview';
const ST = ['all', 'pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
export default async function Orders({ searchParams }) {
  const { db } = await requireAdmin('orders'); if (!db) return <Preview />;
  const st = searchParams.status || 'all';
  let q = db.from('orders').select('*').order('created_at', { ascending: false }).limit(300); if (st !== 'all') q = q.eq('status', st);
  const { data: rows } = await q;
  return (<><h1>Orders</h1>
    <div className="tabs">{ST.map((s) => <Link key={s} className={st === s ? 'on' : ''} href={`/admin/orders?status=${s}`}>{s.replace('_', ' ')}</Link>)}<a href="/admin/orders/export" className="btn sm" style={{ marginLeft: 'auto' }}>Export CSV</a></div>
    <div style={{ overflowX: 'auto' }}><table className="tbl"><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Method</th><th>Status</th><th>Total</th><th>COD due</th><th /></tr></thead>
      <tbody>{(rows || []).map((o) => <tr key={o.id}><td><b>{o.order_number}</b></td><td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td><td>{o.name}<br /><small style={{ color: 'var(--muted)' }}>{o.phone}</small></td><td>{o.payment_method}</td><td><span className={`pill ${o.status}`}>{o.status.replace('_', ' ')}</span></td><td>{inr(o.total)}</td><td>{o.amount_due > 0 ? inr(o.amount_due) : '—'}</td><td><Link className="btn sm" href={`/admin/orders/${o.id}`}>Open</Link></td></tr>)}
        {!rows?.length && <tr><td colSpan="8" style={{ color: 'var(--muted)', textAlign: 'center', padding: 30 }}>No orders.</td></tr>}</tbody></table></div></>);
}
