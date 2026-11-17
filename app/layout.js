import { Outfit, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import ShopProvider from '@/components/ShopProvider';
import { LangProvider } from '@/components/LangCtx';
import { HindiSuggest } from '@/components/LangSwitch';
import { headers } from 'next/headers';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', weight: ['200', '300', '400', '500', '700'] });
const deva = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-deva', weight: ['300', '400', '500'] });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yugastra.com'),
  title: { default: 'YUGASTRA — The weapon of timelessness', template: '%s · YUGASTRA' },
  description: 'YUGASTRA, from Yuga (an age) and Astra (the instrument): the weapon of timelessness. Five realms of the Vedic sky in embossed dials, Japanese quartz, and a 1-year warranty.',
  icons: { icon: [{ url: '/favicon.ico', sizes: '48x48' }, { url: '/favicon.png', type: 'image/png', sizes: '512x512' }], apple: '/favicon.png', shortcut: '/favicon.ico' },
  openGraph: { title: 'YUGASTRA', description: 'Yuga + Astra. The weapon of timelessness.', images: ['/logo.png'] },
};
export const viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, userScalable: false };
export default function Root({ children }) {
  let hi = false, path = '/';
  try { const h = headers(); hi = h.get('x-lang') === 'hi'; path = h.get('x-path') || '/'; } catch {}
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://yugastra.com').replace(/\/$/, '');
  const en = base + (path === '/' ? '' : path), hiu = base + '/hi' + (path === '/' ? '' : path);
  return (
    <html lang={hi ? 'hi' : 'en'} className={`${outfit.variable} ${deva.variable}`}>
      <head>
        {!path.startsWith('/admin') && !path.startsWith('/account') && (<>
          <link rel="alternate" hrefLang="en" href={en} /><link rel="alternate" hrefLang="hi" href={hiu} /><link rel="alternate" hrefLang="x-default" href={en} />
        </>)}
      </head>
      <body><LangProvider lang={hi ? 'hi' : 'en'}><ShopProvider>{children}</ShopProvider><HindiSuggest /></LangProvider></body>
    </html>
  );
}
