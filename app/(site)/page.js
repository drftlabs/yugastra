import Link from '@/components/L';
import Dial from '@/components/Dial';
import HeroSlider from '@/components/HeroSlider';
import NameNote from '@/components/NameNote';
import RealmQuiz from '@/components/RealmQuiz';
import DetailGallery from '@/components/DetailGallery';
import OrbScene from '@/components/OrbScene';
import { REALMS, SKT } from '@/lib/brand';
import { getSiteImages, getSlides, getSettings, getCollections } from '@/lib/data';
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
  const detail = [1, 2, 3, 4].map((n, i) => ({ caption: imgs[`detail_${n}`]?.caption || ['The embossed dial', 'The case, in light', 'The strap', 'On the wrist'][i], image: imgs[`detail_${n}`]?.image }));
  let slides = multi ? allSlides : allSlides.slice(0, 1);
  if (imgs.hero_image && slides[0]) slides = [{ ...slides[0], image: imgs.hero_image.image }, ...slides.slice(1)];
  const sk = Object.fromEntries(collections.map((c) => [c.theme, c.sanskrit || SKT[c.theme]]));
  return (
    <>
      <HeroSlider slides={slides} sanskrit={sk} />

      <NameNote />

      <section className="story" data-rv>
        <p>{t('Long before there were clocks, there were people who read time in the sky. They watched a star that never moved, a sun that rose in twelve forms, and a moon that walked through twenty-seven resting places.')}</p>
        <p>{t('We are a small company in India that never stopped looking up. Each YUGASTRA begins with one of those ideas, drawn by hand, raised into the dial, and set in a case made to be held for years.')}</p>
      </section>

      {collections.map((c, i) => (
        <section key={c.id} className={`feat t-${c.theme} ${i % 2 ? 'rev' : ''}`}>
          <div className={`feat-art ${(c.banner || imgs[`realm_${c.theme}`]) ? '' : 'orbwrap'}`}>{(c.banner || imgs[`realm_${c.theme}`]) ? <img src={imgs[`realm_${c.theme}`]?.image || c.banner} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <><OrbScene theme={c.theme} /><Dial theme={c.theme} /></>}</div>
          <div className="feat-copy" data-rv>
            <div className="eyebrow">{REALMS[c.theme] ? t(REALMS[c.theme].realm) : `${c.name} ${t('collection')}`}</div>
            <h2 className="fc-name">{c.name}{(c.sanskrit || SKT[c.theme]) && <span className="hi-sub">{c.sanskrit || SKT[c.theme]}</span>}</h2>
            <h2>{c.headline || c.tagline}</h2>
            <p>{c.description}</p>
            <div><Link href={`/collections/${c.slug}`} className="btn">{t('Discover →')}</Link></div>
          </div>
        </section>
      ))}

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
