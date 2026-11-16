import Link from '@/components/L';
import OrbScene from '@/components/OrbScene';
import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
import { getSiteImages } from '@/lib/data';
export const metadata = { title: 'Heritage | YUGASTRA', description: 'How a YUGASTRA timepiece is conceived, drawn and made to be kept.' };
const CH = [
  ['I', 'The question', 'Every piece begins with one question: what would it mean to make a thing that does not date? We did not look to fashion for the answer. We looked up, to the oldest sky and the way the Vedic seers kept time by it.'],
  ['II', 'The drawing', 'A dial is drawn long before it is made. Each ray, star and orbit is set down by hand and kept only if it carries a meaning. What does not, is removed. Restraint is the discipline of the house.'],
  ['III', 'The form', 'The tonneau case, 44 by 52 millimetres and 17 deep, was chosen for presence and for comfort. It sits with authority, and it is shaped to be forgotten on the wrist the moment it is worn.'],
  ['IV', 'The heart', 'Within the case beats a Japanese quartz movement, chosen for its constancy. It asks for nothing, keeps its hour, and is made to be relied upon each day.'],
  ['V', 'The keeping', 'Every YUGASTRA is covered for a year, and made for far longer. It is meant to be worn daily, to gather its own quiet history, and one day to be handed on.'],
];
export default async function Heritage() {
  const t = tr(getLang());
  const imgs = await getSiteImages();
  return (
    <div className="page-bare">
      <section className="her-hero"><OrbScene theme="brand" />
        <div className="her-t"><div className="eyebrow">{t('Heritage')}</div><h1 className="gold-text">{t('Made to be kept')}</h1><p>{t('The thinking behind the house, and the care behind each piece.')}</p></div>
      </section>
      {imgs.heritage_photo?.image && <div className="her-photo" data-rv><img src={imgs.heritage_photo.image} alt={imgs.heritage_photo.caption || ''} /></div>}
      <div className="her-list">
        {CH.map(([n, h, x]) => (<article key={n} className="her-ch" data-rv><span className="her-n">{n}</span><h2>{t(h)}</h2><p>{t(x)}</p></article>))}
      </div>
      <div className="her-end"><Link className="btn btn-gold" href="/collections">{t('Discover the collections')}</Link></div>
    </div>
  );
}
