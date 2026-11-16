'use client';
import Link from '@/components/L';
import { useState } from 'react';
import { useShop } from '@/components/ShopProvider';
import { useT } from '@/components/L';
import LangSwitch from '@/components/LangSwitch';

const Bag = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>;
const User = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg>;

export default function Header({ collections = [] }) {
  const { count, setOpen } = useShop(); const t = useT();
  const [mm, setMm] = useState(false);
  const close = () => setMm(false);
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <div className="hdr-l"><button className="icon-btn burger" onClick={() => setMm(true)} aria-label="Menu">☰</button>
        <nav className="nav">
          <div className="nav-item"><Link href="/collections">{t('Timepieces')}</Link>
            <div className="mega">{collections.map((c) => <Link key={c.id} href={`/collections/${c.slug}`}>{c.name}</Link>)}<Link href="/collections">{t('All timepieces')}</Link></div></div>
          <div className="nav-item"><button>{t('Discover')}</button>
            <div className="mega"><Link href="/our-story">{t('Our story')}</Link><Link href="/heritage">{t('Heritage')}</Link><Link href="/journal">{t('Journal')}</Link><Link href="/circle">{t('The Circle')}</Link><Link href="/#realm">{t('Find your realm')}</Link><Link href="/policies/warranty">{t('1-year warranty')}</Link></div></div>
          <div className="nav-item"><button>{t('Support')}</button>
            <div className="mega"><Link href="/track">{t('Track order')}</Link><Link href="/contact">{t('Contact')}</Link><Link href="/complaint">{t('Raise a complaint')}</Link></div></div>
        </nav></div>
        <Link href="/" className="logo" aria-label="YUGASTRA home"><img src="/logo.png" alt="YUGASTRA" /></Link>
        <div className="hdr-actions">
          <LangSwitch />
          <Link href="/account" className="icon-btn" aria-label="Account"><User /></Link>
          <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Bag"><Bag />{count > 0 && <span className="badge">{count}</span>}</button>
        </div>
      </div>
      <div className={`mobile-menu ${mm ? 'open' : ''}`}>
        <button className="icon-btn mm-close" onClick={close}>✕</button>
        <h4>{t('Timepieces')}</h4>{collections.map((c) => <Link key={c.id} href={`/collections/${c.slug}`} onClick={close}>{c.name}</Link>)}<Link href="/collections" onClick={close}>{t('All timepieces')}</Link>
        <h4>{t('Discover')}</h4><Link href="/our-story" onClick={close}>{t('Our story')}</Link><Link href="/heritage" onClick={close}>{t('Heritage')}</Link><Link href="/journal" onClick={close}>{t('Journal')}</Link><Link href="/circle" onClick={close}>{t('The Circle')}</Link><Link href="/#realm" onClick={close}>{t('Find your realm')}</Link><Link href="/policies/warranty" onClick={close}>{t('1-year warranty')}</Link>
        <h4>{t('Support')}</h4><Link href="/track" onClick={close}>{t('Track order')}</Link><Link href="/contact" onClick={close}>{t('Contact')}</Link><Link href="/account" onClick={close}>{t('Account')}</Link>
      </div>
    </header>
  );
}
