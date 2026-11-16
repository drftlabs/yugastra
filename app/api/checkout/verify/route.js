import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { serviceClient } from '@/lib/supabase/server';
import { markPaid } from '@/lib/orders';

export async function POST(req) {
  const c = serviceClient();
  if (!c || !process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({ error: 'Payments not configured' }, { status: 503 });
  const b = await req.json().catch(() => ({}));
  const { razorpay_order_id: oid, razorpay_payment_id: pid, razorpay_signature: sig } = b;
  const exp = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${oid}|${pid}`).digest('hex');
  const ok = sig && sig.length === exp.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(exp));
  if (!ok) return NextResponse.json({ error: 'Signature mismatch' }, { status: 400 });
  const { data: order } = await c.from('orders').select('*').eq('razorpay_order_id', oid).maybeSingle();
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  await markPaid(c, order, pid);
  return NextResponse.json({ ok: true, orderNumber: order.order_number });
}
