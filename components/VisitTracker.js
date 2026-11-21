'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ids, send } from '@/lib/track';
// Anonymous visit counter for Admin → Analytics. Random ids kept in the browser; no personal data.
// Records: page view, source / medium / campaign, device, and the visible time spent on each page.
export default function VisitTracker() {
  const path = usePathname();
  useEffect(() => {
    try {
      if (navigator.webdriver || path.startsWith('/admin')) return;
      const { v, s, fresh } = ids(); if (!v) return;
      const pid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      let r = ''; try { const h = new URL(document.referrer).hostname; if (h && h !== location.hostname) r = h.replace(/^www\./, ''); } catch {}
      const q = new URLSearchParams(location.search);
      if (q.get('utm_source')) r = q.get('utm_source'); else if (!r && q.get('fbclid')) r = 'facebook'; else if (!r && q.get('gclid')) r = 'google';
      const ua = navigator.userAgent || ''; const w = innerWidth;
      const d = /iPad|Tablet|Nexus 7|SM-T/i.test(ua) || (w >= 700 && w < 1100 && 'ontouchstart' in window) ? 'tablet' : w < 700 ? 'mobile' : 'desktop';
      send({ k: 'view', p: path, v, s, pid, r, m: q.get('utm_medium') || '', c: q.get('utm_campaign') || '', d, n: fresh ? 1 : 0 });
      let acc = 0, since = document.visibilityState === 'visible' ? Date.now() : 0;
      const tot = () => Math.min(1800, Math.round((acc + (since ? Date.now() - since : 0)) / 1000));
      const flush = () => { const t = tot(); if (t > 0) send({ k: 'dur', pid, v, t }); };
      const vis = () => { if (document.visibilityState === 'hidden') { if (since) { acc += Date.now() - since; since = 0; } flush(); } else since = Date.now(); };
      document.addEventListener('visibilitychange', vis); addEventListener('pagehide', flush);
      return () => { document.removeEventListener('visibilitychange', vis); removeEventListener('pagehide', flush); flush(); };
    } catch {}
  }, [path]);
  return null;
}
