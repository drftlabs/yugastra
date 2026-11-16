import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
import CheckoutForm from '@/components/CheckoutForm';
import { getSettings } from '@/lib/data';
import { shippingCfg } from '@/lib/pricing';
export const metadata = { title: 'Checkout' };
export const dynamic = 'force-dynamic';
export default async function Checkout() {
  const s = await getSettings(); const t = tr(getLang());
  return <div className="page"><div className="wrap"><h1>{t('Checkout')}</h1><div style={{ height: 30 }} />
    <CheckoutForm cfg={shippingCfg(s)} rzpReady={!!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID} waEnabled={!!process.env.NEXT_PUBLIC_WA_CONFIRM} deliveryDays={s.delivery_days} /></div></div>;
}
