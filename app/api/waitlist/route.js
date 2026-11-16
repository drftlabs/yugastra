import { NextResponse } from 'next/server';
import { serviceClient } from '@/lib/supabase/server';
import { send, shell } from '@/lib/email';
import { cleanPhone, validPhone } from '@/lib/whatsapp';
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const phone = cleanPhone(b.phone || '');
  if (!b.name?.trim() || !/^\S+@\S+\.\S+$/.test(b.email || '') || !validPhone(phone))
    return NextResponse.json({ error: 'Please enter your name, a valid WhatsApp number and email.' }, { status: 400 });
  const c = serviceClient(); if (!c) return NextResponse.json({ ok: true, preview: true });
  const { data: p } = await c.from('products').select('id,name').eq('slug', b.slug).maybeSingle();
  if (!p) return NextResponse.json({ error: 'Watch not found.' }, { status: 404 });
  const email = b.email.trim().toLowerCase();
  const { data: dup } = await c.from('waitlist_entries').select('id').eq('product_id', p.id).eq('email', email).maybeSingle();
  if (!dup) {
    const { error } = await c.from('waitlist_entries').insert({ product_id: p.id, product_name: p.name, name: b.name.trim(), phone, email });
    if (error) return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 });
    await send(process.env.ADMIN_NOTIFY_EMAIL, `Waitlist: ${p.name}`, shell(`<p><b>${b.name}</b> joined the waitlist for <b>${p.name}</b>.</p><p>${phone} · ${email}</p>`));
    await send(email, `You are on the list for ${p.name}`, shell(`<p>Thank you, ${b.name}.</p><p>You are on the waitlist for <b>${p.name}</b>. We will write to you with a private access code.</p>`));
  }
  return NextResponse.json({ ok: true });
}
