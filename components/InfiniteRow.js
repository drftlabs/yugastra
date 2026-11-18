'use client';
import Link from '@/components/L';
import { opt } from '@/lib/img';
import Tags from '@/components/Tags';
import { useT } from '@/components/L';
const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
// Continuous, endless slider: the row drifts left forever and loops seamlessly. Pauses on touch / hover.
export default function InfiniteRow({ title, items = [], big = false }) {
  const t = useT();
  if (!items.length) return null;
  let base = items; while (base.length < 10) base = [...base, ...items];
  const loop = [...base, ...base];
  return (
    <section className={`irow ${big ? 'big' : ''}`} data-rv>
      <h3 className="prow-h">{title}</h3>
      <div className="irow-win">
        <div className="irow-track" style={{ '--n': base.length }}>
          {loop.map((p, n) => (
            <Link key={n} href={`/products/${p.slug}`} className="prow-card" tabIndex={n >= base.length ? -1 : 0} aria-hidden={n >= base.length}>
              <div className={`pr-art t-${p.theme || 'brand'}`}>{p.image ? <img loading="lazy" decoding="async" src={opt(p.image, 384)} alt={p.name} /> : null}<Tags tags={p.tags} t={t} className="on-img" /></div>
              <div className="pr-name">{p.name}</div>
              <div className="pr-price">{inr(p.price)}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
