import Link from '@/components/L';
import { NAME } from '@/lib/brand';
import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
const rich = (t) => t.split(/(\[\[.*?\]\])/).map((x, i) => (x.startsWith('[[') ? <span key={i} className="hi">{x.slice(2, -2)}</span> : x));
export default function NameNote({ compact = false, link = true }) {
  const lang = getLang(); const t = tr(lang);
  const L = (x) => (lang === 'hi' ? t(x.replace(/\[\[|\]\]/g, '')) : rich(x));
  return (
    <section className={`namenote ${compact ? 'compact' : ''}`} data-rv>
      <div className="nn-in">
        <h2 className="gold-text">{t(NAME.line)}</h2>
        <div className="nn-rule" />
        {(compact ? NAME.paras.slice(0, 2) : NAME.paras).map((x) => <p key={x}>{L(x)}</p>)}
        {link && compact && <Link href="/our-story" className="link-arrow">{t('The idea behind the name')}</Link>}
      </div>
    </section>
  );
}
