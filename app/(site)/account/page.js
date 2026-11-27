import Link from '@/components/L';
import { redirect } from 'next/navigation';
import { sessionClient, serviceClient, hasSupabase } from '@/lib/supabase/server';
import { inr } from '@/lib/data';
import { getLang } from '@/lib/lang';
import { tr } from '@/lib/i18n';
import SignOut from '@/components/SignOut';
export const metadata = { title: 'Account' };
export const dynamic = 'force-dynamic';
export default async function Account() {
  const t = tr(getLang()); const hi = getLang() === 'hi';
  if (!hasSupabase()) return <div className="page"><div className="wrap"><h1>{t('Account')}</h1><p style={{ color: 'var(--muted)', marginTop: 12 }}>{t('Accounts are available once Supabase is connected.')}</p></div></div>;
  const { data: { user } } = await sessionClient().auth.getUser(); if (!user) redirect(hi ? '/hi/account/login' : '/account/login');
  const { data: orders } = await serviceClient().from('orders').select('order_number,status,total,created_at,items').or(`customer_id.eq.${user.id},email.eq.${user.email}`).not('status', 'in', '(otp_pending)').order('created_at', { ascending: false });
  return <div className="page"><div className="wrap"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h1>{t('Your orders')}</h1><SignOut /></div><p style={{ color: 'var(--muted)', margin: '8px 0 26px' }}>{user.email}</p>
    {!orders?.length ? <p style={{ color: 'var(--muted)' }}>{t('No orders yet.')} <Link className="link-arrow" href="/collections">{t('Browse timepieces')}</Link></p> :
      <table className="tbl"><thead><tr><th>{t('Order')}</th><th>{t('Date')}</th><th>{t('Status')}</th><th>{t('Total')}</th></tr></thead><tbody>{orders.map((o) => <tr key={o.order_number}><td>{o.order_number}</td><td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td><td><span className={`pill ${o.status}`}>{t(o.status.replace('_', ' '))}</span></td><td>{inr(o.total)}</td></tr>)}</tbody></table>}
  </div></div>;
}
