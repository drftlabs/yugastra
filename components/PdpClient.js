'use client';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import PdpGallery from '@/components/PdpGallery';
import PdpBuy from '@/components/PdpBuy';
import { opt } from '@/lib/img';
import Sparkles from '@/components/Sparkles';
import Tags from '@/components/Tags';
import ProdRow from '@/components/ProdRow';
import Delivery from '@/components/Delivery';
import WaitlistBox from '@/components/WaitlistBox';
import CheckoutModal from '@/components/CheckoutModal';
import { CASE_HEX, STRAP_HEX } from '@/lib/swatch';
import { useLang, useT, pre } from '@/components/L';
import { COLOR_HI, hiText } from '@/lib/i18n';

const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

// Holds the chosen watch; case and strap choices swap it in place, with no page reload.
export default function PdpClient({ items, startSlug, theme, eyebrow, settings, whatsapp = '', unlockedSlugs = [], wristPhotos = [], col = null, realm = null, showGlow = true, checkout = null, box = '', handPhoto = '', catalog = [] }) {
  const t = useT(); const lang = useLang(); const cn = (x) => (lang === 'hi' ? COLOR_HI[x] || x : x);
  const [slug, setSlug] = useState(startSlug);
  const bar = true; const [co, setCo] = useState(false);
  const [open, setOpen] = useState(unlockedSlugs);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const p = items.find((x) => x.slug === slug) || items[0];
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    try {
      const old = JSON.parse(localStorage.getItem('yg_recent') || '[]').filter((x) => x !== p.slug);
      setRecent(old); localStorage.setItem('yg_recent', JSON.stringify([p.slug, ...old].slice(0, 12)));
    } catch {}
  }, [p.slug]);
  const byslug = Object.fromEntries(catalog.map((c) => [c.slug, c]));
  const related = [...catalog.filter((c) => c.slug !== p.slug && c.col === col?.name), ...catalog.filter((c) => c.slug !== p.slug && c.col !== col?.name)].slice(0, 8);
  const recentItems = recent.map((s) => byslug[s]).filter(Boolean).slice(0, 8);
  const cases = useMemo(() => [...new Set(items.map((x) => x.case_color).filter(Boolean))], [items]);
  const straps = useMemo(() => [...new Set(items.map((x) => x.strap_color).filter(Boolean))], [items]);
  const has = (c, s) => items.find((x) => x.case_color === c && x.strap_color === s);
  const pick = (c, s) => {
    const m = has(c, s) || items.find((x) => x.case_color === c) || items.find((x) => x.strap_color === s);
    if (m) { setSlug(m.slug); try { history.replaceState(null, '', pre(lang, `/products/${m.slug}`)); document.title = m.seo_title || m.name; } catch {} }
  };
  const save = p.compare_price && p.compare_price > p.price ? Math.round((1 - p.price / p.compare_price) * 100) : 0;
  const feats = Array.isArray(p.features) ? p.features : [];
  const mode = p.stock_mode || 'in_stock';
  const gated = mode === 'waitlist' && !open.includes(p.slug);
