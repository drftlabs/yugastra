import { NextResponse } from 'next/server';
import { serviceClient, hasSupabase } from '@/lib/supabase/server';
export const dynamic = 'force-dynamic';
// Records one page view (anonymous visitor id, path, referrer host, device). Failures are silent.
export async function POST(req) {
  try {
    if (!hasSupabase()) return new NextResponse(null, { status: 204 });
    const b = JSON.parse(await req.text());
    const path = String(b.p || '').slice(0, 200), v = String(b.v || '').slice(0, 40);
    if (!path.startsWith('/') || !v || path.startsWith('/admin') || path.startsWith('/api')) return new NextResponse(null, { status: 204 });
    await serviceClient().from('page_views').insert({ path, visitor: v, ref: String(b.r || '').slice(0, 100) || null, device: b.d === 'mobile' ? 'mobile' : 'desktop', lang: path.startsWith('/hi') ? 'hi' : 'en' });
  } catch {}
  return new NextResponse(null, { status: 204 });
}
