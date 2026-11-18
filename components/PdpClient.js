'use client';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import PdpGallery from '@/components/PdpGallery';
import PdpBuy from '@/components/PdpBuy';
import { opt } from '@/lib/img';
import Sparkles from '@/components/Sparkles';
import Tags from '@/components/Tags';
import Quotes from '@/components/Quotes';
import InfiniteRow from '@/components/InfiniteRow';
import Delivery from '@/components/Delivery';
import WaitlistBox from '@/components/WaitlistBox';
import CheckoutModal from '@/components/CheckoutModal';
import { CASE_HEX, STRAP_HEX } from '@/lib/swatch';
import { useLang, useT, pre } from '@/components/L';
import { px } from '@/lib/pixel';
import { COLOR_HI, hiText } from '@/lib/i18n';

const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

// Holds the chosen watch; case and strap choices swap it in place, with no page reload.
// Splits a long paragraph into two at the sentence break nearest the middle, so it reads easily.
const split2 = (txt) => {
  const t = String(txt || '').trim();
  const sent = t.match(/[^.!?।]+[.!?।]+["')\]]*\s*|[^.!?।]+$/g) || [t];
  if (sent.length < 3) return [t];
  let acc = 0, best = 0, bd = 1e9;
  for (let i = 0; i < sent.length - 1; i++) { acc += sent[i].length; const d = Math.abs(acc - t.length / 2); if (d < bd) { bd = d; best = i; } }
  return [sent.slice(0, best + 1).join('').trim(), sent.slice(best + 1).join('').trim()];
};
// Wraps every mention of the collection name in <b>.
const boldNames = (txt, names) => {
  const ns = names.filter(Boolean); if (!ns.length) return txt;
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('(' + ns.map((n) => (/^[\x00-\x7f]+$/.test(n) ? `\\b${esc(n)}\\b` : esc(n))).join('|') + ')', 'gi');
  return String(txt).split(re).map((x, i) => (i % 2 ? <b key={i}>{x}</b> : x));
};

export default function PdpClient({ reviews = [], items, startSlug, theme, eyebrow, settings, whatsapp = '', unlockedSlugs = [], wristPhotos = [], col = null, realm = null, showGlow = true, checkout = null, box = '', handPhoto = '', catalog = [] }) {
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
  useEffect(() => { px('ViewContent', { content_ids: [p.id], content_name: p.name, content_type: 'product', value: Number(p.price), currency: 'INR' }); }, [p.id]);
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
  const feats = (Array.isArray(p.features) ? p.features : []).filter((f) => !/quartz|movement|warranty|water|resistan|\bcase\b|strap|weight|size|mm\b/i.test(f) && !/dial/i.test(f));
  const dialFeat = (Array.isArray(p.features) ? p.features : []).find((f) => /dial/i.test(f));
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
          <div className="pw"><div className="wm" aria-hidden="true"><span className="w1">{lang === 'hi' ? 'युग' : 'YUG'}</span><span className="w2">{lang === 'hi' ? 'अस्त्र' : 'ASTRA'}</span></div><div className="price-row"><div className="price big">{inr(p.price)}{p.compare_price ? <s>{inr(p.compare_price)}</s> : null}{save ? <span className="save">{save}% {t('off')}</span> : null}</div></div><p className="desc">{p.description}</p></div>
          {cases.length > 1 && (<>
            <span className="label-sm">{t('Case')} · {cn(p.case_color)}</span>
            <div className="swrow">{cases.map((c) => (
              <button key={c} type="button" className={`swr ${c === p.case_color ? 'on' : ''}`} onClick={() => pick(c, p.strap_color)} aria-pressed={c === p.case_color} aria-label={cn(c)} title={cn(c)}>
                <span style={{ background: CASE_HEX[c] || '#888' }} />
              </button>))}</div></>)}
          {straps.length > 1 && (<>
            <span className="label-sm">{t('Strap')} · {cn(p.strap_color)}</span>
            <div className="swrow">{straps.map((s) => {
              const ok = !!has(p.case_color, s);
              return (<button key={s} type="button" className={`swr ${s === p.strap_color ? 'on' : ''} ${ok ? '' : 'dim'}`} onClick={() => pick(p.case_color, s)} aria-pressed={s === p.strap_color} aria-label={cn(s)} title={cn(s)}>
                <span style={{ background: STRAP_HEX[s] || '#888' }} />
              </button>);
            })}</div></>)}
          <div id="pdp-buy">{mode === 'waitlist' && gated ? <WaitlistBox p={p} whatsapp={whatsapp} unlocked={false} onUnlock={(s) => setOpen([...open, s])} /> : <PdpBuy p={buyP} theme={theme} onBuyNow={checkout ? () => setCo(true) : undefined} />}</div>
          <Delivery days={settings.delivery_days} />
        </div>
      </div>

      {p.images?.[3] && (
        <section className={`story-screen t-${theme}`}>
          {showGlow && <Sparkles theme={theme} n={26} />}
          <img src={opt(p.images[3], 1200, 85)} alt={p.name} loading="lazy" decoding="async" />
          <div className="ss-line"><div className="ss-k">{p.name}</div><h2 className="ss-h">{p.tagline}</h2><i /></div>
        </section>
      )}

      {(col?.meaning || realm) && (
        <section className="mean nomark">
          {col?.sanskrit && <div className="sk" {...rv(0)}>{col.sanskrit}</div>}
          <div className="eyebrow" style={{ marginBottom: 8, '--d': '90ms' }} data-rv>{t('What it means')}</div>
          {col?.meaning && <div className="ml" {...rv(2)}>{col.meaning}</div>}
          {realm && <div className="ml" style={{ marginTop: 10, color: 'var(--gold)', '--d': '270ms' }} data-rv>{t(realm.realm)}</div>}
        </section>
      )}

      {p.images?.[1] && (
        <div className="wrow solo">
          <div className={`wr-img t-${theme}`} data-rv>{showGlow && <Sparkles theme={theme} n={22} />}<img src={opt(p.images[1], 1080, 85)} alt={p.name} loading="lazy" decoding="async" /></div>
        </div>
      )}

      {col?.story && (
        <div className="wrow">
          <section className="mean desc-sm wr-txt">
            <h3 {...rv(0)}>{lang === 'hi' ? `${col.name} के पीछे का भाव` : `The idea behind ${col.name}`}</h3>{split2(col.story).map((x, i) => <p key={i} {...rv(i + 1)}>{boldNames(x, [col.name, col.sanskrit])}</p>)}
          </section>
        </div>
      )}

      {p.images?.[5] && (
        <div className="wrow solo">
          <div className={`wr-img t-${theme}`} data-rv>{showGlow && <Sparkles theme={theme} n={22} />}<img src={opt(p.images[5], 1080, 85)} alt={p.name} loading="lazy" decoding="async" /></div>
        </div>
      )}

      {(p.long_description || realm) && (
        <section className="mean desc-sm pabout">
          {p.long_description && (<><h3 {...rv(0)}>{lang === 'hi' ? `${p.name} के विषय में` : `About ${p.name}`}</h3>{split2(p.long_description).map((x, i) => <p key={i} {...rv(i + 1)}>{x}</p>)}</>)}
          {realm && (<><h3 {...rv(2)}>{t('The colour')}</h3><p {...rv(3)}>{t(realm.meaning)}</p></>)}
        </section>
      )}

      <section className="pdp-details">
        <div className="engr" data-rv><div><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z"/><path d="M9 12l2.2 2.2L15.5 10"/></svg><span>{lang === 'hi' ? 'एक वर्ष की वारंटी' : '1-year warranty'}</span></div><div><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg><span>{lang === 'hi' ? 'जापानी क्वार्ट्ज़' : 'Japanese quartz'}</span></div><div><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4v4h4"/></svg><span>{lang === 'hi' ? `${settings.return_days} दिन में वापसी` : `${settings.return_days}-day returns`}</span></div></div>
        {!!feats.length && <ul className="feats">{feats.map((f, n) => <li key={f} {...rv(n)}>{lang === 'hi' ? hiText(f) : f}</li>)}</ul>}
        <div className="specs">
          {Object.entries(p.specs || {}).filter(([k]) => noDim(k)).map(([k, v]) => [k, k === 'Dial' && dialFeat ? dialFeat : v]).map(([k, v], n) => <div key={k} {...rv(n)}><span>{t(k)}</span><span>{lang === 'hi' ? hiText(v) : String(v)}</span></div>)}
          <div><span>{t('Delivery')}</span><span>{lang === 'hi' ? String(settings.delivery_days).replace('business days', 'कार्य-दिवस') : settings.delivery_days}</span></div>
        </div>
      </section>

      <InfiniteRow title={t('Recently viewed')} items={recentItems} />
      <Quotes items={(reviews || []).map((r) => { const [nm, ct] = String(r.name || '').split(' · '); return { name: nm, city: ct, quote: r.body }; })} />
      <InfiniteRow title={t('Related watches')} items={related} />
      <div className="hair" aria-hidden="true" />

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
