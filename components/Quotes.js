'use client';
import { useT } from '@/components/L';
// Up to two customer quotes in large serif type. Renders nothing when there are none.
export default function Quotes({ items = [] }) {
  const t = useT();
  const list = items.slice(0, 2);
  if (!list.length) return null;
  return (
    <section className="quotes" data-rv>
      <div className="eyebrow" style={{ textAlign: 'center' }}>{t('Kind words')}</div>
      <div className="q-grid">
        {list.map((r, i) => (
          <figure key={i} className="q-item">
            <blockquote>{r.quote}</blockquote>
            <figcaption><b>{r.name}</b>{r.city ? <span>{r.city}</span> : null}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
