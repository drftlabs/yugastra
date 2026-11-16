import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { serviceClient } from '@/lib/supabase/server';
import { markPaid } from '@/lib/orders';

// Safety net if the customer closes the tab after paying.
export async function POST(req) {
  const c = serviceClient();
  if (!c || !process.env.RAZORPAY_WEBHOOK_SECRET) return NextResponse.json({ error: 'not configured' }, { status: 503 });
  const raw = await req.text(); const sig = req.headers.get('x-razorpay-signature') || '';
  const exp = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(raw).digest('hex');
  if (sig.length !== exp.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(exp))) return NextResponse.json({ error: 'bad sig' }, { status: 400 });
  let ev; try { ev = JSON.parse(raw); } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  if (!['payment.captured', 'order.paid'].includes(ev.event)) return NextResponse.json({ ok: true });
  const pay = ev.payload?.payment?.entity; const oid = pay?.order_id || ev.payload?.order?.entity?.id;
  const { data: order } = await c.from('orders').select('*').eq('razorpay_order_id', oid).maybeSingle();
  if (order) await markPaid(c, order, pay?.id);
  return NextResponse.json({ ok: true });
}
