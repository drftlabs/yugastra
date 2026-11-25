'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Click anywhere on a table row that has data-href to open it (links, buttons and inputs keep their own behaviour).
export default function RowClick() {
  const r = useRouter();
  useEffect(() => {
    const h = (e) => { const tr = e.target.closest?.('tr[data-href]'); if (!tr || e.target.closest('a,button,input,select,label,textarea')) return; r.push(tr.dataset.href); };
    document.addEventListener('click', h); return () => document.removeEventListener('click', h);
  }, [r]);
  return null;
}
