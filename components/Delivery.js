'use client';
import { useEffect, useState } from 'react';
import { useLang, useT } from '@/components/L';
// "Delivery by" estimate plus a pincode check. Uses the delivery window from Settings, e.g. "5-7 business days".
function addBiz(n) { const d = new Date(); let k = 0; while (k < n) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) k++; } return d; }
export default function Delivery({ days = '5-7 business days' }) {
  const lang = useLang(); const t = useT(); const hi = lang === 'hi';
  const [pin, setPin] = useState(''); const [res, setRes] = useState(null); const [busy, setBusy] = useState(false); const [by, setBy] = useState('');
  const m = String(days).match(/(\d+)\s*[-–to]+\s*(\d+)/) || String(days).match(/(\d+)/);
  const lo = m ? +m[1] : 5, hiN = m ? +(m[2] || m[1]) : 7;
  const fmt = (d) => d.toLocaleDateString(hi ? 'hi-IN' : 'en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  useEffect(() => { setBy(lo === hiN ? fmt(addBiz(hiN)) : `${fmt(addBiz(lo))} – ${fmt(addBiz(hiN))}`); try { const p = localStorage.getItem('yg_pin'); if (p) { setPin(p); check(p); } } catch {} }, [days, lang]);
  async function check(v = pin) {
    if (!/^\d{6}$/.test(v)) return setRes({ err: hi ? 'कृपया 6 अंकों का पिनकोड दर्ज कीजिए।' : 'Enter a valid 6-digit pincode.' });
    setBusy(true);
    try {
      const d = await fetch(`https://api.postalpincode.in/pincode/${v}`).then((x) => x.json());
      const o = d?.[0]?.PostOffice?.[0];
      if (o) { setRes({ ok: `${o.District}, ${o.State}` }); try { localStorage.setItem('yg_pin', v); } catch {} } else setRes({ err: hi ? 'यह पिनकोड नहीं मिला।' : "We couldn't find that pincode." });
    } catch { setRes({ ok: '' }); }
    setBusy(false);
  }
  return (
    <div className="dlv">
      <div className="dlv-by">{by ? <>{t('Delivery by')} <b>{by}</b></> : null}</div>
      <div className="dlv-row">
        <input className="inp" inputMode="numeric" maxLength={6} placeholder={t('Enter pincode')} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setRes(null); }} onKeyDown={(e) => e.key === 'Enter' && check()} />
        <button type="button" className="dlv-btn" onClick={() => check()} disabled={busy}>{busy ? '…' : t('Check')}</button>
      </div>
      {res?.ok !== undefined && res.ok !== null && !res.err && <div className="dlv-ok">{res.ok ? (hi ? `${res.ok} में वितरण उपलब्ध · ${by} तक` : `Delivering to ${res.ok} · by ${by}`) : (hi ? 'वितरण उपलब्ध' : 'Delivery available')}</div>}
      {res?.err && <div className="dlv-err">{res.err}</div>}
    </div>
  );
}
