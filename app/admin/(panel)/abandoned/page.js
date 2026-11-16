import { requireAdmin } from '@/lib/admin';
import Preview from '@/components/admin/Preview';
import { inr } from '@/lib/data';
export default async function P() {
  const { db } = await requireAdmin('abandoned'); if (!db) return <Preview />;
  const { data } = await db.from('checkouts').select('*').eq('recovered', false).order('updated_at', { ascending: false }).limit(300);
  return <><h1>Abandoned carts</h1><table className="tbl"><thead><tr><th>Customer</th><th>Contact</th><th>Items</th><th>Value</th><th>Last seen</th></tr></thead><tbody>{(data || []).map((c) => <tr key={c.id}><td>{c.name || '—'}</td><td>{c.email}<br /><small>{c.phone}</small></td><td>{(c.items || []).map((i) => `${i.name}×${i.qty}`).join(', ')}</td><td>{inr(c.total)}</td><td>{new Date(c.updated_at).toLocaleString('en-IN')}</td></tr>)}{!data?.length && <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--muted)', padding: 26 }}>None.</td></tr>}</tbody></table></>;
}
