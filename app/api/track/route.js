import { NextResponse } from 'next/server';
import { serviceClient } from '@/lib/supabase/server';
import { cleanPhone } from '@/lib/whatsapp';
export async function POST(req) {
  const c = serviceClient(); if (!c) return NextResponse.json({ error: 'Unavailable in preview' }, { status: 503 });
  const { order, contact } = await req.json();
  const { data: o } = await c.from('orders').select('order_number,status,items,total,courier,tracking_number,tracking_url,created_at,email,phone').ilike('order_number', (order || '').trim()).maybeSingle();
  const k = (contact || '').trim().toLowerCase();
  if (!o || !(o.email === k || o.phone === cleanPhone(k))) return NextResponse.json({ error: 'No matching order found.' }, { status: 404 });
  const { email, phone, ...safe } = o;
  return NextResponse.json({ order: safe });
}
