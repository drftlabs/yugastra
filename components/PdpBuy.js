'use client';
import { useRouter } from 'next/navigation';
import { useShop } from '@/components/ShopProvider';
import { useLang, useT, pre } from '@/components/L';
export default function PdpBuy({ p, theme, compact, onBuyNow }) {
  const { add } = useShop(); const r = useRouter(); const t = useT(); const lang = useLang();
  const out = p.stock < 1;
  const item = { ...p, theme };
  const buy = () => { add(item, 1, false); if (onBuyNow) onBuyNow(); else r.push(pre(lang, '/checkout')); };
  if (compact) return <button className="btn-black sm" disabled={out} onClick={buy}>{out ? t('Sold out') : t('Buy now')}</button>;
  return (
    <div className="pdp-btns">
      <button className="btn-silver" disabled={out} onClick={() => add(item, 1)}>{out ? t('Sold out') : t('Add to bag')}</button>
      <button className="btn-black" disabled={out} onClick={buy}>{t('Buy now')}</button>
      {!out && p.stock <= 5 && <p className="err" style={{ color: 'var(--gold)' }}>{lang === 'hi' ? `केवल ${p.stock} शेष।` : `Only ${p.stock} remaining.`}</p>}
    </div>
  );
}
