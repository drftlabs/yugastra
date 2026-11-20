import Link from '@/components/L';
import { notFound } from 'next/navigation';
import { waOn } from '@/lib/whatsapp';
import { shippingCfg } from '@/lib/pricing';
import PdpClient from '@/components/PdpClient';
import NameNote from '@/components/NameNote';
import { REALMS } from '@/lib/brand';
import { cookies } from 'next/headers';
import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
import { SAMPLE_REVIEWS } from '@/lib/reviews';
import { hasSupabase } from '@/lib/supabase/server';
import { getSiteImages, getProduct, getProducts, getCollections, getReviews, getSettings, inr } from '@/lib/data';
export async function generateMetadata({ params }) {
  const p = await getProduct(params.slug);
  return { title: p?.seo_title ? { absolute: p.seo_title } : (p?.name || 'Watch'), description: p?.seo_description || p?.description || p?.tagline };
}
export default async function Product({ params }) {
  const t = tr(getLang());
  const p = await getProduct(params.slug); if (!p) notFound();
  const [cols, reviews, settings] = await Promise.all([getCollections(), getReviews(p.id), getSettings()]);
  const col = cols.find((c) => c.id === p.collection_id); const theme = col?.theme || 'dhruv';
  const siblings = col ? await getProducts({ collectionId: col.id }) : [];
  const imgs = await getSiteImages();
  const all = await getProducts();
  const colName = Object.fromEntries(cols.map((c) => [c.id, c.name])); const colTheme = Object.fromEntries(cols.map((c) => [c.id, c.theme]));
  const catalog = all.map((x) => ({ slug: x.slug, name: x.name, price: x.price, image: (x.images?.length >= 6 ? x.images[2] : x.images?.[0]) || '', tags: x.tags || [], theme: colTheme[x.collection_id] || 'brand', col: colName[x.collection_id] || '' }));
  const items = siblings.length ? siblings : [p];
  const save = p.compare_price && p.compare_price > p.price ? Math.round((1 - p.price / p.compare_price) * 100) : 0;
  const quotes = hasSupabase() ? reviews.map((r) => ({ name: r.name, body: r.body })) : SAMPLE_REVIEWS.filter((r) => r.slug === p.slug);
  const feats = Array.isArray(p.features) ? p.features : [];
  return (
    <div className="page pdp-page"><div className="wrap">
      <PdpClient collections={cols.map((c) => ({ slug: c.slug, name: c.name, theme: c.theme }))} reviews={quotes} catalog={catalog} items={items} startSlug={p.slug} theme={theme} eyebrow={col ? `${col.name} · ${REALMS[theme] ? t(REALMS[theme].realm) : t('collection')}` : ''} settings={{ return_days: settings.return_days, delivery_days: settings.delivery_days }} whatsapp={settings.whatsapp} wristPhotos={[imgs.wrist_small?.image, imgs.wrist_large?.image].filter(Boolean)} col={col ? { name: col.name, sanskrit: col.sanskrit, meaning: col.meaning, story: col.story } : null} realm={REALMS[theme] || null} box={imgs.box_photo?.image || '/box.jpg'} handPhoto={imgs.pdp_hand?.image || ''} showGlow={col?.show_glow !== false} checkout={{ cfg: shippingCfg(settings), rzpReady: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, waEnabled: waOn(), deliveryDays: settings.delivery_days }} unlockedSlugs={items.filter((x) => cookies().get(`yg_ac_${x.slug}`)).map((x) => x.slug)} />

      <NameNote compact />

    </div></div>
  );
}
