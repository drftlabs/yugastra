import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { riskMap, REAL, phoneKey, emailKey } from '@/lib/risk';
import Preview from '@/components/admin/Preview';
export default async function P() {
  const { db } = await requireAdmin('customers'); if (!db) return <Preview />;
  const [{ data }, { data: ords }] = await Promise.all([
    db.from('customers').select('*').order('created_at', { ascending: false }).limit(500),
    db.from('orders').select('id,email,phone,status').limit(5000),
  ]);
  const n = new Map(); (ords || []).filter(REAL).forEach((o) => { for (const k of [`e:${emailKey(o.email)}`, `p:${phoneKey(o.phone)}`]) n.set(k, new Set([...(n.get(k) || []), o.id])); });
  const cnt = (c) => { const s = new Set([...(n.get(`e:${emailKey(c.email)}`) || []), ...(c.phone ? n.get(`p:${phoneKey(c.phone)}`) || [] : [])]); return s.size; };
  return <><h1>Customers</h1><div className="ord-wrap"><table className="tbl"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Orders</th></tr></thead><tbody>{(data || []).map((c) => { const k = cnt(c); return <tr key={c.id}><td>{c.name || '—'}</td><td>{c.email}</td><td>{c.phone || '—'}</td><td>{new Date(c.created_at).toLocaleDateString('en-IN')}</td><td><Link className="btn sm" href={`/admin/orders?status=all&q=${encodeURIComponent(c.email || c.phone || '')}`}>View orders{k ? ` (${k})` : ''}</Link>{k > 1 && <span className="risk-tag">⚠ repeat</span>}</td></tr>; })}</tbody></table></div></>;
}
