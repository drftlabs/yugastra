import { NextResponse, unstable_after as after } from 'next/server';
import { confirmHold } from '@/lib/orders';
import { serviceClient } from '@/lib/supabase/server';
import { cleanPhone, hashCode } from '@/lib/whatsapp';

export async function POST(req) {
  const c = serviceClient(); if (!c) return NextResponse.json({ error: 'Unavailable in preview' }, { status: 503 }); const b = await req.json().catch(() => ({})); const phone = cleanPhone(b.phone);
  const { data: o } = await c.from('wa_otps').select('*').eq('phone', phone).maybeSingle();
  if (!o?.code_hash || new Date(o.expires_at) < new Date()) return NextResponse.json({ error: 'Code expired. Request a new one.' }, { status: 400 });
  if (o.attempts >= 5) return NextResponse.json({ error: 'Too many attempts. Request a new code.' }, { status: 429 });
  if (hashCode(phone, String(b.code)) !== o.code_hash) {
    await c.from('wa_otps').update({ attempts: o.attempts + 1 }).eq('phone', phone);
    return NextResponse.json({ error: 'Incorrect code.' }, { status: 400 });
  }
  await c.from('wa_otps').update({ verified_until: new Date(Date.now() + 30 * 60000).toISOString(), code_hash: null }).eq('phone', phone);
  if (b.holdId) {
    const o = await confirmHold(c, b.holdId, phone, typeof after === 'function' ? after : undefined);
    if (!o) return NextResponse.json({ error: 'We could not find this order. Please place it again.' }, { status: 404 });
    return NextResponse.json({ ok: true, cod: true, orderNumber: o.order_number, due: o.amount_due, total: o.total });
  }
  return NextResponse.json({ ok: true });
}
