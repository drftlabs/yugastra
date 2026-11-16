'use client';
import { useState } from 'react';
import Dial from '@/components/Dial';
import { useT } from '@/components/L';
// The case is 44 mm wide and 52 mm long. The slider shows it against a wrist of the chosen width.
const W = 44, L = 52;
export default function WristFit({ theme, caseColor, strap, photos = [] }) {
  const t = useT();
  const [cm, setCm] = useState(16);
  const wristW = cm * 3.1; // wrist width in mm, approx. (circumference / pi, flattened)
  const ratio = Math.min(W / wristW, 1);
  const fit = ratio > .78 ? 'A bold, commanding presence' : ratio > .66 ? 'A balanced, confident fit' : 'A restrained, refined fit';
  return (
    <section className="wrist">
      <div className="eyebrow">{t('Size guide')}</div>
      <h2>{t('How it sits on your wrist')}</h2>
      <div className="wrist-in">
        <div className="wrist-vis" aria-hidden="true">
          <div className="wrist-arm" style={{ width: '88%' }} />
          <div className="wrist-case" style={{ width: `${ratio * 88}%` }}><Dial theme={theme} caseColor={caseColor} strap={strap} /></div>
        </div>
        <div className="wrist-ctl">
          <label htmlFor="wr">{t('Wrist circumference')} · <b>{cm} {t('cm')}</b></label>
          <input id="wr" type="range" min="14" max="20" step="0.5" value={cm} onChange={(e) => setCm(+e.target.value)} />
          <p className="fit">{t(fit)}.</p>
          <div className="wrist-tbl">
            <div><span>{t('Case')}</span><span>44 × 52 mm</span></div>
            <div><span>{t('Thickness')}</span><span>17 mm</span></div>
            <div><span>{t('Small wrist · 14–15 cm')}</span><span>{t('Statement fit')}</span></div>
            <div><span>{t('Medium wrist · 15–18 cm')}</span><span>{t('Balanced fit')}</span></div>
            <div><span>{t('Large wrist · 18–20 cm')}</span><span>{t('Refined fit')}</span></div>
          </div>
          {photos.length > 0 && <div className="wrist-ph">{photos.map((s) => <img loading="lazy" decoding="async" key={s} src={s} alt="On the wrist" />)}</div>}
        </div>
      </div>
    </section>
  );
}
