import { getProducts, getCollections } from '@/lib/data';
export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://yugastra.com';
  const [p, c] = await Promise.all([getProducts(), getCollections()]);
  return [{ url: base }, { url: base + '/collections' }, ...c.map((x) => ({ url: `${base}/collections/${x.slug}` })), ...p.map((x) => ({ url: `${base}/products/${x.slug}` }))];
}
