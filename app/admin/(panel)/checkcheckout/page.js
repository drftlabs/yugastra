import { requireAdmin } from '@/lib/admin';
import { hasSupabase } from '@/lib/supabase/server';
export const dynamic = 'force-dynamic';
const Row = ({ ok, label, fix }) => <div className="row" style={{ alignItems: 'flex-start', gap: 14 }}><span style={{ color: ok ? '#8fd19e' : '#ff8a78', width: 20 }}>{ok ? '✓' : '✗'}</span><span style={{ flex: 1 }}>{label}{!ok && fix ? <small style={{ display: 'block', color: 'var(--muted)' }}>{fix}</small> : null}</span></div>;
export default async function P() {
  const { db } = await requireAdmin('checkcheckout');
  const env = (k) => !!process.env[k];
  const checks = [];
  if (db) {
    const [{ count: np }, fn, ac, otp, ord] = await Promise.all([
      db.from('products').select('id', { count: 'exact', head: true }).eq('active', true),
      db.rpc('next_order_number'),
      db.from('access_codes').select('id', { head: true, count: 'exact' }),
      db.from('wa_otps').select('phone', { head: true, count: 'exact' }),
      db.from('orders').select('landmark,lang', { head: true, count: 'exact' }),
    ]);
    checks.push([np > 0, `Products in the database: ${np ?? 0}`, 'No products yet, so the site shows demo products that cannot be bought. Run supabase/products-seed.sql.']);
    checks.push([!fn.error && !!fn.data, 'Order numbering function', 'Run supabase/schema.sql in the Supabase SQL editor.']);
    checks.push([!ac.error, 'access_codes table', 'Run supabase/schema.sql.']);
    checks.push([!otp.error, 'wa_otps table (WhatsApp codes)', 'Run supabase/schema.sql.']);
    checks.push([!ord.error, 'orders.landmark and orders.lang columns', 'Run supabase/seed.sql / the latest SQL files.']);
  }
  return (
    <>
      <h1>Checkout check</h1>
      <div className="box">
        <Row ok={hasSupabase()} label="Supabase connected" fix="Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY in Vercel, then redeploy." />
        <Row ok={env('SUPABASE_SERVICE_ROLE_KEY')} label="SUPABASE_SERVICE_ROLE_KEY" fix="Orders are created with this key. Add it in Vercel and redeploy." />
        {checks.map(([ok, l, f]) => <Row key={l} ok={ok} label={l} fix={f} />)}
        <h3 style={{ margin: '22px 0 8px' }}>Online payment</h3>
        <Row ok={env('RAZORPAY_KEY_ID') && env('RAZORPAY_KEY_SECRET') && env('NEXT_PUBLIC_RAZORPAY_KEY_ID')} label="Razorpay keys (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_RAZORPAY_KEY_ID)" fix="Without these, online payment cannot start. Cash on delivery still works." />
        <h3 style={{ margin: '22px 0 8px' }}>Cash on delivery with WhatsApp code</h3>
        <Row ok={!env('NEXT_PUBLIC_WA_CONFIRM') || (env('WHATSAPP_TOKEN') && env('WHATSAPP_PHONE_ID'))} label="WhatsApp Cloud API (WHATSAPP_TOKEN, WHATSAPP_PHONE_ID)" fix="NEXT_PUBLIC_WA_CONFIRM is on but the WhatsApp keys are missing, so the code can never be sent. Add the keys, or remove NEXT_PUBLIC_WA_CONFIRM to skip the code." />
        <p style={{ color: 'var(--muted)', marginBottom: 0 }}>Variables changed in Vercel only take effect after a new deployment.</p>
      </div>
    </>
  );
}
