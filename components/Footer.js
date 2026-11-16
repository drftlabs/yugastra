import Link from '@/components/L';
import SoundToggle from '@/components/SoundToggle';
import VedicHour from '@/components/VedicHour';
import LangSwitch from '@/components/LangSwitch';
import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
export default function Footer({ collections = [], whatsapp = '' }) {
  const t = tr(getLang());
  const wa = String(whatsapp || '').replace(/\D/g, '');
  return (
    <footer className="ftr"><div className="wrap">
      <div className="ftr-speak">
        <div><div className="eyebrow">{t('Speak to us')}</div><h3>{t('A question about a piece, a gift, or the realm that is yours?')}</h3></div>
        <a className="wa-btn" href={wa ? `https://wa.me/${wa}` : (getLang() === 'hi' ? '/hi/contact' : '/contact')} target={wa ? '_blank' : undefined} rel="noreferrer" aria-label="Speak to us on WhatsApp"><span className="wa-ic"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42" /></svg></span><span className="wa-tx"><small>{t('WhatsApp')}</small>{t('Begin a conversation')}</span></a>
      </div>
      <div className="ftr-grid">
        <div><img loading="lazy" decoding="async" className="fl" src="/logo.png" alt="YUGASTRA" /><p className="about">{t('The weapon of timelessness. Pieces drawn from the Vedic sky, made to be kept.')}</p></div>
        <div><h4>{t('Timepieces')}</h4>{collections.map((c) => <Link key={c.id} href={`/collections/${c.slug}`}>{c.name}</Link>)}<Link href="/collections">{t('All')}</Link></div>
        <div><h4>{t('Discover')}</h4><Link href="/our-story">{t('The name and the idea')}</Link><Link href="/heritage">{t('Heritage')}</Link><Link href="/journal">{t('Journal')}</Link><Link href="/circle">{t('The Circle')}</Link><Link href="/#realm">{t('Find your realm')}</Link><Link href="/policies/warranty">{t('1-year warranty')}</Link></div>
        <div><h4>{t('Support')}</h4><Link href="/track">{t('Track order')}</Link><Link href="/contact">{t('Contact')}</Link><Link href="/complaint">{t('Raise a complaint')}</Link><Link href="/account">{t('Account')}</Link></div>
        <div><h4>{t('Legal')}</h4><Link href="/policies/privacy">{t('Privacy')}</Link><Link href="/policies/terms">{t('Terms')}</Link><Link href="/policies/shipping">{t('Shipping')}</Link><Link href="/policies/refund">{t('Refund & cancellation')}</Link><Link href="/policies/grievance">{t('Grievance')}</Link></div>
      </div>
      <div className="vh-row"><VedicHour /><SoundToggle /><LangSwitch className="ftr-lang" /></div>
      <div className="ftr-bot"><span>© YUGASTRA {new Date().getFullYear()}. {t('All rights reserved.')}</span><span>{t('The weapon of timelessness')}</span></div>
    </div></footer>
  );
}
