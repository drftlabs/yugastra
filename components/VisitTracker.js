'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
// Anonymous visit counter for Admin → Analytics (random id kept in the browser; no personal data).
export default function VisitTracker() {
  const path = usePathname();
  useEffect(() => {
    try {
      if (navigator.webdriver || path.startsWith('/admin')) return;
      let v = localStorage.getItem('yg_vid'); if (!v) { v = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('yg_vid', v); }
      let r = ''; try { const h = new URL(document.referrer).hostname; if (h && h !== location.hostname) r = h.replace(/^www\./, ''); } catch {}
      const q = new URLSearchParams(location.search); if (q.get('utm_source')) r = q.get('utm_source');
      const body = JSON.stringify({ p: path, v, r, d: innerWidth < 700 ? 'mobile' : 'desktop' });
      if (navigator.sendBeacon) navigator.sendBeacon('/api/track', new Blob([body], { type: 'text/plain' })); else fetch('/api/track', { method: 'POST', body, keepalive: true });
    } catch {}
  }, [path]);
  return null;
}
