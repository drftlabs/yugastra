'use client';
import Link from '@/components/L';
import { opt } from '@/lib/img';
import Tags from '@/components/Tags';
import { useT } from '@/components/L';
const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
// Horizontal, swipeable row of watches (up to 8): photo, name and price.
export default function ProdRow({ title, items = [] }) {
  const t = useT();
  if (!items.length) return null;
  return (
    <section className="prow" data-rv>
      <h3 className="prow-h">{title}</h3>
      <div className="prow-track">
        {items.slice(0, 8).map((p, n) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="prow-card" data-rv style={{ '--d': `${Math.min(n, 4) * 70}ms` }}>
            <div className="pr-art">{p.image ? <img loading="lazy" decoding="async" src={opt(p.image, 384)} alt={p.name} /> : null}<Tags tags={p.tags} t={t} className="on-img" /></div>
            <div className="pr-name">{p.name}</div>
            <div className="pr-price">{inr(p.price)}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
