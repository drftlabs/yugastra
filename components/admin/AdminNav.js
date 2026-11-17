'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Admin side menu. On phones it hides behind a ☰ button and slides in; on desktop it is the usual sidebar.
export default function AdminNav({ tabs = [], signOut = null }) {
  const [open, setOpen] = useState(false); const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  const cur = [['', 'Dashboard'], ...tabs].find(([k]) => (k ? path.startsWith(`/admin/${k}`) : path === '/admin'));
  return (
    <>
      <div className="adm-top">
        <button className="adm-burger" onClick={() => setOpen(true)} aria-label="Open menu"><i /><i /><i /></button>
        <img src="/logo.png" alt="YUGASTRA" /><span className="adm-cur">{cur ? cur[1] : ''}</span>
      </div>
      <div className={`adm-scrim ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`adm-side ${open ? 'open' : ''}`}>
        <div className="brand"><img src="/logo.png" alt="YUGASTRA" /><button className="adm-x" onClick={() => setOpen(false)} aria-label="Close menu">✕</button></div>
        <Link href="/admin" className={path === '/admin' ? 'on' : ''}>Dashboard</Link>
        <h5>Manage</h5>{tabs.map(([k, l]) => <Link key={k} href={`/admin/${k}`} className={path.startsWith(`/admin/${k}`) ? 'on' : ''}>{l}</Link>)}
        <h5>Site</h5><Link href="/" target="_blank">View website ↗</Link>
        <div style={{ padding: '18px 22px' }}>{signOut}</div>
      </aside>
    </>
  );
}
