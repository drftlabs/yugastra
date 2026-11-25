import { sendOrderEmails } from '@/lib/email';

// Idempotent + race-safe: only the first caller flips pending_payment -> paid.
// `defer(fn)` lets a route answer the customer first and finish stock, customer and emails afterwards.
export async function markPaid(c, order, paymentId, defer) {
  const { data: upd } = await c.from('orders')
    .update({ status: 'paid', razorpay_payment_id: paymentId || null, paid_at: new Date().toISOString() })
    .eq('id', order.id).eq('status', 'pending_payment').select().maybeSingle();
  if (!upd) return { already: true };
  const rest = async () => {
    const safe = (p) => Promise.resolve(p).catch((e) => console.error('markPaid step', e));
    await Promise.all([
      ...(order.items || []).map((it) => safe(c.rpc('decrement_stock', { p_id: it.id, p_qty: it.qty }))),
      order.discount_code ? safe(c.rpc('use_discount', { p_code: order.discount_code })) : null,
      order.customer_id == null && order.email ? safe((async () => { const cid = await ensureCustomer(c, order); if (cid) await c.from('orders').update({ customer_id: cid }).eq('id', order.id); })()) : null,
      safe(c.from('checkouts').update({ recovered: true }).eq('email', order.email)),
      safe(sendOrderEmails(upd)),
    ]);
  };
  if (defer) { defer(rest); return { ok: true }; }
  await rest(); return { ok: true };
}
// A cash-on-delivery order is logged the moment the customer taps the button (status otp_pending),
// so it shows in Admin even if they never enter the WhatsApp code. Entering the code confirms it.
export async function confirmHold(c, holdId, phone, defer) {
  const { data: o } = await c.from('orders').update({ status: 'pending_payment' })
    .eq('id', holdId).eq('status', 'otp_pending').eq('phone', phone).gte('created_at', new Date(Date.now() - 6 * 3600000).toISOString()).select().maybeSingle(); // an old unconfirmed order cannot be confirmed later
  if (!o) return null;
  await markPaid(c, o, 'COD', defer);
  return o;
}
// Passwordless customer account (email-code login later).
async function ensureCustomer(c, o) {
  try {
    const { data: ex } = await c.from('customers').select('id').eq('email', o.email).maybeSingle();
    if (ex) return ex.id;
    const { data } = await c.auth.admin.createUser({ email: o.email, email_confirm: true });
    if (data?.user) { await c.from('customers').update({ name: o.name, phone: o.phone }).eq('id', data.user.id); return data.user.id; }
  } catch (e) { console.error('ensureCustomer', e); }
  return null;
}
