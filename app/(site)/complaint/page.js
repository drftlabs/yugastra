import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
import SimpleForm from '@/components/SimpleForm';
export const metadata = { title: 'Raise a complaint' };
export default function C() { const t = tr(getLang()); return <div className="page"><div className="wrap"><h1>{t('Raise a complaint')}</h1><p style={{ color: 'var(--muted)', margin: '10px 0 30px' }}>{t('We acknowledge every complaint within 48 hours.')}</p><SimpleForm kind="complaint" /></div></div>; }
