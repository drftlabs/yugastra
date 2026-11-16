import { sendOrderEmails } from '@/lib/email';

// Idempotent + race-safe: only the first caller flips pending_payment -> paid.
export async function markPaid(c, order, paymentId) {
  const { data: upd } = await c.from('orders')
    .update({ status: 'paid', razorpay_payment_id: paymentId || null, paid_at: new Date().toISOString() })
    .eq('id', order.id).eq('status', 'pending_payment').select().maybeSingle();
  if (!upd) return { already: true };
  for (const it of order.items || []) await c.rpc('decrement_stock', { p_id: it.id, p_qty: it.qty });
  if (order.discount_code) await c.rpc('use_discount', { p_code: order.discount_code });
  if (order.customer_id == null && order.email) {
    const cid = await ensureCustomer(c, order);
    if (cid) await c.from('orders').update({ customer_id: cid }).eq('id', order.id);
  }
  await c.from('checkouts').update({ recovered: true }).eq('email', order.email);
  await sendOrderEmails(upd);
  return { ok: true };
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
