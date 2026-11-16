import { NextResponse } from 'next/server';
import { serviceClient } from '@/lib/supabase/server';
export async function POST(req) {
  const c = serviceClient(); if (!c) return NextResponse.json({ ok: true });
  const b = await req.json(); if (!/^\S+@\S+\.\S+$/.test(b.email || '')) return NextResponse.json({ ok: true });
  await c.from('checkouts').upsert({ email: b.email.toLowerCase(), phone: b.phone, name: b.name, items: b.items, total: b.total, updated_at: new Date().toISOString() }, { onConflict: 'email' }).select();
  return NextResponse.json({ ok: true });
}
