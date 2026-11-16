import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import MotionInit from '@/components/MotionInit';
import CartDrawer from '@/components/CartDrawer';
import { getCollections, getSettings } from '@/lib/data';

export default async function SiteLayout({ children }) {
  const [collections, settings] = await Promise.all([getCollections(), getSettings()]);
  return (
    <>
      <Ticker text={settings.ticker} />
      <Header collections={collections} />
      <main>{children}</main>
      <Footer collections={collections} whatsapp={settings.whatsapp} />
      <CartDrawer />
      <MotionInit />
    </>
  );
}
