'use server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin';
import { sendShipEmail, send, shell } from '@/lib/email';
import crypto from 'crypto';

const TABLES = { products: 'products', collections: 'collections', slides: 'slides', circle_members: 'circle', journal_posts: 'journal', site_images: 'images', reviews: 'reviews', discounts: 'discounts', pages: 'pages' };
const PK = { pages: 'slug' };

export async function upsertRow(table, row) {
  if (!TABLES[table]) return { error: 'Not allowed' };
  const { db } = await requireAdmin(TABLES[table]); if (!db) return { error: 'Connect Supabase first.' };
  const clean = Object.fromEntries(Object.entries(row).filter(([, v]) => v !== undefined));
  if (!clean.id && table !== 'pages') delete clean.id;
  if (table === 'pages') clean.updated_at = new Date().toISOString();
  const { error } = await db.from(table).upsert(clean, { onConflict: PK[table] || 'id' });
  if (error) return { error: error.message };
  revalidatePath('/', 'layout'); return { ok: true };
}
export async function deleteRow(table, id) {
  if (!TABLES[table]) return { error: 'Not allowed' };
  const { db } = await requireAdmin(TABLES[table]); if (!db) return { error: 'Connect Supabase first.' };
  const { error } = await db.from(table).delete().eq(PK[table] || 'id', id);
  if (error) return { error: error.message };
  revalidatePath('/', 'layout'); return { ok: true };
}
export async function saveSettings(formData) {
  const { db } = await requireAdmin('settings'); if (!db) return;
  const num = ['free_shipping_min', 'shipping_fee', 'return_days', 'cod_fee', 'cod_prepaid_pct', 'cod_prepaid_flat'];
  const rows = [];
  for (const k of ['free_shipping_min', 'shipping_fee', 'delivery_days', 'return_days', 'cod_enabled', 'cod_fee', 'cod_prepaid_pct', 'cod_prepaid_flat', 'whatsapp', 'ticker', 'ticker_hi', 'hero_multi']) {
    let v = formData.get(k);
    if (k === 'cod_enabled') v = v === 'on'; else if (num.includes(k)) v = Number(v) || 0; else v = v ?? '';
    rows.push({ key: k, value: v });
  }
  await db.from('site_settings').upsert(rows); revalidatePath('/', 'layout');
}
export async function updateOrder(id, formData) {
  const { db } = await requireAdmin('orders'); if (!db) return;
  const { data: prev } = await db.from('orders').select('status').eq('id', id).single();
  const patch = { status: formData.get('status'), courier: formData.get('courier'), tracking_number: formData.get('tracking_number'), tracking_url: formData.get('tracking_url'), notes: formData.get('notes') };
  const { data: o } = await db.from('orders').update(patch).eq('id', id).select().single();
  if (o && patch.status === 'shipped' && prev?.status !== 'shipped') await sendShipEmail(o);
  revalidatePath('/admin/orders');
}
export async function toggleMessage(id, resolved) {
  const { db } = await requireAdmin('messages'); if (!db) return;
  await db.from('messages').update({ resolved }).eq('id', id); revalidatePath('/admin/messages');
}
export async function addStaff(formData) {
  const { admin, db } = await requireAdmin(); if (!db || !admin.is_owner) return;
  const email = formData.get('email'), password = formData.get('password'), name = formData.get('name');
  const perms = formData.getAll('perms');
  const { data, error } = await db.auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !data?.user) return;
  await db.from('admins').upsert({ user_id: data.user.id, display_name: name, is_owner: false, active: true, perms });
  revalidatePath('/admin/team');
}
export async function setStaffActive(userId, active) {
  const { admin, db } = await requireAdmin(); if (!db || !admin.is_owner) return;
  await db.from('admins').update({ active }).eq('user_id', userId); revalidatePath('/admin/team');
}

// Waitlist: make a single-use access code for one watch, email it, and mark the entry invited.
export async function sendAccessCode(entryId) {
  const { db } = await requireAdmin('waitlist'); if (!db) return { error: 'Connect Supabase first.' };
  const { data: e } = await db.from('waitlist_entries').select('*').eq('id', entryId).single();
  if (!e) return { error: 'Entry not found.' };
  const code = 'YG-' + crypto.randomBytes(4).toString('hex').toUpperCase();
  const { error } = await db.from('access_codes').insert({ code, product_id: e.product_id, entry_id: e.id });
  if (error) return { error: error.message };
  await db.from('waitlist_entries').update({ status: 'invited' }).eq('id', e.id);
  const site = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
  await send(e.email, `Your access to ${e.product_name} | YUGASTRA`, shell(`<p>Dear ${e.name},</p><p>${e.product_name} is now open to you.</p><p>Your private access code:</p><p style="font-size:22px;letter-spacing:.2em;color:#f2c46e">${code}</p><p>Enter it on the watch page to unlock your purchase. The code is single-use.</p>`));
  revalidatePath('/admin/waitlist'); return { ok: true, code };
}
