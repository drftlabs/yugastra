'use client';
import Link from '@/components/L';
import { useEffect, useState } from 'react';
import Dial from '@/components/Dial';
import OrbScene from '@/components/OrbScene';
import { useT } from '@/components/L';
const MS = 7000;

export default function HeroSlider({ slides, sanskrit = {} }) {
  const t = useT();
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (slides.length < 2 || hold) return;
    const t = setTimeout(() => setI((x) => (x + 1) % slides.length), MS);
    return () => clearTimeout(t);
  }, [i, hold, slides.length]);
  const pad = (n) => String(n + 1).padStart(2, '0');
  return (
    <section className="hero2" aria-roledescription="carousel" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocusCapture={() => setHold(true)} onBlurCapture={() => setHold(false)}>
      {slides.map((s, n) => {
        const th = s.theme || 'dhruv';
        return (
          <div key={s.id || n} className={`h2-slide ${n === i ? 'on' : ''}`} aria-hidden={n !== i}>
            <OrbScene className="hero" theme={n === 0 ? 'brand' : th} />
            <div className="h2-art">{s.image ? <img src={s.image} alt="" /> : <Dial theme={th} className="h2-dial" />}</div>
            <div className="h2-copy">
              <div className="h2-eye">{t(s.eyebrow)}</div>
              {(() => { const T = n === 0 ? 'h1' : 'h2'; return <T className="h2-title">{t(s.title)}{n > 0 && sanskrit[th] ? <span className="hi-sub">{sanskrit[th]}</span> : null}</T>; })()}
              <p>{t(s.subtitle)}</p>
              <Link href={s.cta_href || '/collections'} className="h2-link" tabIndex={n === i ? 0 : -1}>{t(s.cta_label || 'Discover')}</Link>
            </div>
          </div>
        );
      })}
      {slides.length > 1 && (
        <div className="h2-nav">
          <span className="h2-count"><b>{pad(i)}</b> / {pad(slides.length - 1)}</span>
          <div className="h2-bars">{slides.map((_, n) => (
            <button key={n} onClick={() => setI(n)} aria-label={`Slide ${n + 1}`} className={n === i ? 'on' : ''}><i key={n === i ? i : 'x'} style={n === i ? { animationDuration: `${MS}ms` } : undefined} /></button>
          ))}</div>
          <span className="h2-scroll">{t('Scroll')}</span>
        </div>
      )}
    </section>
  );
}
