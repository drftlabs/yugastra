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
    <div className="eyebrow" style={{ margin: '14px 0 12px' }}>Site</div><F n="ticker" l="Top ticker text" v={s.ticker} /><F n="hero_multi" l="Home hero: type yes to rotate through all slides (default: first slide only)" v={s.hero_multi} /><F n="ticker_hi" l="Top ticker text, in Hindi (optional)" v={s.ticker_hi} /><F n="whatsapp" l="WhatsApp chat number (with country code)" v={s.whatsapp} />
    <button className="btn btn-gold">Save settings</button></form></>;
}
