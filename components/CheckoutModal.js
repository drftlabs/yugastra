'use client';
import { useEffect } from 'react';
import CheckoutForm from '@/components/CheckoutForm';
import { useT } from '@/components/L';
// Checkout in a pop-up, opened by "Buy now" so the visitor never leaves the watch.
export default function CheckoutModal({ open, onClose, checkout }) {
  const t = useT();
  useEffect(() => {
    if (!open) return; const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const k = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', k); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="co-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="co-panel" onClick={(e) => e.stopPropagation()}>
        <button className="co-x" onClick={onClose} aria-label="Close">✕</button>
        <h2>{t('Checkout')}</h2>
        <CheckoutForm {...checkout} />
      </div>
    </div>
  );
}
