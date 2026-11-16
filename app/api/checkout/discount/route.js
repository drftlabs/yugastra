import { NextResponse } from 'next/server';
import { serviceClient } from '@/lib/supabase/server';
import { checkDiscount } from '@/lib/pricing';
export async function POST(req) {
  const c = serviceClient(); if (!c) return NextResponse.json({ ok: false, error: 'Unavailable in preview' });
  const { code, subtotal } = await req.json();
  return NextResponse.json(await checkDiscount(c, code, Number(subtotal) || 0));
}
