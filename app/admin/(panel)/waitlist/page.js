import { requireAdmin } from '@/lib/admin';
import Preview from '@/components/admin/Preview';
import SendCode from '@/components/admin/SendCode';
export default async function P() {
  const { db } = await requireAdmin('waitlist'); if (!db) return <Preview />;
  const { data } = await db.from('waitlist_entries').select('*').order('created_at', { ascending: false }).limit(500);
  const by = {}; (data || []).forEach((e) => { (by[e.product_name || 'Unknown'] ||= []).push(e); });
  return <><h1>Waitlist</h1><p style={{ color: 'var(--muted)', marginBottom: 16 }}>Per watch. Set a watch to “waitlist” in Products, then send each person a single-use access code.</p>
    {Object.entries(by).map(([name, rows]) => (<div key={name} style={{ marginBottom: 30 }}><div className="eyebrow" style={{ marginBottom: 10 }}>{name} · {rows.length}</div>
      <div style={{ display: 'grid', gap: 8 }}>{rows.map((e) => (<div className="box" key={e.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div><b>{e.name}</b> · {e.phone} · {e.email}<br /><small style={{ color: 'var(--muted)' }}>{new Date(e.created_at).toLocaleDateString('en-IN')} · <span className="tag">{e.status}</span></small></div>
        <SendCode id={e.id} phone={e.phone} name={e.name} product={e.product_name} invited={e.status !== 'waiting'} /></div>))}</div></div>))}
    {!data?.length && <p style={{ color: 'var(--muted)' }}>No one is on a waitlist yet.</p>}</>;
}
