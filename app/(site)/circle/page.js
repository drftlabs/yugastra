import CircleForm from '@/components/CircleForm';
import OrbScene from '@/components/OrbScene';
import { getCircle } from '@/lib/data';
import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
export const metadata = { title: 'The Circle | YUGASTRA', description: 'Join the Circle for first access to every new realm.' };
export default async function Circle() {
  const t = tr(getLang()); const members = await getCircle();
  return (
    <div className="page-bare">
      <section className="her-hero"><OrbScene theme="brand" />
        <div className="her-t"><div className="eyebrow">{t('The Circle')}</div><h1 className="gold-text">{t('First to the next realm')}</h1>
          <p>{t('Each new realm is opened first to the Circle, before it is shown to anyone else.')}</p></div>
      </section>
      <section className="invite"><div className="inv-card">
        <div className="inv-k">{t('An invitation')}</div>
        <h2 className="inv-h">{t('You are invited to the Circle')}</h2><i className="inv-rule" />
        <p>{t('Those who join are the first to see each new realm, before it is shown to anyone else. There is no fee and no obligation, only the courtesy of being told first.')}</p>
        <CircleForm />
      </div></section>
      {!!members.length && (<section className="circ-mem"><div className="eyebrow" style={{ textAlign: 'center' }}>{t('Those who keep time with us')}</div>
        <div className="circ-grid">{members.map((m) => (<div key={m.id} className="circ-card"><b>{m.name}</b><span>{m.watch}</span><i>{m.edition}</i></div>))}</div></section>)}
    </div>
  );
}
