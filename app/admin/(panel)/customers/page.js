import { requireAdmin } from '@/lib/admin';
import Preview from '@/components/admin/Preview';
export default async function P() {
  const { db } = await requireAdmin('customers'); if (!db) return <Preview />;
  const { data } = await db.from('customers').select('*').order('created_at', { ascending: false }).limit(500);
  return <><h1>Customers</h1><table className="tbl"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr></thead><tbody>{(data || []).map((c) => <tr key={c.id}><td>{c.name || '—'}</td><td>{c.email}</td><td>{c.phone || '—'}</td><td>{new Date(c.created_at).toLocaleDateString('en-IN')}</td></tr>)}</tbody></table></>;
}
