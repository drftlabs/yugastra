'use client';
import { useState } from 'react';
import { useT } from '@/components/L';
// Shown instead of the buy buttons when a watch is waitlist-only.
export default function WaitlistBox({ p, whatsapp, unlocked, onUnlock }) {
  const t = useT();
  const [f, setF] = useState({ name: '', phone: '', email: '' }); const [st, setSt] = useState(''); const [err, setErr] = useState('');
  const [code, setCode] = useState(''); const [cerr, setCerr] = useState(''); const [show, setShow] = useState(false);
  const join = async (e) => {
    e.preventDefault(); setSt('busy'); setErr('');
    const r = await fetch('/api/waitlist', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...f, slug: p.slug }) });
    const j = await r.json().catch(() => ({})); if (r.ok) setSt('done'); else { setSt(''); setErr(j.error || 'Something went wrong.'); }
  };
  const redeem = async (e) => {
    e.preventDefault(); setCerr('');
    const r = await fetch('/api/waitlist/redeem', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ slug: p.slug, code }) });
    const j = await r.json().catch(() => ({})); if (r.ok) onUnlock(p.slug); else setCerr(j.error || 'That code is not valid.');
  };
  const wa = String(whatsapp || '').replace(/\D/g, '');
  const msg = encodeURIComponent(`Hello YUGASTRA, I would like to join the waitlist for ${p.name}.`);
  if (unlocked) return <p className="circ-ok">{t('Unlocked. You may now purchase this watch.')}</p>;
  return (
    <div className="wl">
      <div className="eyebrow">{t('This watch is by invitation for now.')}</div>
      {st === 'done' ? <p className="circ-ok">{t('You are on the list. We will write to you with your access code.')}</p> : (
        <form onSubmit={join} className="circ-f">
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>{t('Leave your details and we will write to you with a private access code.')}</p>
          <input placeholder={t('Name')} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
          <input placeholder={t('WhatsApp number')} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} required />
          <input type="email" placeholder={t('Email')} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
          <button className="btn btn-gold" disabled={st === 'busy'}>{t('Join the waitlist')}</button>
          {wa && <a className="link-arrow" target="_blank" rel="noreferrer" href={`https://wa.me/${wa}?text=${msg}`}>{t('Message us on WhatsApp')}</a>}
          {err && <p className="err">{err}</p>}
        </form>)}
      <button type="button" className="quiz-again" onClick={() => setShow(!show)}>{t('Have an access code?')}</button>
      {show && <form onSubmit={redeem} className="circ-f" style={{ marginTop: 10 }}>
        <input placeholder={t('Access code')} value={code} onChange={(e) => setCode(e.target.value)} required />
        <button className="btn">{t('Unlock')}</button>{cerr && <p className="err">{cerr}</p>}</form>}
    </div>
  );
}
