'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLang } from '@/components/L';

const swap = (p, to) => { const base = p === '/hi' ? '/' : p.startsWith('/hi/') ? p.slice(3) : p; return to === 'hi' ? '/hi' + (base === '/' ? '' : base) : base; };
// A quiet EN | हिं switch. The choice is remembered; nothing is ever forced.
export default function LangSwitch({ className = '' }) {
  const lang = useLang(); const p = usePathname() || '/';
  const go = (to) => { try { localStorage.setItem('yg-lang', to); } catch {} };
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  return (
    <span className={`langsw ${className}`} role="group" aria-label="Language">
      <a href={swap(p, 'en') + hash} className={lang === 'en' ? 'on' : ''} onClick={() => go('en')} hrefLang="en" lang="en">EN</a>
      <i>|</i>
      <a href={swap(p, 'hi') + hash} className={lang === 'hi' ? 'on' : ''} onClick={() => go('hi')} hrefLang="hi" lang="hi">हिं</a>
    </span>
  );
}

// A soft invitation for browsers set to Hindi, shown once, never a redirect.
export function HindiSuggest() {
  const lang = useLang(); const p = usePathname() || '/'; const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      const pref = localStorage.getItem('yg-lang');
      if (lang === 'en' && !pref && (navigator.language || '').toLowerCase().startsWith('hi')) setShow(true);
      if (lang === 'hi' && !pref) localStorage.setItem('yg-lang', 'hi');
    } catch {}
  }, [lang]);
  if (!show) return null;
  const dismiss = () => { try { localStorage.setItem('yg-lang', 'en'); } catch {} setShow(false); };
  return (
    <div className="hi-suggest" role="status">
      <a href={swap(p, 'hi')} onClick={() => { try { localStorage.setItem('yg-lang', 'hi'); } catch {} }}>यह पृष्ठ हिंदी में पढ़ें</a>
      <button onClick={dismiss} aria-label="Dismiss">✕</button>
    </div>
  );
}
