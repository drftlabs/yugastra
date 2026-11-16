'use client';
import Link, { useT } from '@/components/L';
import { useState } from 'react';
import OrbScene from '@/components/OrbScene';
import { SKT } from '@/lib/brand';

const QS = [
  { q: 'How does your finest day begin?', a: [['Before dawn, in stillness', 'dhruv'], ['With the first light, out in the world', 'surya'], ['Slowly, with a small ritual', 'naksh'], ['Looking up at an open sky', 'vyom'], ['Quietly, at my own pace', 'soma']] },
  { q: 'What do you prize above all?', a: [['A sure bearing', 'dhruv'], ['Radiance and warmth', 'surya'], ['Meaning and memory', 'naksh'], ['Wonder and depth', 'vyom'], ['Calm and balance', 'soma']] },
  { q: 'Choose an evening.', a: [['A harbour just after sunset', 'dhruv'], ['Golden hour, people gathering', 'surya'], ['Festival lamps, long conversation', 'naksh'], ['Stargazing on a quiet hill', 'vyom'], ['A moonlit walk, alone', 'soma']] },
];
const LINE = {
  dhruv: 'You are the still point by which others find their bearing. Constant, assured, unhurried.',
  surya: 'You carry your own radiance into every room, and others turn towards it as to morning.',
  naksh: 'You believe that some things are written, and you keep what matters close to the heart.',
  vyom: 'You are a seeker of horizons, drawn to depth, and never quite finished with the sky.',
  soma: 'You keep to your own rhythm, serene in cycles, certain that all things return in their season.',
};

export default function RealmQuiz({ collections = [] }) {
  const t = useT();
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState([]);
  const done = step >= QS.length;
  let res = null;
  if (done) {
    const sc = {}; picks.forEach((k, i) => { sc[k] = (sc[k] || 0) + 1 + (i === picks.length - 1 ? 0.1 : 0); });
    res = Object.entries(sc).sort((a, b) => b[1] - a[1])[0][0];
  }
  const col = res && collections.find((c) => c.theme === res);
  const pick = (k) => { setPicks([...picks, k]); setStep(step + 1); };
  const reset = () => { setPicks([]); setStep(0); };
  return (
    <section className="quiz" id="realm">
      <OrbScene theme={res || 'brand'} />
      <div className="quiz-in" aria-live="polite">
        <div className="eyebrow">{t('Find your realm')}</div>
        {!done ? (
          <div key={step} className="fade">
            <div className="quiz-step">{step + 1} / {QS.length}</div>
            <h2>{t(QS[step].q)}</h2>
            <div className="quiz-opts">{QS[step].a.map(([x, k]) => <button key={k} onClick={() => pick(k)}>{t(x)}</button>)}</div>
          </div>
        ) : (
          <div className="fade">
            <div className="quiz-step">{t('Your realm is')}</div>
            <h2 className="gold-text quiz-res">{col?.name || res.toUpperCase()}<span className="hi-sub">{SKT[res]}</span></h2>
            <p className="quiz-line">{t(LINE[res])}</p>
            <div className="quiz-act">
              <Link href={col ? `/collections/${col.slug}` : '/collections'} className="btn">{t('Explore')} {col?.name || t('the collection')} →</Link>
              <button className="quiz-again" onClick={reset}>{t('Start again')}</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
