'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initMotion } from '@/lib/motion';
export default function MotionInit() {
  const path = usePathname();
  useEffect(() => initMotion(), [path]);
  // Photos start softly blurred and snap to sharp the instant they have loaded (short blur-to-clear effect).
  useEffect(() => {
    const mark = (i) => { if (i.tagName === 'IMG') { if (i.complete && i.naturalWidth) i.classList.add('ld'); } };
    const onLoad = (e) => { if (e.target && e.target.tagName === 'IMG') e.target.classList.add('ld'); };
    document.addEventListener('load', onLoad, true);
    document.querySelectorAll('img').forEach(mark);
    const mo = new MutationObserver((l) => l.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) { mark(n); n.querySelectorAll?.('img').forEach(mark); } })));
    mo.observe(document.body, { childList: true, subtree: true });
    const safety = setInterval(() => document.querySelectorAll('img:not(.ld)').forEach((i) => { if (i.complete) i.classList.add('ld'); }), 700);
    const last = setTimeout(() => document.querySelectorAll('img').forEach((i) => i.classList.add('ld')), 6000);
    return () => { document.removeEventListener('load', onLoad, true); mo.disconnect(); clearInterval(safety); clearTimeout(last); };
  }, []);
  return null;
}
