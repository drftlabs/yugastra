import { requireAdmin } from '@/lib/admin';
import Preview from '@/components/admin/Preview';
import { saveSettings } from '@/lib/actions/admin';
import { getSettings } from '@/lib/data';
const F = ({ n, l, v, t = 'text', h }) => <div className="field"><label>{l}</label><input className="inp" name={n} type={t} defaultValue={v ?? ''} />{h && <small style={{ color: 'var(--muted)' }}>{h}</small>}</div>;
export default async function P() {
  const { db } = await requireAdmin('settings'); if (!db) return <Preview />;
  const s = await getSettings();
  return <><h1>Settings</h1><form action={saveSettings} className="box" style={{ maxWidth: 680 }}>
    <div className="eyebrow">Shipping</div><div className="two" style={{ marginTop: 12 }}><F n="free_shipping_min" l="Free shipping above (₹)" v={s.free_shipping_min} t="number" h="0 = shipping fee never applies when fee is 0" /><F n="shipping_fee" l="Shipping fee (₹)" v={s.shipping_fee} t="number" /></div>
    <div className="two"><F n="delivery_days" l="Delivery time" v={s.delivery_days} /><F n="return_days" l="Return window (days)" v={s.return_days} t="number" /></div>
    <div className="eyebrow" style={{ margin: '14px 0 12px' }}>Cash on delivery</div>
    <label style={{ display: 'flex', gap: 10, marginBottom: 14 }}><input type="checkbox" name="cod_enabled" defaultChecked={s.cod_enabled === true || s.cod_enabled === 'true'} /> Enable COD</label>
    <div className="two"><F n="cod_fee" l="COD fee (₹)" v={s.cod_fee} t="number" /><F n="cod_prepaid_pct" l="Advance % (on product amount)" v={s.cod_prepaid_pct} t="number" /></div>
    <F n="cod_prepaid_flat" l="Flat advance (₹) — overrides %" v={s.cod_prepaid_flat} t="number" h="COD has two forms: pay an advance now (free shipping), or pay ₹0 now with the COD fee above and a WhatsApp code to confirm. Set advance to 0 to offer only the second." />
    <div className="eyebrow" style={{ margin: '14px 0 12px' }}>Prepaid (online payment) discount</div>
    <label style={{ display: 'flex', gap: 10, marginBottom: 14 }}><input type="checkbox" name="prepaid_discount_on" defaultChecked={s.prepaid_discount_on === true || s.prepaid_discount_on === 'true'} /> Give a discount on online payment</label>
    <F n="prepaid_discount_pct" l="Prepaid discount (%)" v={s.prepaid_discount_pct} t="number" h="For example 5 or 10. Applied on the order value after any coupon, only when the customer pays online. Cash on delivery does not get it." />
    <div className="eyebrow" style={{ margin: '14px 0 12px' }}>Tracking</div>
    <F n="meta_pixel_id" l="Meta (Facebook) Pixel ID" v={s.meta_pixel_id} h="Digits only, from Meta Events Manager. Tracks PageView, ViewContent, AddToCart, InitiateCheckout and Purchase. Leave empty to turn it off." />
    <div className="eyebrow" style={{ margin: '14px 0 12px' }}>Site</div><F n="ticker" l="Top ticker text" v={s.ticker} /><F n="hero_multi" l="Home hero: type yes to rotate through all slides (default: first slide only)" v={s.hero_multi} /><F n="ticker_hi" l="Top ticker text, in Hindi (optional)" v={s.ticker_hi} /><F n="whatsapp" l="WhatsApp chat number (with country code)" v={s.whatsapp} />
    <button className="btn-buy" style={{ maxWidth: 260 }}>Save settings</button></form></>;
}
