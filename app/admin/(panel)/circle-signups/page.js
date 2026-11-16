import { requireAdmin } from '@/lib/admin';
import Preview from '@/components/admin/Preview';
export default async function P() {
  const { db } = await requireAdmin('circle'); if (!db) return <Preview />;
  const { data } = await db.from('circle_signups').select('*').order('created_at', { ascending: false }).limit(1000);
  return <><h1>Circle sign-ups</h1><p style={{ color: 'var(--muted)', marginBottom: 16 }}>{(data || []).length} members waiting for early access.</p>
    <div style={{ display: 'grid', gap: 8 }}>{(data || []).map((m) => (<div className="box" key={m.id}><b>{m.name}</b> · {m.email}{m.phone ? ` · ${m.phone}` : ''}<small style={{ color: 'var(--muted)', float: 'right' }}>{new Date(m.created_at).toLocaleDateString('en-IN')}</small></div>))}</div></>;
}
