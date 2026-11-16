'use client';
import { useRouter } from 'next/navigation';
import { browserClient } from '@/lib/supabase/client';
import { useT } from '@/components/L';
export default function SignOut() { const r = useRouter(); const t = useT(); return <button className="btn sm" onClick={async () => { await browserClient().auth.signOut(); r.push('/'); r.refresh(); }}>{t('Sign out')}</button>; }
