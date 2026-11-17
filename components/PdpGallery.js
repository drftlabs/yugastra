'use client';
import { useEffect, useRef, useState } from 'react';
import Dial from '@/components/Dial';
import { opt } from '@/lib/img';
import Sparkles from '@/components/Sparkles';
import { useT } from '@/components/L';
// Auto-sliding gallery: 5 s per photo, swipe to move, loops. Transparent PNGs sit on the realm glow.
// Zoom works only on the photo: double-tap / double-click, or pinch.
const MS = 3850; // 30% faster than the earlier 5 s
export default function PdpGallery({ images = [], box = '', theme, name, caseColor = 'Silver', strap = '', video = '', showGlow = true, hindiLine = '' }) {
  const t = useT();
  const slides = [...images.map((s) => ({ t: 'img', s })), ...(video ? [{ t: 'vid', s: video }] : []), ...(box ? [{ t: 'img', s: box }] : [])];
  const n = slides.length;
  const [i, setI] = useState(0);
  const [z, setZ] = useState({ s: 1, x: 0, y: 0 });
  const [drag, setDrag] = useState(0);
  const st = useRef({ pts: {}, sx: 0, d0: 0, s0: 1, last: 0 });
  const zoomed = z.s > 1.02;
  useEffect(() => { setZ({ s: 1, x: 0, y: 0 }); }, [i]);
  useEffect(() => {
    if (n < 2 || zoomed || drag) return;
    const id = setTimeout(() => setI((x) => (x + 1) % n), MS);
    return () => clearTimeout(id);
  }, [i, n, zoomed, drag]);
  const dist = () => { const p = Object.values(st.current.pts); return p.length > 1 ? Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) : 0; };
  const down = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const s = st.current; s.pts[e.pointerId] = { x: e.clientX, y: e.clientY }; s.sx = e.clientX; s.px = e.clientX; s.py = e.clientY;
    if (Object.keys(s.pts).length === 2) { s.d0 = dist(); s.s0 = z.s; }
    const now = Date.now();
    if (Object.keys(s.pts).length === 1 && now - s.last < 300) {
      const r = e.currentTarget.getBoundingClientRect();
      setZ(zoomed ? { s: 1, x: 0, y: 0 } : { s: 2.4, x: (0.5 - (e.clientX - r.left) / r.width) * r.width * 1.4, y: (0.5 - (e.clientY - r.top) / r.height) * r.height * 1.4 });
    }
    s.last = now;
  };
  const moveP = (e) => {
    const s = st.current; if (!s.pts[e.pointerId]) return;
    const prev = s.pts[e.pointerId]; s.pts[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (Object.keys(s.pts).length === 2) { const d = dist(); if (s.d0) setZ((a) => ({ ...a, s: Math.min(4, Math.max(1, s.s0 * d / s.d0)) })); return; }
    if (zoomed) setZ((a) => ({ ...a, x: a.x + e.clientX - prev.x, y: a.y + e.clientY - prev.y }));
    else if (e.pointerType !== 'mouse' || e.buttons) setDrag(e.clientX - s.sx);
  };
  const up = (e) => {
    const s = st.current; delete s.pts[e.pointerId];
    if (!zoomed && Math.abs(drag) > 50 && n > 1) setI((x) => (x + (drag < 0 ? 1 : -1) + n) % n);
    setDrag(0);
    if (z.s < 1.05) setZ({ s: 1, x: 0, y: 0 });
  };
  return (
    <div className="pdp-gal">
      <div className={`main ${n ? 'zoomable has-img' : 'floor'}`}>
        {showGlow && <><div className={`pglow t-${theme}`} aria-hidden="true" /><Sparkles theme={theme} n={26} /></>}
        {hindiLine && <div className="hline" aria-hidden="true">{hindiLine}</div>}
        {n ? (
          <div className="gal-view" style={{ touchAction: zoomed ? 'none' : 'pan-y' }} onPointerDown={down} onPointerMove={moveP} onPointerUp={up} onPointerCancel={up}>
            <div className="gal-track">
              {slides.map((x, k) => (
                <div className={`gal-slide ${k === i ? 'on' : ''}`} key={k}>
                  {x.t === 'vid'
                    ? <video src={x.s} controls playsInline muted loop className="pdp-media" />
                    : <img className="pdp-media" src={opt(x.s, 1080, 85)} alt={name} draggable="false" loading={k <= i + 1 ? 'eager' : 'lazy'} decoding="async" fetchPriority={k === 0 ? 'high' : 'auto'} style={k === i ? { transform: `translate(${z.x}px,${z.y}px) scale(${z.s})`, transition: drag || zoomed ? 'none' : undefined } : undefined} />}
                </div>
              ))}
            </div>
          </div>
        ) : <div className="pdp-watch" key={`${caseColor}-${strap}`}><Dial theme={theme} caseColor={caseColor} strap={strap} /></div>}
        {n > 0 && <button type="button" className="zoom-btn" onClick={() => setZ(zoomed ? { s: 1, x: 0, y: 0 } : { s: 2.2, x: 0, y: 0 })} aria-label={zoomed ? t('Zoom out') : t('Zoom in')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-4.8-4.8M10.5 7.5v6M7.5 10.5h6" style={{ display: zoomed ? 'none' : 'inline' }} /><path d="M7.5 10.5h6" style={{ display: zoomed ? 'inline' : 'none' }} /></svg>
        </button>}
      </div>
      {n > 1 && <div className="gal-dots">{slides.map((x, k) => <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Photo ${k + 1}`} />)}</div>}
    </div>
  );
}
