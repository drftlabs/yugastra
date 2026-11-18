'use client';
import { useEffect, useRef } from 'react';
import Link from '@/components/L';
import { opt } from '@/lib/img';
import Tags from '@/components/Tags';
import { useT } from '@/components/L';
const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
// Endless row: it drifts slowly on its own, and can be swiped (touch) or dragged (mouse) in either direction. Loops seamlessly.
export default function InfiniteRow({ title, items = [], big = false }) {
  const t = useT(); const win = useRef(null);
  let base = items; while (base.length && base.length < 10) base = [...base, ...items];
  const loop = [...base, ...base];
  useEffect(() => {
    const el = win.current; if (!el || !items.length) return;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, paused = false, resume = 0, down = false, sx = 0, sl = 0, moved = 0;
    const half = () => el.scrollWidth / 2;
    const wrap = () => { const h = half(); if (!h) return; if (el.scrollLeft >= h) el.scrollLeft -= h; else if (el.scrollLeft <= 0) el.scrollLeft += h; };
    const tick = () => { if (!paused && !down && !calm) { el.scrollLeft += big ? 0.55 : 0.42; wrap(); } raf = requestAnimationFrame(tick); };
    const hold = () => { paused = true; clearTimeout(resume); resume = setTimeout(() => { paused = false; }, 2600); };
    const onScroll = () => { wrap(); };
    const pd = (e) => { if (e.pointerType === 'mouse') { down = true; sx = e.clientX; sl = el.scrollLeft; moved = 0; el.classList.add('drag'); } hold(); };
    const pm = (e) => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); el.scrollLeft = sl - dx; wrap(); };
    const pu = () => { if (down) { down = false; el.classList.remove('drag'); hold(); } };
    const click = (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } moved = 0; };
    el.scrollLeft = half() / 4; raf = requestAnimationFrame(tick);
    el.addEventListener('scroll', onScroll, { passive: true }); el.addEventListener('touchstart', hold, { passive: true }); el.addEventListener('wheel', hold, { passive: true });
    el.addEventListener('pointerdown', pd); window.addEventListener('pointermove', pm); window.addEventListener('pointerup', pu); el.addEventListener('click', click, true);
    return () => { cancelAnimationFrame(raf); clearTimeout(resume); el.removeEventListener('scroll', onScroll); el.removeEventListener('touchstart', hold); el.removeEventListener('wheel', hold); el.removeEventListener('pointerdown', pd); window.removeEventListener('pointermove', pm); window.removeEventListener('pointerup', pu); el.removeEventListener('click', click, true); };
  }, [items.length, big]);
  if (!items.length) return null;
  return (
    <section className={`irow ${big ? 'big' : ''}`} data-rv>
      <h3 className="prow-h">{title}</h3>
      <div className="irow-win" ref={win}>
        <div className="irow-track">
          {loop.map((p, n) => (
            <Link key={n} href={`/products/${p.slug}`} className="prow-card" draggable={false} tabIndex={n >= base.length ? -1 : 0} aria-hidden={n >= base.length}>
              <div className={`pr-art t-${p.theme || 'brand'}`}>{p.image ? <img loading="lazy" decoding="async" draggable={false} src={opt(p.image, 384)} alt={p.name} /> : null}<Tags tags={p.tags} t={t} className="on-img" /></div>
              <div className="pr-name">{p.name}</div>
              <div className="pr-price">{inr(p.price)}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
