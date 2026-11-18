'use client';
import { useEffect } from 'react';
// Desktop only: a thin gold ring that follows the pointer and gently grows over links, buttons and watches.
export default function CursorRing() {
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = document.createElement('div'); el.className = 'cring'; document.body.appendChild(el);
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0, on = false;
    const tick = () => { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; el.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`; raf = requestAnimationFrame(tick); };
    const mv = (e) => { x = e.clientX; y = e.clientY; if (!on) { on = true; cx = x; cy = y; el.classList.add('show'); raf = requestAnimationFrame(tick); } el.classList.toggle('big', !!e.target.closest?.('a,button,.ccard,.pcard,.chip,.prow-card')); };
    const lv = () => { el.classList.remove('show'); on = false; cancelAnimationFrame(raf); };
    addEventListener('mousemove', mv, { passive: true }); document.documentElement.addEventListener('mouseleave', lv);
    return () => { removeEventListener('mousemove', mv); document.documentElement.removeEventListener('mouseleave', lv); cancelAnimationFrame(raf); el.remove(); };
  }, []);
  return null;
}
