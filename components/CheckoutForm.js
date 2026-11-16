'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link, { useLang, useT, pre } from '@/components/L';
import { useShop } from '@/components/ShopProvider';
import Dial from '@/components/Dial';
import { priceOrder, hasAdvance } from '@/lib/pricing';
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function CheckoutForm({ cfg, rzpReady, waEnabled, deliveryDays }) {
  const lang = useLang(); const t = useT();
  const { items, subtotal, clear } = useShop(); const r = useRouter();
  const [f, setF] = useState({ name: '', email: '', phone: '', address: '', landmark: '', city: '', state: '', pincode: '' });
  const [method, setMethod] = useState(rzpReady ? 'online' : cfg.codEnabled ? 'cod' : 'online');
  const canAdv = hasAdvance(cfg); const [adv, setAdv] = useState(canAdv);
  const [code, setCode] = useState(''); const [disc, setDisc] = useState({ amount: 0, code: '' }); const [dmsg, setDmsg] = useState('');
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const [wa, setWa] = useState({ open: false, sent: false, code: '', timer: 0, msg: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const pr = useMemo(() => priceOrder({ subtotal, discount: disc.amount, method, cfg, advance: adv }), [subtotal, disc, method, cfg, adv]);
  const needWA = waEnabled && method === 'cod' && !(adv && canAdv);

  // pincode autofill (India Post public API)
  useEffect(() => {
    if (!/^\d{6}$/.test(f.pincode)) return;
    fetch(`https://api.postalpincode.in/pincode/${f.pincode}`).then((x) => x.json()).then((d) => {
      const o = d?.[0]?.PostOffice?.[0]; if (o) setF((s) => ({ ...s, city: o.District, state: o.State }));
    }).catch(() => {});
  }, [f.pincode]);
  // abandoned cart capture
  const cap = useRef();
  useEffect(() => {
    if (!/^\S+@\S+\.\S+$/.test(f.email) || !items.length) return;
    clearTimeout(cap.current);
    cap.current = setTimeout(() => fetch('/api/cart/capture', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: f.email, phone: f.phone, name: f.name, items, total: subtotal }) }), 1200);
  }, [f.email, f.phone, f.name, items, subtotal]);
  useEffect(() => { if (wa.timer > 0) { const t = setTimeout(() => setWa((w) => ({ ...w, timer: w.timer - 1 })), 1000); return () => clearTimeout(t); } }, [wa.timer]);

  async function applyCode() {
    setDmsg('');
    const d = await fetch('/api/checkout/discount', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, subtotal }) }).then((x) => x.json());
    if (d.ok) { setDisc({ amount: d.amount, code: d.code }); setDmsg(`${lang === 'hi' ? 'कूट लागू हुआ' : 'Code applied'}: −${inr(d.amount)}`); } else { setDisc({ amount: 0, code: '' }); setDmsg(t(d.error || 'Invalid code')); }
  }
  async function sendWA() {
    setWa((w) => ({ ...w, msg: '' }));
    const d = await fetch('/api/whatsapp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: f.phone }) }).then((x) => x.json());
    if (d.error) return setWa((w) => ({ ...w, open: true, msg: t(d.error) }));
    setWa({ open: true, sent: true, code: '', timer: 30, msg: '' });
  }
  async function verifyWA(c) {
    const d = await fetch('/api/whatsapp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: f.phone, code: c }) }).then((x) => x.json());
    if (d.error) return setWa((w) => ({ ...w, msg: t(d.error), code: '' }));
    setWa({ open: false, sent: false, code: '', timer: 0, msg: '' }); place(true);
  }
  async function place(verified) {
    setErr('');
    if (needWA && !verified) { if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, '').slice(-10))) return setErr(t('Enter a valid 10-digit mobile number.')); return sendWA(); }
    setBusy(true);
    const res = await fetch('/api/checkout/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: items.map((i) => ({ id: i.id, qty: i.qty })), customer: f, method, advance: adv, code: disc.code, lang }) });
    const d = await res.json();
    if (!res.ok) { setBusy(false); return setErr(t(d.error || 'Something went wrong.')); }
    const done = (n) => { clear(); r.push(pre(lang, `/checkout/success?o=${n}&due=${d.due || 0}`)); };
    if (d.cod) return done(d.orderNumber);
    const rz = new window.Razorpay({
      key: d.key, order_id: d.razorpayOrderId, amount: d.amount, currency: 'INR', name: 'YUGASTRA',
      description: `Order ${d.orderNumber}`, prefill: d.prefill, theme: { color: '#E5A843' },
      handler: async (resp) => {
        const v = await fetch('/api/checkout/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(resp) });
        if (v.ok) done(d.orderNumber); else { setBusy(false); setErr(t('Payment received but verification is pending. We will confirm by email.')); }
      },
      modal: { ondismiss: () => setBusy(false) },
    });
    rz.open();
  }
  if (!items.length) return <div className="box" style={{ textAlign: 'center' }}><p style={{ color: 'var(--muted)', marginBottom: 20 }}>{t('Your bag is empty.')}</p><Link href="/collections" className="btn">{t('Browse timepieces')}</Link></div>;

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      <form className="co" onSubmit={(e) => { e.preventDefault(); place(false); }}>
        <div>
          <div className="freeship">{lang === 'hi' ? 'ऑनलाइन भुगतान पर भारत भर में निःशुल्क वितरण' : 'Free shipping across India on online payment'}</div>
          <h3 style={{ fontSize: 16, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 18 }}>{t('Delivery details')}</h3>
          <div className="two"><Fld l={t('Full name')} v={f.name} on={set('name')} /><Fld l={t('Mobile')} v={f.phone} on={set('phone')} type="tel" ph={t('10-digit')} /></div>
          <Fld l={t('Email')} v={f.email} on={set('email')} type="email" />
          <Fld l={t('Address')} v={f.address} on={set('address')} />
          <Fld l={lang === 'hi' ? 'निकटतम स्थान या लैंडमार्क (वैकल्पिक)' : 'Landmark or nearby location (optional)'} v={f.landmark} on={set('landmark')} opt />
          <div className="two"><Fld l={t('Pincode')} v={f.pincode} on={set('pincode')} max={6} /><Fld l={t('City')} v={f.city} on={set('city')} /></div>
          <Fld l={t('State')} v={f.state} on={set('state')} />
          <h3 style={{ fontSize: 16, letterSpacing: '.2em', textTransform: 'uppercase', margin: '28px 0 14px' }}>{t('Payment')}</h3>
          <label className={`opt ${method === 'online' ? 'on' : ''} ${!rzpReady ? 'dis' : ''}`}><input type="radio" checked={method === 'online'} onChange={() => setMethod('online')} /><span>{t('Pay online')}<small>{t('UPI, cards, netbanking, EMI via Razorpay')} {!rzpReady && `· ${t('Available soon')}`}</small></span></label>
          {cfg.codEnabled && (<>
            <label className={`opt ${method === 'cod' ? 'on' : ''}`}><input type="radio" checked={method === 'cod'} onChange={() => setMethod('cod')} /><span>{t('Cash on delivery')}<small>{lang === 'hi' ? 'वितरण पर भुगतान' : 'Pay when it arrives'}</small></span></label>
            {method === 'cod' && canAdv && <label className={`opt sub ${adv ? 'on' : ''}`}><input type="radio" checked={adv} onChange={() => setAdv(true)} /><span>{lang === 'hi' ? `अग्रिम ${inr(priceOrder({ subtotal, discount: disc.amount, method: 'cod', cfg, advance: true }).payNow)} अभी` : `Pay ${inr(priceOrder({ subtotal, discount: disc.amount, method: 'cod', cfg, advance: true }).payNow)} now, rest on delivery`}<small>{lang === 'hi' ? 'निःशुल्क वितरण' : 'Free shipping'}</small></span></label>}
            {method === 'cod' && canAdv && <label className={`opt sub ${!adv ? 'on' : ''}`}><input type="radio" checked={!adv} onChange={() => setAdv(false)} /><span>{lang === 'hi' ? '₹0 अभी, सब कुछ वितरण पर' : '₹0 now, everything on delivery'}<small>{lang === 'hi' ? `₹${cfg.codFee} COD शुल्क · WhatsApp कूट से पुष्टि` : `₹${cfg.codFee} COD fee · confirmed with a WhatsApp code`}</small></span></label>}
          </>)}
        </div>
        <div className="box" style={{ position: 'sticky', top: 100 }}>
          {items.map((i) => <div className="ci" key={i.id}><div className="th">{i.image ? <img src={i.image} alt="" /> : <Dial theme={i.theme} />}</div><div><div style={{ fontFamily: 'var(--f-head)', letterSpacing: '.1em', textTransform: 'uppercase', fontSize: 13 }}>{i.name}</div><small style={{ color: 'var(--muted)' }}>{t('Qty')} {i.qty}</small></div><div className="price">{inr(i.price * i.qty)}</div></div>)}
          <div style={{ display: 'flex', gap: 8, margin: '16px 0 4px' }}><input className="inp" placeholder={t('Discount code')} value={code} onChange={(e) => setCode(e.target.value)} /><button type="button" className="btn sm" onClick={applyCode}>{t('Apply')}</button></div>
          {dmsg && <div className={disc.amount ? 'ok' : 'err'}>{dmsg}</div>}
          <div className="row"><span>{t('Subtotal')}</span><span>{inr(pr.subtotal)}</span></div>
          {pr.discount > 0 && <div className="row"><span>{t('Discount')}</span><span>−{inr(pr.discount)}</span></div>}
          <div className="row"><span>{t('Shipping ')}</span><span>{pr.shipping ? inr(pr.shipping) : t('Free')}</span></div>
          <div className="row total"><span>{t('Total')}</span><span>{inr(pr.total)}</span></div>
          {method === 'cod' && pr.payNow > 0 && <><div className="row"><span>{t('Pay now')}</span><span>{inr(pr.payNow)}</span></div><div className="row"><span>{t('Due on delivery')}</span><span>{inr(pr.due)}</span></div></>}
          <small style={{ color: 'var(--muted)', display: 'block', margin: '8px 0 14px' }}>{t('Delivery in')} {lang === 'hi' ? String(deliveryDays).replace('business days', 'कार्य-दिवस') : deliveryDays}</small>
          {err && <div className="err">{err}</div>}
          <button className="btn btn-gold btn-block" disabled={busy}>{busy ? t('Please wait…') : pr.payNow > 0 ? (lang === 'hi' ? `${inr(pr.payNow)} का भुगतान करें` : `Pay ${inr(pr.payNow)}`) : t('Place order')}</button>
        </div>
      </form>
      {wa.open && (
        <div className="modal" onClick={() => setWa({ ...wa, open: false })}><div className="box" onClick={(e) => e.stopPropagation()}>
          <h3 style={{ marginBottom: 8 }}>{t('Confirm on WhatsApp')}</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 18 }}>{lang === 'hi' ? 'भेजा गया 4 अंकों का कूट दर्ज कीजिए: ' : 'Enter the 4-digit code sent to '}+91 {f.phone.replace(/\D/g, '').slice(-10)}</p>
          <input className="inp otp" maxLength={4} inputMode="numeric" autoFocus value={wa.code} onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); setWa({ ...wa, code: v }); if (v.length === 4) verifyWA(v); }} />
          {wa.msg && <div className="err">{wa.msg}</div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 13 }}>
            <button type="button" className="link-arrow" style={{ background: 'none' }} onClick={() => setWa({ ...wa, open: false })}>{t('Edit number')}</button>
            <button type="button" className="link-arrow" style={{ background: 'none', opacity: wa.timer ? .4 : 1 }} disabled={!!wa.timer} onClick={sendWA}>{wa.timer ? (lang === 'hi' ? `${wa.timer} सेकंड में पुनः भेजें` : `Resend in ${wa.timer}s`) : t('Resend code')}</button>
          </div>
        </div></div>
      )}
    </>
  );
}
function Fld({ l, v, on, type = 'text', ph, max, opt }) { return <div className="field"><label>{l}</label><input className="inp" required={!opt} value={v} onChange={on} type={type} placeholder={ph} maxLength={max} /></div>; }
