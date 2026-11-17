import Link from '@/components/L';
import Dial from '@/components/Dial';
import HeroVideo from '@/components/HeroVideo';
import NameNote from '@/components/NameNote';
import RealmQuiz from '@/components/RealmQuiz';
import DetailGallery from '@/components/DetailGallery';
import OrbScene from '@/components/OrbScene';
import InfiniteRow from '@/components/InfiniteRow';
import CollectionSlider from '@/components/CollectionSlider';
import { REALMS, SKT } from '@/lib/brand';
import { getSiteImages, getSlides, getSettings, getCollections, getProducts } from '@/lib/data';
import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';


const PILLARS = [
  ['I', 'Drawn from the oldest sky', 'Every dial begins with something the ancients watched: a star that held its place, a sun in its twelve forms, a moon on its long procession.'],
  ['II', 'Restraint, by design', 'Nothing here is ornament. Each ray, star and orbit is present because it carries a meaning, and absent if it does not.'],
  ['III', 'Made to be kept', 'We do not make for the season. We make for the one who will keep it, wear it daily, and one day hand it on.'],
];

export default async function Home() {
  const t = tr(getLang());
  const [allSlides, collections, settings] = await Promise.all([getSlides(), getCollections(), getSettings()]);
  const multi = settings.hero_multi === true || settings.hero_multi === 'true' || settings.hero_multi === 'yes';
  const imgs = await getSiteImages();
  const allP = await getProducts();
  const tagged = allP.filter((x) => (x.tags || []).length).slice(0, 8).map((x) => ({ slug: x.slug, name: x.name, price: x.price, image: x.images?.[2] || x.images?.[0] || '', tags: x.tags, theme: collections.find((c) => c.id === x.collection_id)?.theme || 'brand' }));
  const detail = [1, 2, 3, 4].map((n, i) => ({ caption: imgs[`detail_${n}`]?.caption || ['The embossed dial', 'The case, in light', 'The strap', 'On the wrist'][i], image: imgs[`detail_${n}`]?.image }));
  let slides = multi ? allSlides : allSlides.slice(0, 1);
  if (imgs.hero_image && slides[0]) slides = [{ ...slides[0], image: imgs.hero_image.image }, ...slides.slice(1)];
  const sk = Object.fromEntries(collections.map((c) => [c.theme, c.sanskrit || SKT[c.theme]]));
  return (
    <>
      <HeroVideo />

      <NameNote />

      <CollectionSlider discover={t('Discover →')} items={collections.map((c) => {
        const pr = allP.find((x) => x.collection_id === c.id) || allP.find((x) => String(x.name).toUpperCase().startsWith(String(c.name).toUpperCase()));
        return { slug: c.slug, name: c.name, theme: c.theme, sanskrit: c.sanskrit || SKT[c.theme], realm: REALMS[c.theme] ? t(REALMS[c.theme].realm) : `${c.name} ${t('collection')}`, headline: c.headline || c.tagline, description: c.description, image: c.banner || imgs[`realm_${c.theme}`]?.image || pr?.images?.[0] || '' };
      })} />

      <InfiniteRow title={t('New & bestsellers')} items={tagged} />

      <RealmQuiz collections={collections} />

      <DetailGallery items={detail} />

      <section className="sec">
        <div className="wrap" data-rv>
          <div className="sec-head"><div className="eyebrow">{t('What stands behind the name')}</div><h2>{t('Three vows')}</h2></div>
        </div>
        <div className="pillars">
          {PILLARS.map(([n, tt, d], i) => (<div className="pillar foil" key={n} data-rv style={{ '--d': `${i * 120}ms` }}><div className="n">{n}</div><h3>{t(tt)}</h3><p>{t(d)}</p></div>))}
        </div>
      </section>

      <section className="closing">
        <OrbScene />
        <div className="eyebrow" data-rv>{t('Yugastra · the weapon of timelessness')}</div>
        <blockquote data-rv>{t('We do not make watches to be replaced. We make pieces to be')} <em>{t('kept')}</em>{t(', and a feeling that stays with them.')}</blockquote>
        <Link href="/collections" className="btn" data-rv>{t('Discover the collections →')}</Link>
      </section>
    </>
  );
}
