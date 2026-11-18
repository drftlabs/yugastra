'use client';
import { useEffect, useState } from 'react';

// The header mark: the English logo stays for 15s, melts into the Hindi name for 5s, and melts back — forever.
const EN_MS = 15000, HI_MS = 5000;
export default function LogoMorph() {
  const [hi, setHi] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setHi((v) => !v), hi ? HI_MS : EN_MS);
    return () => clearTimeout(id);
  }, [hi]);
  return (
    <span className={`lm ${hi ? 'is-hi' : ''}`}>
      <img className="lm-en" decoding="async" src="/logo.png" alt="YUGASTRA" />
      <span className="lm-hi" aria-hidden="true">युगास्त्र</span>
    </span>
  );
}
