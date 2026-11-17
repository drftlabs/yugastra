import Link from '@/components/L';
import Dial from '@/components/Dial';
import ProductCard from '@/components/ProductCard';
import { getCollections, getProducts } from '@/lib/data';
import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
export const metadata = { title: 'Watches' };
export default async function All() {
  const t = tr(getLang());
  const [cols, prods] = await Promise.all([getCollections(), getProducts()]);
  return (
    <div className="page"><div className="wrap">
      <h1>{t('Watches')}</h1><p style={{ color: 'var(--muted)', marginBottom: 40 }}>{t('Five dials from the Vedic sky. Choose the dial, then the case and strap.')}</p>
      <div className="grid2">{prods.map((p) => <ProductCard key={p.id} p={p} theme={cols.find((c) => c.id === p.collection_id)?.theme || 'dhruv'} />)}</div>
      {!prods.length && <p style={{ color: 'var(--muted)' }}>{t('New watches arrive soon.')}</p>}
    </div></div>
  );
}
