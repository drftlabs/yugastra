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
        <Row ok={env('RAZORPAY_KEY_ID') && process.env.RAZORPAY_KEY_ID === process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID} label="NEXT_PUBLIC_RAZORPAY_KEY_ID matches RAZORPAY_KEY_ID" fix="Both must be the same Key ID (rzp_test_… or rzp_live_…)." />
        <Row ok={env('RAZORPAY_WEBHOOK_SECRET')} label="RAZORPAY_WEBHOOK_SECRET (backup confirmation if the customer closes the page)" fix="Razorpay → Settings → Webhooks → add https://YOURDOMAIN/api/razorpay/webhook for payment.captured and copy its secret here." />
        <h3 style={{ margin: '22px 0 8px' }}>Cash on delivery with WhatsApp code</h3>
        <Row ok={!!((process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN) && (process.env.WHATSAPP_PHONE_ID || process.env.WHATSAPP_PHONE_NUMBER_ID))} label="WhatsApp keys: WHATSAPP_TOKEN and WHATSAPP_PHONE_ID" fix="WHATSAPP_PHONE_ID is the Phone number ID from Meta (a long number), not the phone number itself." />
        <Row ok={true} label={`Template name in use: ${process.env.WHATSAPP_TEMPLATE || 'order_confirm_code'} (language ${process.env.WHATSAPP_LANG || 'en'})`} />
        <Row ok={!process.env.WA_TEST_CODE} label="WA_TEST_CODE is empty" fix="WA_TEST_CODE skips real WhatsApp messages. Remove it in production." />
        <p style={{ color: 'var(--muted)', marginBottom: 0 }}>Variables changed in Vercel only take effect after a new deployment.</p>
      </div>
    </>
  );
}
