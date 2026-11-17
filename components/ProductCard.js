import Link from '@/components/L';
import Dial from '@/components/Dial';
import { inr } from '@/lib/data';
import { getLang } from '@/lib/lang';
import { tr, COLOR_HI } from '@/lib/i18n';
import { opt, srcSet } from '@/lib/img';
import Tags from '@/components/Tags';
import { CASE_HEX, STRAP_HEX } from '@/lib/swatch';
export default function ProductCard({ p, theme = 'dhruv' }) {
  const lang = getLang(); const t = tr(lang); const c = (x) => (lang === 'hi' ? COLOR_HI[x] || x : x);
  const save = p.compare_price && p.compare_price > p.price ? Math.round((1 - p.price / p.compare_price) * 100) : 0;
  return (
    <Link href={`/products/${p.slug}`} className="ccard">
      <div className={`art th-${theme}`}><Tags tags={p.tags} t={t} className="on-img" />{(p.images?.[2] || p.images?.[0]) ? <img loading="lazy" decoding="async" src={opt(p.images[2] || p.images[0], 640)} srcSet={srcSet(p.images[2] || p.images[0], 640)} sizes="(max-width:700px) 90vw, 420px" alt={p.name} /> : <Dial theme={theme} />}</div>
      <div className="meta">
        <span className="tag">{p.stock_mode === 'waitlist' ? t('Join the waitlist') : p.stock < 1 || p.stock_mode === 'sold_out' ? t('Sold out') : save ? `${save}% ${t('off')}` : t('Japanese quartz')}</span>
        <h3>{p.name}</h3><div className="sub">{p.tagline}</div>
        {p.case_color && <div className="sub" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}><span className="sw" style={{ background: CASE_HEX[p.case_color] }} /><span className="sw s2" style={{ background: STRAP_HEX[p.strap_color] }} />{c(p.case_color)} {t('Case')} · {c(p.strap_color)} {t('Strap')}</div>}
        <div className="price">{inr(p.price)}{p.compare_price ? <s>{inr(p.compare_price)}</s> : null}</div>
      </div>
    </Link>
  );
}
