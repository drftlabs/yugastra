import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Razorpay from 'razorpay';
import { serviceClient } from '@/lib/supabase/server';
import { getSettings } from '@/lib/data';
import { priceOrder, shippingCfg, checkDiscount, hasAdvance } from '@/lib/pricing';
import { markPaid } from '@/lib/orders';
import { cleanPhone, validPhone } from '@/lib/whatsapp';

export async function POST(req) {
  const c = serviceClient();
  if (!c) return NextResponse.json({ error: 'Store is in preview mode. Connect Supabase to take orders.' }, { status: 503 });
  const b = await req.json();
  const u = b.customer || {};
  const phone = cleanPhone(u.phone);
  if (!u.name?.trim() || !/^\S+@\S+\.\S+$/.test(u.email || '') || !validPhone(phone) || !/^\d{6}$/.test(u.pincode || '') || !u.address?.trim())
    return NextResponse.json({ error: 'Please complete all delivery details correctly.' }, { status: 400 });
  if (!Array.isArray(b.items) || !b.items.length) return NextResponse.json({ error: 'Your bag is empty.' }, { status: 400 });

  const settings = await getSettings(); const cfg = shippingCfg(settings);
  const method = b.method === 'cod' ? 'cod' : 'online';
  if (method === 'cod' && !cfg.codEnabled) return NextResponse.json({ error: 'Cash on delivery is unavailable.' }, { status: 400 });

  // Re-read products: never trust browser prices.
  const ids = b.items.map((i) => i.id);
  const { data: prods } = await c.from('products').select('*').in('id', ids).eq('active', true);
  const items = []; const accessIds = [];
  for (const it of b.items) {
    const p = prods?.find((x) => x.id === it.id); const qty = Math.max(1, Math.min(5, parseInt(it.qty) || 1));
    if (!p) return NextResponse.json({ error: 'An item is no longer available.' }, { status: 400 });
    const mode = p.stock_mode || 'in_stock';
    if (mode === 'sold_out') return NextResponse.json({ error: `${p.name} is sold out.` }, { status: 400 });
    if (mode === 'waitlist') {
      const code = cookies().get(`yg_ac_${p.slug}`)?.value;
      const { data: ac } = code ? await c.from('access_codes').select('id').eq('code', code).eq('product_id', p.id).eq('used', false).maybeSingle() : { data: null };
      if (!ac) return NextResponse.json({ error: `${p.name} is available by invitation. Please enter your access code on the watch page.` }, { status: 403 });
      accessIds.push({ id: ac.id, product_id: p.id });
    }
    if (p.stock < qty) return NextResponse.json({ error: `${p.name} has only ${p.stock} left.` }, { status: 400 });
    items.push({ id: p.id, slug: p.slug, name: p.name, price: Number(p.price), qty, image: p.images?.[2] || p.images?.[0] || null });
  }
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const d = await checkDiscount(c, b.code, subtotal);
  const advance = method === 'cod' && b.advance === true && hasAdvance(cfg);
  const pr = priceOrder({ subtotal, discount: d.ok ? d.amount : 0, method, cfg, advance });

  // COD with no advance must be phone-verified via WhatsApp code.
  const waEnabled = !!process.env.NEXT_PUBLIC_WA_CONFIRM;
  const needWA = waEnabled && method === 'cod' && !advance;
  if (needWA) {
    const { data: otp } = await c.from('wa_otps').select('*').eq('phone', phone).maybeSingle();
    if (!otp?.verified_until || new Date(otp.verified_until) < new Date())
      return NextResponse.json({ error: 'Please verify your phone number on WhatsApp first.', needWA: true }, { status: 403 });
    await c.from('wa_otps').update({ verified_until: null }).eq('phone', phone);
  }

  const { data: num } = await c.rpc('next_order_number');
  const { data: order, error } = await c.from('orders').insert({
    order_number: num, status: 'pending_payment', name: u.name.trim(), email: u.email.trim().toLowerCase(), phone,
    address: u.address.trim(), landmark: (u.landmark || '').trim() || null, city: u.city, state: u.state, pincode: u.pincode, items,
    subtotal: pr.subtotal, discount: pr.discount, discount_code: d.ok ? d.code : null, shipping: pr.shipping,
    total: pr.total, payment_method: method, amount_due: pr.due, lang: b.lang === 'hi' ? 'hi' : 'en',
  }).select().single();
  if (error) return NextResponse.json({ error: 'Could not create order.' }, { status: 500 });
  for (const a of accessIds) { // single-use: spend the code once the order exists
    await c.from('access_codes').update({ used: true, used_at: new Date().toISOString() }).eq('id', a.id);
    await c.from('waitlist_entries').update({ status: 'purchased' }).eq('email', order.email).eq('product_id', a.product_id);
  }

  if (pr.payNow === 0) {
    await markPaid(c, order, 'COD');
    return NextResponse.json({ cod: true, orderNumber: order.order_number, due: pr.due, total: pr.total });
  }
  try {
    const rz = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const ro = await rz.orders.create({ amount: Math.round(pr.payNow * 100), currency: 'INR', receipt: order.order_number, notes: { order_id: order.id, method } });
    await c.from('orders').update({ razorpay_order_id: ro.id }).eq('id', order.id);
    return NextResponse.json({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, razorpayOrderId: ro.id, amount: ro.amount, orderNumber: order.order_number,
      due: pr.due, total: pr.total, prefill: { name: u.name, email: u.email, contact: phone },
    });
  } catch (e) {
    console.error(e); return NextResponse.json({ error: 'Payment gateway error. Please try again.' }, { status: 502 });
  }
}
