'use client';
import { useEffect, useState } from 'react';

// First visit of a session: a brief dark curtain, the gold monogram, a hairline that draws itself, then the curtain lifts.
export default function IntroCurtain() {
  const [st, setSt] = useState('on'); // on -> lift -> gone
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('yg_intro') === '1'; sessionStorage.setItem('yg_intro', '1'); } catch (e) {}
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || calm) { setSt('gone'); return; }
    document.documentElement.classList.add('intro-on');
    const a = setTimeout(() => setSt('lift'), 1900);
    const b = setTimeout(() => { setSt('gone'); document.documentElement.classList.remove('intro-on'); }, 3000);
    return () => { clearTimeout(a); clearTimeout(b); document.documentElement.classList.remove('intro-on'); };
  }, []);
  if (st === 'gone') return null;
  return (
    <div className={`intro ${st === 'lift' ? 'lift' : ''}`} aria-hidden="true">
      <div className="intro-in"><img src="/logo.png" alt="" /><i /></div>
    </div>
  );
}
