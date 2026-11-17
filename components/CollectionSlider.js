'use client';
import { useEffect, useRef, useState } from 'react';
import Link from '@/components/L';
import Sparkles from '@/components/Sparkles';
import Dial from '@/components/Dial';
import { opt } from '@/lib/img';
// All five collections in one row. Each card shows the watch at the left corner, in the collection's colour,
// with the next card peeking in on the right. A very thin slider sits below.
export default function CollectionSlider({ items = [], discover = 'Discover →' }) {
  const tr = useRef(null); const [p, setP] = useState(0);
  const sync = () => { const e = tr.current; if (!e) return; const m = e.scrollWidth - e.clientWidth; setP(m > 0 ? e.scrollLeft / m : 0); };
  useEffect(() => { sync(); }, []);
  const drag = (v) => { const e = tr.current; if (!e) return; e.scrollTo({ left: (e.scrollWidth - e.clientWidth) * v, behavior: 'auto' }); };
  return (
    <section className="cslide" data-rv>
      <div className="cs-track" ref={tr} onScroll={sync}>
        {items.map((c) => (
          <article key={c.slug} className={`cs-card t-${c.theme}`}>
            <Link href={`/collections/${c.slug}`} className="cs-hit" aria-label={c.name} />
            <div className="cs-art">
              <div className="cs-glow" aria-hidden="true" /><Sparkles theme={c.theme} n={14} />
              {c.image ? <img src={opt(c.image, 480, 82)} alt={c.name} loading="lazy" decoding="async" /> : <Dial theme={c.theme} />}
            </div>
            <div className="cs-copy">
              <div className="eyebrow">{c.realm}</div>
              <h2 className="cs-name">{c.name}{c.sanskrit && <span className="hi-sub">{c.sanskrit}</span>}</h2>
              <h3 className="cs-head">{c.headline}</h3>
              <p>{c.description}</p>
              <span className="btn btn-disc">{discover}</span>
            </div>
          </article>
        ))}
      </div>
      <input className="cs-range" type="range" min="0" max="1000" value={Math.round(p * 1000)} onChange={(e) => drag(e.target.value / 1000)} aria-label="Slide collections" />
    </section>
  );
}
