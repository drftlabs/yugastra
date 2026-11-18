'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import RealmQuiz from '@/components/RealmQuiz';
import { useT } from '@/components/L';
// "Find your realm" on the product page: opens the same three-question quiz in a pop-up, then sends the visitor to that realm.
export default function RealmButton({ collections = [] }) {
  const t = useT(); const [open, setOpen] = useState(false); const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const k = (e) => e.key === 'Escape' && setOpen(false); window.addEventListener('keydown', k);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', k); };
  }, [open]);
  return (
    <section className="realm-cta" data-rv>
      <div className="eyebrow">{t('Find your realm')}</div>
      <p>{t('Not sure which realm is yours?')}</p>
      <button type="button" className="btn" onClick={() => setOpen(true)}>{t('Find your realm')} →</button>
      {m && open && createPortal(
        <div className="rq-modal" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="rq-panel" onClick={(e) => e.stopPropagation()}>
            <button className="co-x" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            <RealmQuiz collections={collections} />
          </div>
        </div>, document.body)}
    </section>
  );
}
