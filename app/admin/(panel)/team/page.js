import { requireAdmin, TABS } from '@/lib/admin';
import Preview from '@/components/admin/Preview';
import { addStaff, setStaffActive } from '@/lib/actions/admin';
export default async function P() {
  const { db, admin } = await requireAdmin(); if (!db) return <Preview />;
  if (!admin.is_owner) return <p>Owner access only.</p>;
  const { data } = await db.from('admins').select('*');
  return <><h1>Team</h1>
    <table className="tbl" style={{ marginBottom: 28 }}><thead><tr><th>Name</th><th>Role</th><th>Access</th><th /></tr></thead><tbody>{(data || []).map((a) => <tr key={a.user_id}><td>{a.display_name}</td><td>{a.is_owner ? 'Owner' : 'Staff'}</td><td>{a.is_owner ? 'All' : (a.perms || []).join(', ')}</td><td>{!a.is_owner && <form action={setStaffActive.bind(null, a.user_id, !a.active)}><button className="btn sm">{a.active ? 'Deactivate' : 'Activate'}</button></form>}</td></tr>)}</tbody></table>
    <form action={addStaff} className="box" style={{ maxWidth: 560 }}><div className="eyebrow">Add staff</div>
      <div className="two" style={{ marginTop: 12 }}><div className="field"><label>Name</label><input className="inp" name="name" required /></div><div className="field"><label>Email</label><input className="inp" name="email" type="email" required /></div></div>
      <div className="field"><label>Password</label><input className="inp" name="password" type="password" minLength={8} required /></div>
      <div className="field"><label>Can access</label><div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>{TABS.filter(([k]) => k !== 'team').map(([k, l]) => <label key={k} style={{ fontSize: 13 }}><input type="checkbox" name="perms" value={k} /> {l}</label>)}</div></div>
      <button className="btn btn-gold">Create staff login</button></form></>;
}
