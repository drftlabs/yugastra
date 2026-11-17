import Link from '@/components/L';
import PixelPurchase from '@/components/PixelPurchase';
import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
export const metadata = { title: 'Order confirmed' };
export default function Success({ searchParams }) {
  const t = tr(getLang()); const hi = getLang() === 'hi';
  const due = Number(searchParams.due) || 0;
  return <div className="page"><PixelPurchase order={searchParams.o} /><div className="wrap" style={{ textAlign: 'center', maxWidth: 600 }}>
    <div className="eyebrow">{t('Thank you')}</div><h1 style={{ margin: '14px 0' }}>{t('Order confirmed')}</h1>
    <p style={{ color: 'var(--muted)' }}>{t('Your order')} <b style={{ color: 'var(--gold)' }}>{searchParams.o}</b> {t('is confirmed. A confirmation has been emailed to you.')}{due > 0 && (hi ? ` कृपया वितरण के समय ₹${due.toLocaleString('en-IN')} तैयार रखिए।` : ` Please keep ₹${due.toLocaleString('en-IN')} ready for delivery.`)}</p>
    <div style={{ marginTop: 34, display: 'flex', gap: 12, justifyContent: 'center' }}><Link href="/track" className="btn">{t('Track order')}</Link><Link href="/collections" className="btn-buy cart-go" style={{ width: "auto", padding: "15px 34px" }}>{t('Continue')}</Link></div>
  </div></div>;
}
