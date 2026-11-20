import { NextResponse, unstable_after as after } from 'next/server';
import { cookies } from 'next/headers';
import Razorpay from 'razorpay';
import { serviceClient } from '@/lib/supabase/server';
import { getSettings } from '@/lib/data';
import { waOn } from '@/lib/whatsapp';
import { priceOrder, shippingCfg, checkDiscount, hasAdvance } from '@/lib/pricing';
import { markPaid } from '@/lib/orders';
import { cleanPhone, validPhone } from '@/lib/whatsapp';
import { coverImg } from '@/lib/cover';

async function handle(req) {
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
    items.push({ id: p.id, slug: p.slug, name: p.name, price: Number(p.price), qty, image: coverImg(p) || null });
  }
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const d = await checkDiscount(c, b.code, subtotal);
  const advance = method === 'cod' && b.advance === true && hasAdvance(cfg);
  const pr = priceOrder({ subtotal, discount: d.ok ? d.amount : 0, method, cfg, advance });

  // COD with no advance must be phone-verified via WhatsApp code.
  const waEnabled = waOn();
  const needWA = waEnabled && method === 'cod' && !advance;
  let hold = false;
  if (needWA) {
    const { data: otp } = await c.from('wa_otps').select('*').eq('phone', phone).maybeSingle();
    if (otp?.verified_until && new Date(otp.verified_until) >= new Date()) await c.from('wa_otps').update({ verified_until: null }).eq('phone', phone);
    else hold = true; // log the order now as "unconfirmed"; the WhatsApp code confirms it
  }

  const { data: num, error: nerr } = await c.rpc('next_order_number');
  if (nerr || !num) return NextResponse.json({ error: 'Order numbering is not set up in the database. Run supabase/schema.sql again.' }, { status: 500 });
  const row = {
    order_number: num, status: hold ? 'otp_pending' : 'pending_payment', name: u.name.trim(), email: u.email.trim().toLowerCase(), phone,
    address: u.address.trim(), landmark: (u.landmark || '').trim() || null, city: u.city, state: u.state, pincode: u.pincode, items,
    subtotal: pr.subtotal, discount: pr.discount, discount_code: d.ok ? d.code : null, shipping: pr.shipping,
    total: pr.total, payment_method: method, amount_due: pr.due, lang: b.lang === 'hi' ? 'hi' : 'en',
  };
  // same phone tapping COD again: refresh the one unconfirmed order instead of logging a duplicate
  let reuse = null;
  if (hold) { const { data: ex } = await c.from('orders').select('id,order_number').eq('phone', phone).eq('status', 'otp_pending').gte('created_at', new Date(Date.now() - 6 * 3600000).toISOString()).order('created_at', { ascending: false }).limit(1).maybeSingle(); reuse = ex; }
  if (reuse) row.order_number = reuse.order_number;
  const save = (r) => (reuse ? c.from('orders').update(r).eq('id', reuse.id).select().single() : c.from('orders').insert(r).select().single());
  let { data: order, error } = await save(row);
  if (error && /landmark|lang/.test(error.message || '')) { // older database without these columns
    delete row.landmark; delete row.lang; ({ data: order, error } = await save(row));
  }
  if (error) { console.error('order insert', error); return NextResponse.json({ error: `Could not create order: ${error.message}. Run the latest SQL files in Supabase.` }, { status: 500 }); }
  for (const a of accessIds) { // single-use: spend the code once the order exists
    await c.from('access_codes').update({ used: true, used_at: new Date().toISOString() }).eq('id', a.id);
    await c.from('waitlist_entries').update({ status: 'purchased' }).eq('email', order.email).eq('product_id', a.product_id);
  }

  if (hold) return NextResponse.json({ needWA: true, holdId: order.id, orderNumber: order.order_number, due: pr.due, total: pr.total });
  if (pr.payNow === 0) {
    try { await markPaid(c, order, 'COD', typeof after === 'function' ? after : undefined); } catch (e) { console.error('markPaid', e); } // the order exists; follow-up steps must not fail the customer
    return NextResponse.json({ cod: true, orderNumber: order.order_number, due: pr.due, total: pr.total });
  }
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    await c.from('orders').update({ status: 'cancelled', notes: 'Razorpay keys missing' }).eq('id', order.id);
    return NextResponse.json({ error: 'Online payment is not set up yet (Razorpay keys missing). Please choose cash on delivery.' }, { status: 503 });
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

// Never let an unexpected error return an empty 500: the checkout form shows the message.
export async function POST(req) {
  try { return await handle(req); }
  catch (e) { console.error('checkout/create', e); return NextResponse.json({ error: `Checkout error: ${e?.message || 'unknown'}. Open Admin → Checkout check.` }, { status: 500 }); }
}
