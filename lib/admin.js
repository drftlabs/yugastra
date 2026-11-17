import { redirect } from 'next/navigation';
import { sessionClient, serviceClient, hasSupabase } from '@/lib/supabase/server';

export const TABS = [
  ['orders', 'Orders'], ['products', 'Products'], ['collections', 'Collections'], ['slides', 'Home slides'],
  ['circle', 'The Circle'], ['circle-signups', 'Circle sign-ups'], ['journal', 'Journal'], ['images', 'Site images'], ['bulk', 'Bulk image upload'], ['waitlist', 'Waitlist'], ['reviews', 'Reviews'], ['discounts', 'Discounts'], ['customers', 'Customers'],
  ['abandoned', 'Abandoned carts'], ['messages', 'Messages'], ['pages', 'Legal pages'], ['settings', 'Settings'], ['team', 'Team'],
];
// Returns { admin, db }. Redirects to login when not an active admin.
export async function requireAdmin(tab) {
  if (!hasSupabase()) return { admin: { is_owner: true, display_name: 'Preview' }, db: null, preview: true };
  const s = sessionClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) redirect('/admin/login');
  const db = serviceClient();
  const { data: admin } = await db.from('admins').select('*').eq('user_id', user.id).eq('active', true).maybeSingle();
  if (!admin) redirect('/admin/login?e=noaccess');
  if (tab && !admin.is_owner && !(admin.perms || []).includes(tab)) redirect('/admin');
  return { admin, db };
}
