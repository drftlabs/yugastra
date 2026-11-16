import Link from '@/components/L';
import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
export default function NF() { const t = tr(getLang()); return <div className="page"><div className="wrap" style={{ textAlign: 'center' }}><div className="eyebrow">404</div><h1 style={{ margin: '12px 0 24px' }}>{t('Lost in time')}</h1><Link href="/" className="btn">{t('Home')}</Link></div></div>; }
