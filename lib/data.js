import { serviceClient, hasSupabase } from '@/lib/supabase/server';
import * as fb from '@/lib/fallback';
import { legalDefaults } from '@/lib/legalDefaults';
import { getLang, lz } from '@/lib/lang';

// Public reads use the service client (server only) so RLS never blocks SSR.
const db = () => (hasSupabase() ? serviceClient() : null);

async function _getSettings() {
  const c = db(); if (!c) return fb.settings;
  const { data } = await c.from('site_settings').select('*');
  const o = { ...fb.settings };
  (data || []).forEach((r) => (o[r.key] = r.value));
  return o;
}
async function _getCollections() {
  const c = db(); if (!c) return fb.collections;
  const { data } = await c.from('collections').select('*').eq('active', true).order('sort');
  return data?.length ? data : fb.collections;
}
async function _getCollection(slug) {
  const c = db(); if (!c) return fb.collections.find((x) => x.slug === slug) || null;
  const { data } = await c.from('collections').select('*').eq('slug', slug).eq('active', true).maybeSingle();
  return data;
}
async function _getProducts({ collectionId, featured, limit } = {}) {
  const c = db();
  if (!c) { let l = fb.products; if (collectionId) l = l.filter((p) => p.collection_id === collectionId); return l; }
  let q = c.from('products').select('*').eq('active', true).order('sort');
  if (collectionId) q = q.eq('collection_id', collectionId);
  if (featured) q = q.eq('featured', true);
  if (limit) q = q.limit(limit);
  const { data } = await q;
  return data || [];
}
async function _getProduct(slug) {
  const c = db(); if (!c) return fb.products.find((p) => p.slug === slug) || null;
  const { data } = await c.from('products').select('*').eq('slug', slug).eq('active', true).maybeSingle();
  return data;
}
async function _getReviews(productId) {
  const c = db(); if (!c) return [];
  const { data } = await c.from('reviews').select('*').eq('product_id', productId).eq('approved', true).order('created_at', { ascending: false });
  return data || [];
}
async function _getSlides() {
  const c = db(); if (!c) return fb.slides;
  const { data } = await c.from('slides').select('*').eq('active', true).order('sort');
  return data?.length ? data : fb.slides;
}
async function _getCircle() {
  const c = db(); if (!c) return fb.circle;
  const { data } = await c.from('circle_members').select('*').eq('active', true).order('sort');
  return data?.length ? data : fb.circle;
}
async function _getPage(slug) {
  const c = db();
  if (c) { const { data } = await c.from('pages').select('*').eq('slug', slug).maybeSingle(); if (data) return data; }
  return legalDefaults[slug] ? { slug, ...legalDefaults[slug] } : null;
}
export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

// Language-aware versions: Hindi copy (field_hi) is used where it exists, English otherwise.
export const getSettings = async (...a) => lz(await _getSettings(...a), getLang());
export const getCollections = async (...a) => lz(await _getCollections(...a), getLang());
export const getCollection = async (...a) => lz(await _getCollection(...a), getLang());
export const getProducts = async (...a) => lz(await _getProducts(...a), getLang());
export const getProduct = async (...a) => lz(await _getProduct(...a), getLang());
export const getReviews = async (...a) => lz(await _getReviews(...a), getLang());
export const getSlides = async (...a) => lz(await _getSlides(...a), getLang());
export const getCircle = async (...a) => lz(await _getCircle(...a), getLang());

// Journal
async function _getPosts({ realm } = {}) {
  const c = db(); if (!c) { const l = fb.journal || []; return realm ? l.filter((p) => p.realm === realm) : l; }
  let q = c.from('journal_posts').select('*').eq('published', true).order('sort');
  if (realm) q = q.eq('realm', realm);
  const { data } = await q; return data || [];
}
async function _getPost(slug) {
  const c = db(); if (!c) return (fb.journal || []).find((p) => p.slug === slug) || null;
  const { data } = await c.from('journal_posts').select('*').eq('slug', slug).eq('published', true).maybeSingle(); return data;
}
export const getPosts = async (...a) => lz(await _getPosts(...a), getLang());
export const getPost = async (...a) => lz(await _getPost(...a), getLang());

// Admin-uploaded images for named slots (detail_1..4, wrist_small, wrist_large)
export async function getSiteImages() {
  const c = db(); if (!c) return {};
  const { data } = await c.from('site_images').select('*').eq('active', true);
  const o = {}; (lz(data || [], getLang())).forEach((r) => { if (r.image) o[r.slot] = r; }); return o;
}

export const getPage = async (slug) => {
  const lang = getLang(); const r = await _getPage(slug); if (!r || lang !== 'hi') return r;
  const d = legalDefaults[slug];
  return { ...r, title: r.title_hi || d?.title_hi || r.title, body: r.body_hi || d?.body_hi || r.body };
};
