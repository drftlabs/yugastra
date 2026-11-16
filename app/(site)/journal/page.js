import Link from '@/components/L';
import OrbScene from '@/components/OrbScene';
import { getPosts } from '@/lib/data';
import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
export const metadata = { title: 'Journal | YUGASTRA', description: 'Short pieces on the sky, and on the meaning of each Vedic realm.' };
export default async function Journal() {
  const t = tr(getLang()); const posts = await getPosts();
  return (
    <div className="page-bare">
      <section className="her-hero"><OrbScene theme="brand" />
        <div className="her-t"><div className="eyebrow">{t('Journal')}</div><h1 className="gold-text">{t('Notes from the sky')}</h1><p>{t('Short pieces on the sky, and on the meaning of each realm.')}</p></div>
      </section>
      <div className="jr-list">
        {posts.map((p) => (
          <Link key={p.id} href={`/journal/${p.slug}`} className={`jr-item t-${p.realm || 'brand'}`} data-rv>
            <span className="jr-real">{p.realm ? p.realm.toUpperCase() : ''}</span>
            <h2>{p.title}</h2><p>{p.excerpt}</p><i>{t('Read')} →</i>
          </Link>
        ))}
      </div>
    </div>
  );
}
