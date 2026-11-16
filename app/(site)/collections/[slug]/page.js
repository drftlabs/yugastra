import Link from '@/components/L';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import NameNote from '@/components/NameNote';
import { REALMS } from '@/lib/brand';
import { getCollection, getProducts, getPosts } from '@/lib/data';
import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
export async function generateMetadata({ params }) { const c = await getCollection(params.slug); return { title: c?.name || 'Collection', description: c?.description }; }
export default async function Collection({ params }) {
  const t = tr(getLang());
  const c = await getCollection(params.slug); if (!c) notFound();
  const prods = await getProducts({ collectionId: c.id });
  const posts = await getPosts({ realm: c.theme });
  return (
    <div className="page">
      {c.wide_banner && <div className="wide-banner"><img loading="lazy" decoding="async" src={c.wide_banner} alt={c.name} /></div>}
      <div className="wrap">
      <div className="crumbs"><Link href="/">{t('Home')}</Link> / <Link href="/collections">{t('Watches')}</Link> / {c.name}</div>
      <div className="eyebrow">{REALMS[c.theme] ? t(REALMS[c.theme].realm) : c.headline || c.tagline}</div><h1 style={{ marginTop: 10 }}>{c.name}</h1>
      <div className="serif" style={{ fontSize: 22, color: 'var(--gold)', margin: '8px 0 14px' }}>{c.headline}</div>
      <p style={{ color: 'var(--muted)', maxWidth: 560, marginBottom: 44 }}>{c.description}</p>
      {(c.meaning || c.story) && (
        <section className="col-intro">
          <div>{c.sanskrit && <div className="sk" style={{ fontFamily: 'var(--f-serif)', fontSize: 72, lineHeight: 1, color: 'var(--gold)', marginBottom: 12 }}>{c.sanskrit}</div>}
            <div className="eyebrow" style={{ marginBottom: 8 }}>{t('What it means')}</div>
            {c.meaning && <div style={{ fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>{c.meaning}</div>}</div>
          <div>{c.story && <p style={{ color: '#d8d2c4', fontSize: 17, lineHeight: 1.85, maxWidth: 720, margin: 0 }}>{c.story}</p>}</div>
        </section>
      )}
      {REALMS[c.theme] && <p style={{ color: '#d8d2c4', maxWidth: 720, margin: '-20px 0 48px', fontSize: 15.5, lineHeight: 1.8 }}><b style={{ color: 'var(--gold)', letterSpacing: '.14em', textTransform: 'uppercase', fontSize: 12 }}>{t(REALMS[c.theme].colour)}</b> &nbsp; {t(REALMS[c.theme].meaning)}</p>}
      <div className="grid3">{prods.map((p) => <ProductCard key={p.id} p={p} theme={c.theme} />)}</div>
      {!prods.length && <p style={{ color: 'var(--muted)' }}>{t('Watches in this collection arrive soon.')}</p>}
    {posts[0] && <div style={{ margin: '60px 0 0', textAlign: 'center' }}><Link className="link-arrow" href={`/journal/${posts[0].slug}`}>{posts[0].title} →</Link></div>}
    <NameNote compact /></div></div>
  );
}
