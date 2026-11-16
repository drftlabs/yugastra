import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
// Placeholder frames for the detail / lifestyle photographs. Pass `items=[{ image, caption }]` to fill them.
const DEFAULT = [{ caption: 'The embossed dial' }, { caption: 'The case, in light' }, { caption: 'The strap' }, { caption: 'On the wrist' }];
export default function DetailGallery({ items = DEFAULT }) {
  const t = tr(getLang());
  return (
    <section className="gal">
      <div className="gal-grid">
        {items.map((it, i) => (
          <figure key={i} className={`gal-f g${i}`}>
            {it.image ? <img src={it.image} alt={t(it.caption) || ''} /> : <div className="gal-ph"><span>{t('Image to come')}</span></div>}
            {it.caption && <figcaption>{t(it.caption)}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  );
}
