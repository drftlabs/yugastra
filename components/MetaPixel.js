'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
// Loads the Meta (Facebook) Pixel when an ID is set in Admin → Settings, and records a PageView on every page change.
export default function MetaPixel({ id }) {
  const path = usePathname();
  useEffect(() => {
    if (!id || typeof window === 'undefined' || window.fbq) return;
    const f = window; const n = (f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); });
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    const t = document.createElement('script'); t.async = true; t.src = 'https://connect.facebook.net/en_US/fbevents.js'; document.head.appendChild(t);
    f.fbq('init', String(id));
  }, [id]);
  useEffect(() => { if (id && window.fbq) window.fbq('track', 'PageView'); }, [id, path]);
  return null;
}
