import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
import TrackForm from '@/components/TrackForm';
export const metadata = { title: 'Track order' };
export default function Track() { const t = tr(getLang()); return <div className="page"><div className="wrap"><h1>{t('Track order')}</h1><div style={{ height: 24 }} /><TrackForm /></div></div>; }
