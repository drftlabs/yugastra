'use client';
import { useEffect, useRef } from 'react';
// Home hero: one looping video, no controls, text or overlays. Wide version on desktop, square on phones.
export default function HeroVideo() {
  const sq = useRef(null); const wd = useRef(null);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const go = () => {
      const on = mq.matches ? wd.current : sq.current, off = mq.matches ? sq.current : wd.current;
      if (off) { off.pause(); }
      if (on) { if (!on.getAttribute('src')) on.setAttribute('src', on.dataset.src); on.play().catch(() => {}); }
    };
    go(); mq.addEventListener?.('change', go);
    return () => mq.removeEventListener?.('change', go);
  }, []);
  const common = { muted: true, loop: true, playsInline: true, preload: 'auto', disablePictureInPicture: true, disableRemotePlayback: true, controlsList: 'nodownload noplaybackrate noremoteplayback', tabIndex: -1, 'aria-hidden': true, onContextMenu: (e) => e.preventDefault() };
  const keep = (e) => { if (!document.hidden && e.currentTarget.offsetParent) e.currentTarget.play().catch(() => {}); };
  return (
    <section className="hero-vid" aria-label="YUGASTRA">
      <video ref={sq} className="hv-sq" data-src="/hero.mp4" poster="/hero-poster.jpg" onPause={keep} {...common} />
      <video ref={wd} className="hv-wd" data-src="/hero-wide.mp4" poster="/hero-wide-poster.jpg" onPause={keep} {...common} />
    </section>
  );
}
