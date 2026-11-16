'use client';
import { useState } from 'react';
import { useT } from '@/components/L';
export default function CircleForm() {
  const t = useT();
  const [f, setF] = useState({ name: '', email: '', phone: '' }); const [st, setSt] = useState(''); const [err, setErr] = useState('');
  const go = async (e) => {
    e.preventDefault(); setSt('busy'); setErr('');
    const r = await fetch('/api/circle', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) });
    const j = await r.json().catch(() => ({})); if (r.ok) setSt('done'); else { setSt(''); setErr(j.error || 'Something went wrong.'); }
  };
  if (st === 'done') return <p className="circ-ok">{t('You are in the Circle. We will write to you before each new realm opens.')}</p>;
  return (
    <form onSubmit={go} className="circ-f">
      <input placeholder={t('Name')} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
      <input type="email" placeholder={t('Email')} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
      <input placeholder={t('WhatsApp number (optional)')} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
      <button className="btn btn-gold" disabled={st === 'busy'}>{t('Join the Circle')}</button>
      {err && <p className="err">{err}</p>}
    </form>
  );
}
