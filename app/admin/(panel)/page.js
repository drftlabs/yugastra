import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { orderLabel } from '@/lib/orderLabel';
import { inr } from '@/lib/data';
export default async function Dash() {
  const { db, admin } = await requireAdmin();
  let s = { orders: 0, revenue: 0, pending: 0, today: 0 }, low = [], recent = [];
  if (db) {
    const { data: o } = await db.from('orders').select('order_number,status,total,name,created_at,payment_method').order('created_at', { ascending: false }).limit(500);
    const paid = (o || []).filter((x) => !['pending_payment', 'cancelled', 'otp_pending'].includes(x.status));
    const day = new Date().toDateString();
    s = { orders: paid.length, revenue: paid.reduce((a, x) => a + Number(x.total), 0), pending: paid.filter((x) => x.status === 'paid' || x.status === 'processing').length, today: paid.filter((x) => new Date(x.created_at).toDateString() === day).length };
    recent = paid.slice(0, 8);
    low = (await db.from('products').select('name,stock').lte('stock', 3).eq('active', true)).data || [];
  }
  return (<>
    <h1>Welcome{admin.display_name ? `, ${admin.display_name}` : ''}</h1>
    <div className="cards"><div className="stat"><span>Orders</span><b>{s.orders}</b></div><div className="stat"><span>Revenue</span><b>{inr(s.revenue)}</b></div><div className="stat"><span>To fulfil</span><b>{s.pending}</b></div><div className="stat"><span>Today</span><b>{s.today}</b></div></div>
    {!!low.length && <div className="box" style={{ marginBottom: 20 }}><div className="eyebrow">Low stock</div>{low.map((p) => <div className="row" key={p.name}><span>{p.name}</span><span>{p.stock} left</span></div>)}</div>}
    <h3 style={{ margin: '24px 0 12px', fontSize: 14, letterSpacing: '.2em', textTransform: 'uppercase' }}>Recent orders</h3>
    <table className="tbl"><thead><tr><th>Order</th><th>Customer</th><th>Type</th><th>Status</th><th>Total</th></tr></thead><tbody>{recent.map((o) => <tr key={o.order_number}><td><Link href={`/admin/orders`}>{o.order_number}</Link></td><td>{o.name}</td><td><span className={`pm ${o.payment_method === 'cod' ? 'cod' : 'pre'}`}>{o.payment_method === 'cod' ? 'COD' : 'Prepaid'}</span></td><td><span className={`pill ${o.status}`}>{orderLabel(o)}</span></td><td>{inr(o.total)}</td></tr>)}{!recent.length && <tr><td colSpan="4" style={{ color: 'var(--muted)', textAlign: 'center', padding: 24 }}>No orders yet.</td></tr>}</tbody></table>
  </>);
}
