import { requireAdmin } from '@/lib/admin';
import Preview from '@/components/admin/Preview';
import { toggleMessage } from '@/lib/actions/admin';
export default async function P() {
  const { db } = await requireAdmin('messages'); if (!db) return <Preview />;
  const { data } = await db.from('messages').select('*').order('created_at', { ascending: false }).limit(300);
  return <><h1>Messages & complaints</h1><div style={{ display: 'grid', gap: 12 }}>{(data || []).map((m) => (
    <div className="box" key={m.id} style={{ opacity: m.resolved ? .55 : 1 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="tag">{m.kind}</span><small style={{ color: 'var(--muted)' }}>{new Date(m.created_at).toLocaleString('en-IN')}</small></div>
      <p style={{ margin: '8px 0' }}><b>{m.name}</b> · {m.email} {m.phone && `· ${m.phone}`} {m.order_number && `· ${m.order_number}`}</p><p style={{ color: '#cfc9bc' }}>{m.body}</p>
      <form action={toggleMessage.bind(null, m.id, !m.resolved)} style={{ marginTop: 12 }}><button className="btn sm">{m.resolved ? 'Reopen' : 'Mark resolved'}</button></form></div>))}
    {!data?.length && <p style={{ color: 'var(--muted)' }}>No messages.</p>}</div></>;
}
