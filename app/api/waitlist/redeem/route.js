import { NextResponse } from 'next/server';
import { serviceClient } from '@/lib/supabase/server';
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const c = serviceClient(); if (!c) return NextResponse.json({ error: 'Not available in preview.' }, { status: 503 });
  const { data: p } = await c.from('products').select('id').eq('slug', b.slug).maybeSingle();
  const code = String(b.code || '').trim().toUpperCase();
  if (!p || !code) return NextResponse.json({ error: 'That code is not valid.' }, { status: 400 });
  const { data: ac } = await c.from('access_codes').select('*').eq('code', code).eq('product_id', p.id).eq('used', false).maybeSingle();
  if (!ac) return NextResponse.json({ error: 'That code is not valid for this watch, or has already been used.' }, { status: 400 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(`yg_ac_${b.slug}`, code, { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
  return res;
}
