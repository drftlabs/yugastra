'use client';
import { useEffect } from 'react';
// Wraps every page. When the new page has arrived, the fade-out that began on click is released and the page eases in.
export default function PageIn({ children }) {
  useEffect(() => { const d = document.documentElement; const id = setTimeout(() => d.classList.remove('nav-out'), 60); return () => clearTimeout(id); }, []);
  return <div className="page-in">{children}</div>;
}