const short = (col?.name && p.name.toUpperCase().startsWith(col.name.toUpperCase()) ? p.name.slice(col.name.length).trim() : p.name) || p.name;
  const buyP = { id: p.id, slug: p.slug, name: p.name, price: p.price, images: p.images, stock: mode === 'sold_out' ? 0 : p.stock };
  const rv = (i) => ({ 'data-rv': '', style: { '--d': `${i * 90}ms` } });
  const noDim = (k) => !/^(sku|fits|size|dimension|case size|lug|diameter|thickness)/i.test(k);
  const meaning = col?.meaning || realm;
  return (
    <>
      <div className="pdp">
        <div className="pdp-galwrap">
          <div className="tg-row"><Tags tags={p.tags} t={t} /></div>
          <PdpGallery key={p.id} images={p.images || []} theme={theme} name={p.name} caseColor={p.case_color} strap={p.strap_color} video={p.video} box={box} showGlow={showGlow} hindiLine={p.hindi_line} />
        </div>
        <div className="pdp-info">
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h1>{p.name}</h1><div className="serif ptag">{p.tagline}</div>
          <div className="price big">{inr(p.price)}{p.compare_price ? <s>{inr(p.compare_price)}</s> : null}{save ? <span className="save">{save}% {t('off')}</span> : null}</div>
          <p className="desc">{p.description}</p>
          {cases.length > 1 && (<>
            <span className="label-sm">{t('Case')} · {cn(p.case_color)}</span>
            <div className="chips">{cases.map((c) => (
              <button key={c} type="button" className={`chip ${c === p.case_color ? 'on' : ''}`} onClick={() => pick(c, p.strap_color)} aria-pressed={c === p.case_color}>
                <span className="sw" style={{ background: CASE_HEX[c] || '#888' }} />{cn(c)}
              </button>))}</div></>)}
          {straps.length > 1 && (<>
            <span className="label-sm">{t('Strap')} · {cn(p.strap_color)}</span>
            <div className="chips">{straps.map((s) => {
              const ok = !!has(p.case_color, s);
              return (<button key={s} type="button" className={`chip ${s === p.strap_color ? 'on' : ''} ${ok ? '' : 'dim'}`} onClick={() => pick(p.case_color, s)} aria-pressed={s === p.strap_color}>
                <span className="sw" style={{ background: STRAP_HEX[s] || '#888' }} />{cn(s)}
              </button>);
            })}</div></>)}
          <div id="pdp-buy">{mode === 'waitlist' && gated ? <WaitlistBox p={p} whatsapp={whatsapp} unlocked={false} onUnlock={(s) => setOpen([...open, s])} /> : <PdpBuy p={buyP} theme={theme} onBuyNow={checkout ? () => setCo(true) : undefined} />}</div>
          <Delivery days={settings.delivery_days} />
        </div>
      </div>

      {(col?.meaning || realm) && (
        <section className="mean nomark">
          {col?.sanskrit && <div className="sk" {...rv(0)}>{col.sanskrit}</div>}
          <div className="eyebrow" style={{ marginBottom: 8, '--d': '90ms' }} data-rv>{t('What it means')}</div>
          {col?.meaning && <div className="ml" {...rv(2)}>{col.meaning}</div>}
          {realm && <div className="ml" style={{ marginTop: 10, color: 'var(--gold)', '--d': '270ms' }} data-rv>{t(realm.realm)} · {t(realm.colour)}</div>}
        </section>
      )}
      {p.images?.[3] && (<div className={`edge sq t-${theme}`} data-rv>{showGlow && <Sparkles theme={theme} n={22} />}<img src={opt(p.images[3], 1080, 85)} alt={p.name} loading="lazy" decoding="async" /></div>)}

      <div className={`wrow ${p.images?.[5] ? 'has' : ''}`}>
        {p.images?.[5] && (<div className={`wr-img t-${theme}`} data-rv>{showGlow && <Sparkles theme={theme} n={22} />}<img src={opt(p.images[5], 1080, 85)} alt={p.name} loading="lazy" decoding="async" /></div>)}
        {(p.long_description || realm) && (
          <section className="mean desc-sm wr-txt">
            {p.long_description && (<><h3 {...rv(0)}>{lang === 'hi' ? `${p.name} के विषय में` : `About ${p.name}`}</h3><p {...rv(1)}>{p.long_description}</p></>)}
            {realm && (<><h3 {...rv(2)}>{t('The colour')}</h3><p {...rv(3)}>{t(realm.meaning)}</p></>)}
          </section>
        )}
      </div>

      <section className="pdp-details">
        <div className="assure" data-rv><div>{lang === 'hi' ? <>एक वर्ष की<br />वारंटी</> : <>1-year<br />warranty</>}</div><div>{lang === 'hi' ? <>जापानी<br />क्वार्ट्ज़</> : <>Japanese<br />quartz</>}</div><div>{lang === 'hi' ? <>{settings.return_days} दिन में<br />वापसी</> : <>{settings.return_days}-day<br />returns</>}</div></div>
        {!!feats.length && <ul className="feats">{feats.map((f, n) => <li key={f} {...rv(n)}>{lang === 'hi' ? hiText(f) : f}</li>)}</ul>}
        <div className="specs">
          {Object.entries(p.specs || {}).filter(([k]) => noDim(k)).map(([k, v], n) => <div key={k} {...rv(n)}><span>{t(k)}</span><span>{lang === 'hi' ? hiText(v) : String(v)}</span></div>)}
          <div><span>{t('Delivery')}</span><span>{lang === 'hi' ? String(settings.delivery_days).replace('business days', 'कार्य-दिवस') : settings.delivery_days}</span></div>
        </div>
      </section>

      <ProdRow title={t('Recently viewed')} items={recentItems} />
      <ProdRow title={t('Related watches')} items={related} />

      {col?.story && (
        <section className="mean desc-sm brand">
          <h3 {...rv(0)}>{lang === 'hi' ? `${col.name} के पीछे का भाव` : `The idea behind ${col.name}`}</h3><p {...rv(1)}>{col.story}</p>
        </section>
      )}
      {mounted && createPortal(
      <div className={`sticky-buy ${bar ? 'show' : ''}`} aria-hidden={!bar}>
        <div className="sb-in">
          <div className="sb-name"><b>{short}</b><span>{inr(p.price)}</span></div>
          {gated ? <a className="btn-black sm" href="#pdp-buy">{t('Join the waitlist')}</a> : <PdpBuy p={buyP} theme={theme} compact onBuyNow={checkout ? () => setCo(true) : undefined} />}
        </div>
      </div>
      , document.body)}
      {checkout && <CheckoutModal open={co} onClose={() => setCo(false)} checkout={checkout} />}
    </>
  );
}
