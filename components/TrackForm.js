'use client';
import { useState } from 'react';
import { useT } from '@/components/L';
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
export default function TrackForm() {
  const t = useT();
  const [f, setF] = useState({ order: '', contact: '' }); const [o, setO] = useState(null); const [e, setE] = useState('');
  async function go(ev) { ev.preventDefault(); setE(''); setO(null); const r = await fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) }); const d = await r.json(); r.ok ? setO(d.order) : setE(t(d.error)); }
  return (<div style={{ maxWidth: 520 }}>
    <form onSubmit={go} className="box">
      <div className="field"><label>{t('Order number')}</label><input className="inp" placeholder="YG-1001" required value={f.order} onChange={(x) => setF({ ...f, order: x.target.value })} /></div>
      <div className="field"><label>{t('Email or mobile used at checkout')}</label><input className="inp" required value={f.contact} onChange={(x) => setF({ ...f, contact: x.target.value })} /></div>
      {e && <div className="err">{e}</div>}<button className="btn btn-gold">{t('Track')}</button>
    </form>
    {o && <div className="box" style={{ marginTop: 18 }}><div className="eyebrow">{o.order_number}</div><h3 style={{ margin: '8px 0', textTransform: 'capitalize' }}>{t(o.status.replace('_', ' '))}</h3>
      {(o.items || []).map((i) => <div className="row" key={i.id}><span>{i.name} × {i.qty}</span><span>{inr(i.price * i.qty)}</span></div>)}
      {o.tracking_number && <p style={{ marginTop: 12 }}>{o.courier} · {o.tracking_number} {o.tracking_url && <a className="link-arrow" href={o.tracking_url} target="_blank" rel="noreferrer">{t('Track shipment')}</a>}</p>}</div>}
  </div>);
}
