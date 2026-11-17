import Link from '@/components/L';
import LangSwitch from '@/components/LangSwitch';
import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
// A cleaner footer: logo, one line of links, the legal links, and the YUG / ASTRA watermark behind it.
export default function Footer({ collections = [], whatsapp = '' }) {
  const t = tr(getLang());
  const wa = String(whatsapp || '').replace(/\D/g, '');
  return (
    <footer className="ftr ftr2"><div className="wrap">
      <img loading="lazy" decoding="async" className="fl" src="/logo.png" alt="YUGASTRA" />
      <p className="about">{t('The weapon of timelessness. Pieces drawn from the Vedic sky, made to be kept.')}</p>
      <nav className="ftr-links">
        <Link href="/collections">{t('Timepieces')}</Link>
        <Link href="/our-story">{t('Our story')}</Link>
        <Link href="/journal">{t('Journal')}</Link>
        <Link href="/track">{t('Track order')}</Link>
        <Link href="/contact">{t('Contact')}</Link>
        {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">WhatsApp</a>}
      </nav>
      <div className="ftr-legal">
        <Link href="/policies/privacy">{t('Privacy')}</Link><Link href="/policies/terms">{t('Terms')}</Link><Link href="/policies/shipping">{t('Shipping')}</Link><Link href="/policies/refund">{t('Refund & cancellation')}</Link><Link href="/policies/warranty">{t('1-year warranty')}</Link>
      </div>
      <div className="ftr-bot"><span>© YUGASTRA {new Date().getFullYear()}. {t('All rights reserved.')}</span><LangSwitch className="ftr-lang" /></div>
    </div></footer>
  );
}
