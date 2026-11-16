import { NextResponse } from 'next/server';
import { serviceClient } from '@/lib/supabase/server';
export async function POST(req) {
  const c = serviceClient(); if (c) { const b = await req.json().catch(() => ({})); await c.from('site_events').insert({ name: b.name, path: b.path, meta: b.meta || {} }); }
  return NextResponse.json({ ok: true });
}
