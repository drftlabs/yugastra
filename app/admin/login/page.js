'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { browserClient } from '@/lib/supabase/client';
export default function AdminLogin() {
  const [f, setF] = useState({ email: '', password: '' }); const [e, setE] = useState(''); const r = useRouter();
  async function go(ev) { ev.preventDefault(); setE(''); if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return r.push('/admin'); const { error } = await browserClient().auth.signInWithPassword(f); error ? setE(error.message) : (r.push('/admin'), r.refresh()); }
  return <div className="login"><form className="box" onSubmit={go}><img src="/logo.png" alt="YUGASTRA" /><div className="eyebrow" style={{ textAlign: 'center', marginBottom: 20 }}>Admin</div>
    <div className="field"><label>Email</label><input className="inp" type="email" required value={f.email} onChange={(x) => setF({ ...f, email: x.target.value })} /></div>
    <div className="field"><label>Password</label><input className="inp" type="password" required value={f.password} onChange={(x) => setF({ ...f, password: x.target.value })} /></div>
    {e && <div className="err">{e}</div>}<button className="btn btn-gold btn-block">Sign in</button></form></div>;
}
