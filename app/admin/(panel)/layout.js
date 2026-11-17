import { requireAdmin, TABS } from '@/lib/admin';
import AdminNav from '@/components/admin/AdminNav';
import SignOut from '@/components/SignOut';
export const metadata = { title: 'Admin', robots: { index: false } };
export const dynamic = 'force-dynamic';
export default async function Panel({ children }) {
  const { admin, preview } = await requireAdmin();
  const tabs = TABS.filter(([k]) => admin.is_owner || (admin.perms || []).includes(k));
  return (
    <div className="adm">
      <AdminNav tabs={tabs} signOut={!preview ? <SignOut /> : null} />
      <main className="adm-main">{preview && <div className="box" style={{ marginBottom: 20 }}><b>Preview mode</b> <span style={{ color: 'var(--muted)' }}>— no database connected. Add Supabase keys to go live.</span></div>}{children}</main>
    </div>
  );
}
