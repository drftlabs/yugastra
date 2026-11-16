'use client';
import { useState } from 'react';
import { useT } from '@/components/L';
export default function SimpleForm({ kind = 'contact' }) {
  const t = useT();
  const [f, setF] = useState({ name: '', email: '', phone: '', order_number: '', body: '' }); const [s, setS] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function go(e) { e.preventDefault(); setS('…'); const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, kind }) }); const d = await r.json(); setS(r.ok ? 'sent' : t(d.error)); }
  if (s === 'sent') return <div className="box"><div className="ok">{t('Thank you. We will reply within 48 hours.')}</div></div>;
  return (
    <form onSubmit={go} className="box" style={{ maxWidth: 560 }}>
      <div className="two"><div className="field"><label>{t('Name')}</label><input className="inp" required value={f.name} onChange={set('name')} /></div><div className="field"><label>{t('Phone')}</label><input className="inp" value={f.phone} onChange={set('phone')} /></div></div>
      <div className="field"><label>{t('Email')}</label><input className="inp" type="email" required value={f.email} onChange={set('email')} /></div>
      {kind === 'complaint' && <div className="field"><label>{t('Order number')}</label><input className="inp" value={f.order_number} onChange={set('order_number')} /></div>}
      <div className="field"><label>{t('Message')}</label><textarea className="inp" required value={f.body} onChange={set('body')} /></div>
      {s && s !== '…' && <div className="err">{s}</div>}
      <button className="btn btn-gold">{s === '…' ? t('Sending…') : t('Send')}</button>
    </form>
  );
}
