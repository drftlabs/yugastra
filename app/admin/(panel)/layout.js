import Link from 'next/link';
import { requireAdmin, TABS } from '@/lib/admin';
import SignOut from '@/components/SignOut';
export const metadata = { title: 'Admin', robots: { index: false } };
export const dynamic = 'force-dynamic';
export default async function Panel({ children }) {
  const { admin, preview } = await requireAdmin();
  const tabs = TABS.filter(([k]) => admin.is_owner || (admin.perms || []).includes(k));
  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="brand"><img src="/logo.png" alt="YUGASTRA" /></div>
        <Link href="/admin">Dashboard</Link>
        <h5>Manage</h5>{tabs.map(([k, l]) => <Link key={k} href={`/admin/${k}`}>{l}</Link>)}
        <h5>Site</h5><Link href="/" target="_blank">View website ↗</Link>
        <div style={{ padding: '18px 22px' }}>{!preview && <SignOut />}</div>
      </aside>
      <main className="adm-main">{preview && <div className="box" style={{ marginBottom: 20 }}><b>Preview mode</b> <span style={{ color: 'var(--muted)' }}>— no database connected. Add Supabase keys to go live.</span></div>}{children}</main>
    </div>
  );
}
