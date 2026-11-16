import Link from '@/components/L';
import { notFound } from 'next/navigation';
import OrbScene from '@/components/OrbScene';
import { getPost, getCollections } from '@/lib/data';
import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
export async function generateMetadata({ params }) { const p = await getPost(params.slug); return { title: p ? `${p.title} | YUGASTRA` : 'Journal', description: p?.excerpt }; }
export default async function Post({ params }) {
  const t = tr(getLang()); const p = await getPost(params.slug); if (!p) notFound();
  const cols = await getCollections(); const col = cols.find((c) => c.theme === p.realm);
  return (
    <div className="page-bare">
      <section className="her-hero small"><OrbScene theme={p.realm || 'brand'} />
        <div className="her-t"><div className="eyebrow">{t('Journal')}{col ? ` · ${col.name}` : ''}</div><h1 className="gold-text">{p.title}</h1></div>
      </section>
      <article className="jr-body">
        {String(p.body || '').split(/\n\s*\n/).map((x, i) => <p key={i}>{x}</p>)}
        <div className="jr-end">
          {col && <Link className="btn btn-gold" href={`/collections/${col.slug}`}>{t('Discover')} {col.name} →</Link>}
          <Link className="link-arrow" href="/journal">{t('All notes')}</Link>
        </div>
      </article>
    </div>
  );
}
