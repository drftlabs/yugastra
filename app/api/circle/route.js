import { NextResponse } from 'next/server';
import { serviceClient } from '@/lib/supabase/server';
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  if (!b.name || !/^\S+@\S+\.\S+$/.test(b.email || '')) return NextResponse.json({ error: 'Please enter your name and a valid email.' }, { status: 400 });
  const c = serviceClient(); if (!c) return NextResponse.json({ ok: true, preview: true });
  const { error } = await c.from('circle_signups').upsert({ name: b.name, email: b.email.toLowerCase(), phone: b.phone || null }, { onConflict: 'email' });
  if (error) return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
