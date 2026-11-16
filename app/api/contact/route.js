import { NextResponse } from 'next/server';
import { serviceClient } from '@/lib/supabase/server';
export async function POST(req) {
  const c = serviceClient(); if (!c) return NextResponse.json({ ok: true }); const b = await req.json().catch(() => ({}));
  if (!b.name || !/^\S+@\S+\.\S+$/.test(b.email || '') || !b.body) return NextResponse.json({ error: 'Please fill name, email and message.' }, { status: 400 });
  if (!c) return NextResponse.json({ ok: true, preview: true });
  await c.from('messages').insert({ kind: b.kind === 'complaint' ? 'complaint' : 'contact', name: b.name, email: b.email, phone: b.phone, order_number: b.order_number, body: b.body });
  return NextResponse.json({ ok: true });
}
