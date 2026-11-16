import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
import SimpleForm from '@/components/SimpleForm';
export const metadata = { title: 'Contact' };
export default function Contact() { const t = tr(getLang()); return <div className="page"><div className="wrap"><h1>{t('Contact')}</h1><p style={{ color: 'var(--muted)', margin: '10px 0 30px' }}>{t('Questions about an edition, an order or a service? Write to us.')}</p><SimpleForm kind="contact" /></div></div>; }
