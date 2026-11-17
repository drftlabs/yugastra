'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Link, { useLang, useT, pre } from '@/components/L';
import { useShop } from '@/components/ShopProvider';
import { opt } from '@/lib/img';
import Dial from '@/components/Dial';
import { priceOrder, hasAdvance } from '@/lib/pricing';
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
// Always returns an object, even if the server sends HTML or nothing (so the form never fails silently).
const jfetch = async (url, body) => {
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, ...d };
  } catch { return { ok: false, status: 0, error: 'Network problem. Please check your connection and try again.' }; }
};

export default function CheckoutForm({ cfg, rzpReady, waEnabled, deliveryDays }) {
  const lang = useLang(); const t = useT();
  const { items, subtotal, clear } = useShop(); const r = useRouter();
  const [f, setF] = useState({ name: '', email: '', phone: '', address: '', landmark: '', city: '', state: '', pincode: '' });
  const [method, setMethod] = useState(rzpReady ? 'online' : cfg.codEnabled ? 'cod' : 'online');
  const canAdv = hasAdvance(cfg); const [adv, setAdv] = useState(canAdv);
  const [code, setCode] = useState(''); const [disc, setDisc] = useState({ amount: 0, code: '' }); const [dmsg, setDmsg] = useState('');
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const [wa, setWa] = useState({ open: false, sent: false, code: '', timer: 0, msg: '', busy: false });
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
    const d = await jfetch('/api/checkout/discount', { code, subtotal });
    if (d.ok) { setDisc({ amount: d.amount, code: d.code }); setDmsg(`${lang === 'hi' ? 'कूट लागू हुआ' : 'Code applied'}: −${inr(d.amount)}`); } else { setDisc({ amount: 0, code: '' }); setDmsg(t(d.error || 'Invalid code')); }
  }
  async function sendWA() {
    setWa((w) => ({ ...w, msg: '' }));
    const d = await jfetch('/api/whatsapp/send', { phone: f.phone });
    if (!d.ok) return setWa((w) => ({ ...w, open: true, sent: false, msg: t(d.error || 'Could not send the code. Please try again.') }));
    setWa({ open: true, sent: true, code: '', timer: 30, msg: '', busy: false });
  }
  async function verifyWA(c) {
    setWa((w) => ({ ...w, busy: true, msg: '' }));
    const d = await jfetch('/api/whatsapp/verify', { phone: f.phone, code: c });
    if (!d.ok) return setWa((w) => ({ ...w, busy: false, msg: t(d.error || 'Incorrect code.'), code: '' }));
    setWa({ open: false, sent: false, code: '', timer: 0, msg: '', busy: false }); place(true);
  }
  async function place(verified) {
    setErr('');
    const ph = f.phone.replace(/\D/g, '').slice(-10);
    if (!f.name.trim() || !/^[6-9]\d{9}$/.test(ph) || !/^\S+@\S+\.\S+$/.test(f.email) || !f.address.trim() || !/^\d{6}$/.test(f.pincode)) return setErr(lang === 'hi' ? 'कृपया नाम, 10 अंकों का मोबाइल, ईमेल, पता और 6 अंकों का पिनकोड सही-सही भरें।' : 'Please fill in your name, 10-digit mobile, email, address and 6-digit pincode.');
    if (needWA && !verified) return sendWA();
    setBusy(true);
    const d = await jfetch('/api/checkout/create', { items: items.map((i) => ({ id: i.id, qty: i.qty })), customer: { ...f, phone: ph }, method, advance: adv, code: disc.code, lang });
    if (!d.ok) { setBusy(false); if (d.needWA) return sendWA(); return setErr(t(d.error || 'Something went wrong.') + (d.status ? ` (${d.status})` : '')); }
    const done = (n) => { clear(); r.push(pre(lang, `/checkout/success?o=${n}&due=${d.due || 0}`)); };
    if (d.cod) return done(d.orderNumber);
    if (!window.Razorpay) await new Promise((ok) => { const sc = document.createElement('script'); sc.src = 'https://checkout.razorpay.com/v1/checkout.js'; sc.onload = ok; sc.onerror = ok; document.body.appendChild(sc); });
    if (!window.Razorpay) { setBusy(false); return setErr(t('Could not load the payment window. Check your connection and try again.')); }
    try {
      const rz = new window.Razorpay({
        key: d.key, order_id: d.razorpayOrderId, amount: d.amount, currency: 'INR', name: 'YUGASTRA',
        description: `Order ${d.orderNumber}`, prefill: d.prefill, theme: { color: '#cf8a2c' },
        handler: async (resp) => {
          const v = await jfetch('/api/checkout/verify', resp);
          if (v.ok) done(d.orderNumber); else { setBusy(false); setErr(t('Payment received but verification is pending. We will confirm by email.')); }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rz.on?.('payment.failed', (x) => { setBusy(false); setErr(x?.error?.description || t('Payment failed. Please try again.')); });
      rz.open();
    } catch { setBusy(false); setErr(t('Could not open the payment window. Please try again.')); }
  }
  if (!items.length) return <div className="box" style={{ textAlign: 'center' }}><p style={{ color: 'var(--muted)', marginBottom: 20 }}>{t('Your bag is empty.')}</p><Link href="/collections" className="btn">{t('Browse timepieces')}</Link></div>;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <form className="co" onSubmit={(e) => { e.preventDefault(); place(false); }} noValidate>
        <div>
          <div className="freeship">{lang === 'hi' ? 'ऑनलाइन भुगतान पर भारत भर में निःशुल्क वितरण' : 'Free shipping across India on online payment'}</div>
          <h3 className="co-h"><i>1</i>{t('Your details')}</h3>
          <div className="two"><Fld l={t('Full name')} v={f.name} on={set('name')} /><Fld l={t('Mobile')} v={f.phone} on={set('phone')} type="tel" ph={t('10-digit')} /></div>
          <Fld l={t('Email')} v={f.email} on={set('email')} type="email" />
          <h3 className="co-h"><i>2</i>{t('Delivery address')}</h3>
          <Fld l={t('Address')} v={f.address} on={set('address')} />
          <Fld l={lang === 'hi' ? 'निकटतम स्थान या लैंडमार्क (वैकल्पिक)' : 'Landmark (optional)'} v={f.landmark} on={set('landmark')} opt />
          <div className="two"><Fld l={t('Pincode')} v={f.pincode} on={set('pincode')} max={6} /><Fld l={t('City')} v={f.city} on={set('city')} /></div>
          <Fld l={t('State')} v={f.state} on={set('state')} />
          <h3 className="co-h"><i>3</i>{t('How would you like to pay?')}</h3>
          <label className={`opt ${method === 'online' ? 'on' : ''} ${!rzpReady ? 'dis' : ''}`}><input type="radio" checked={method === 'online'} onChange={() => setMethod('online')} /><span>{t('Pay online')}<small>{lang === 'hi' ? 'UPI, कार्ड, नेटबैंकिंग · भुगतान होते ही आदेश पूर्ण' : 'UPI, cards, netbanking · your order is complete the moment you pay'} {!rzpReady && `· ${t('Available soon')}`}</small></span></label>
          {cfg.codEnabled && (<>
            <label className={`opt ${method === 'cod' ? 'on' : ''}`}><input type="radio" checked={method === 'cod'} onChange={() => setMethod('cod')} /><span>{t('Cash on delivery')}<small>{lang === 'hi' ? 'वितरण पर भुगतान' : 'Pay when it arrives'}</small></span></label>
            {method === 'cod' && canAdv && <label className={`opt sub ${adv ? 'on' : ''}`}><input type="radio" checked={adv} onChange={() => setAdv(true)} /><span>{lang === 'hi' ? `अभी ${inr(priceOrder({ subtotal, discount: disc.amount, method: 'cod', cfg, advance: true }).payNow)}, शेष वितरण पर` : `Pay ${inr(priceOrder({ subtotal, discount: disc.amount, method: 'cod', cfg, advance: true }).payNow)} now, the rest on delivery`}<small>{lang === 'hi' ? 'निःशुल्क वितरण' : 'Free shipping'}</small></span></label>}
            {method === 'cod' && canAdv && <label className={`opt sub ${!adv ? 'on' : ''}`}><input type="radio" checked={!adv} onChange={() => setAdv(false)} /><span>{lang === 'hi' ? '₹0 अभी, पूरा भुगतान वितरण पर' : '₹0 now, everything on delivery'}<small>{lang === 'hi' ? `₹${cfg.codFee} COD शुल्क · WhatsApp कूट से पुष्टि` : `₹${cfg.codFee} COD fee · confirmed with a WhatsApp code`}</small></span></label>}
          </>)}
        </div>
        <div className="box co-sum">
          {items.map((i) => <div className="ci" key={i.id}><div className="th">{i.image ? <img loading="lazy" decoding="async" src={opt(i.image, 128)} alt="" /> : <Dial theme={i.theme} />}</div><div><div style={{ fontFamily: 'var(--f-head)', letterSpacing: '.1em', textTransform: 'uppercase', fontSize: 13 }}>{i.name}</div><small style={{ color: 'var(--muted)' }}>{t('Qty')} {i.qty}</small></div><div className="price">{inr(i.price * i.qty)}</div></div>)}
          <div style={{ display: 'flex', gap: 8, margin: '16px 0 4px' }}><input className="inp" placeholder={t('Discount code')} value={code} onChange={(e) => setCode(e.target.value)} /><button type="button" className="btn sm" onClick={applyCode}>{t('Apply')}</button></div>
          {dmsg && <div className={disc.amount ? 'ok' : 'err'}>{dmsg}</div>}
          <div className="row"><span>{t('Subtotal')}</span><span>{inr(pr.subtotal)}</span></div>
          {pr.discount > 0 && <div className="row"><span>{t('Discount')}</span><span>−{inr(pr.discount)}</span></div>}
          <div className="row"><span>{t('Shipping ')}</span><span>{pr.shipping ? inr(pr.shipping) : t('Free')}</span></div>
          <div className="row total"><span>{t('Total')}</span><span>{inr(pr.total)}</span></div>
          {method === 'cod' && pr.payNow > 0 && <><div className="row"><span>{t('Pay now')}</span><span>{inr(pr.payNow)}</span></div><div className="row"><span>{t('Due on delivery')}</span><span>{inr(pr.due)}</span></div></>}
          <small style={{ color: 'var(--muted)', display: 'block', margin: '8px 0 14px' }}>{t('Delivery in')} {lang === 'hi' ? String(deliveryDays).replace('business days', 'कार्य-दिवस') : deliveryDays}</small>
          {err && <div className="err co-err">{err}</div>}
          <button className="btn-buy btn-block" disabled={busy}>{busy ? t('Please wait…') : method === 'online' ? (lang === 'hi' ? `${inr(pr.payNow)} का भुगतान करें` : `Pay ${inr(pr.payNow)}`) : pr.payNow > 0 ? (lang === 'hi' ? `${inr(pr.payNow)} देकर आदेश दें` : `Pay ${inr(pr.payNow)} & place order`) : t('Place COD order')}</button>
          <small className="co-help">{method === 'online' ? (lang === 'hi' ? 'एक सुरक्षित भुगतान विंडो खुलेगी। भुगतान होते ही आपका आदेश पूर्ण हो जाएगा।' : 'A secure payment window opens. Your order is complete as soon as you pay.') : needWA ? (lang === 'hi' ? 'हम आपके WhatsApp पर 4 अंकों का कूट भेजेंगे। उसे दर्ज करते ही आपका आदेश पूर्ण हो जाएगा।' : 'We will send a 4-digit code to your WhatsApp. Enter it and your order is complete.') : (lang === 'hi' ? 'वितरण पर भुगतान कीजिए।' : 'You pay when the watch arrives.')}</small>
        </div>
      </form>
      {wa.open && (
        <div className="modal" onClick={() => setWa({ ...wa, open: false })}><div className="box" onClick={(e) => e.stopPropagation()}>
          <h3 style={{ marginBottom: 8 }}>{lang === 'hi' ? 'WhatsApp पर आदेश की पुष्टि कीजिए' : 'Confirm your order on WhatsApp'}</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 18 }}>{lang === 'hi' ? 'भेजा गया 4 अंकों का कूट दर्ज कीजिए: ' : 'Enter the 4-digit code sent to '}+91 {f.phone.replace(/\D/g, '').slice(-10)}</p>
          <input className="inp otp" maxLength={4} inputMode="numeric" autoFocus value={wa.code} disabled={wa.busy} onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); setWa({ ...wa, code: v }); if (v.length === 4) verifyWA(v); }} />
          {wa.busy && <div className="ok">{lang === 'hi' ? 'आपका आदेश दर्ज हो रहा है…' : 'Placing your order…'}</div>}
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
