import { requireAdmin } from '@/lib/admin';
import Preview from '@/components/admin/Preview';
import Link from 'next/link';
import { inr } from '@/lib/data';
export default async function P() {
  const { db } = await requireAdmin('abandoned'); if (!db) return <Preview />;
  const { data } = await db.from('checkouts').select('*').eq('recovered', false).order('updated_at', { ascending: false }).limit(300);
  const { data: dead } = await db.from('orders').select('id,order_number,name,email,phone,items,total,status,payment_method,created_at').in('status', ['pending_payment', 'cancelled']).order('created_at', { ascending: false }).limit(300);
  return <><h1>Abandoned carts</h1><table className="tbl"><thead><tr><th>Customer</th><th>Contact</th><th>Items</th><th>Value</th><th>Last seen</th></tr></thead><tbody>{(data || []).map((c) => <tr key={c.id}><td>{c.name || '—'}</td><td>{c.email}<br /><small>{c.phone}</small></td><td>{(c.items || []).map((i) => `${i.name}×${i.qty}`).join(', ')}</td><td>{inr(c.total)}</td><td>{new Date(c.updated_at).toLocaleString('en-IN')}</td></tr>)}{!data?.length && <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--muted)', padding: 26 }}>None.</td></tr>}</tbody></table><h3 style={{ margin: '30px 0 12px', fontSize: 14, letterSpacing: '.2em', textTransform: 'uppercase' }}>Unpaid and cancelled orders</h3>
    <div style={{ overflowX: 'auto' }}><table className="tbl"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Value</th><th>Reason</th><th>Date</th><th /></tr></thead><tbody>
      {(dead || []).map((o) => <tr key={o.id}><td><b>{o.order_number}</b></td><td>{o.name}<br /><small style={{ color: 'var(--muted)' }}>{o.phone} · {o.email}</small></td><td>{(o.items || []).map((i) => `${i.name}×${i.qty}`).join(', ')}</td><td>{inr(o.total)}</td><td>{o.status === 'cancelled' ? 'Cancelled' : o.payment_method === 'cod' ? 'COD not confirmed' : 'Payment not completed'}</td><td>{new Date(o.created_at).toLocaleString('en-IN')}</td><td><Link className="btn sm" href={`/admin/orders/${o.id}`}>View</Link></td></tr>)}
      {!dead?.length && <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>None.</td></tr>}</tbody></table></div>
  </>;
}
