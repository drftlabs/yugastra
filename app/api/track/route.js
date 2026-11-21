import { NextResponse } from 'next/server';
import { serviceClient, hasSupabase } from '@/lib/supabase/server';
export const dynamic = 'force-dynamic';
const dec = (x) => { try { return decodeURIComponent(x || ''); } catch { return x || ''; } };
// Records page views, time on page and funnel events (add to cart, checkout). Anonymous; failures are silent.
export async function POST(req) {
  try {
    if (!hasSupabase()) return new NextResponse(null, { status: 204 });
    const b = JSON.parse(await req.text()); const c = serviceClient(); if (!c) return new NextResponse(null, { status: 204 });
    const v = String(b.v || '').slice(0, 40); if (!v) return new NextResponse(null, { status: 204 });
    if (b.k === 'dur') {
      const t = Math.max(0, Math.min(1800, Number(b.t) || 0)); const pid = String(b.pid || '').slice(0, 40);
      if (pid && t) await c.from('page_views').update({ dur: t }).eq('pid', pid).eq('visitor', v);
      return new NextResponse(null, { status: 204 });
    }
    const path = String(b.p || '').slice(0, 200);
    if (!path.startsWith('/') || path.startsWith('/admin') || path.startsWith('/api')) return new NextResponse(null, { status: 204 });
    const s = String(b.s || '').slice(0, 40) || null;
    if (b.k === 'ev') {
      const name = String(b.n || '').replace(/[^a-z_]/g, '').slice(0, 30); if (!name) return new NextResponse(null, { status: 204 });
      const meta = {}; if (b.m && typeof b.m === 'object') for (const k of Object.keys(b.m).slice(0, 8)) meta[k] = String(b.m[k]).slice(0, 80);
      await c.from('site_events').insert({ name, path, meta, visitor: v, session: s });
      return new NextResponse(null, { status: 204 });
    }
    const h = req.headers;
    const row = { path, visitor: v, ref: String(b.r || '').slice(0, 100) || null, device: ['mobile', 'tablet'].includes(b.d) ? b.d : 'desktop', lang: path.startsWith('/hi') ? 'hi' : 'en' };
    const full = { ...row, session: s, pid: String(b.pid || '').slice(0, 40) || null, medium: String(b.m || '').slice(0, 40) || null, campaign: String(b.c || '').slice(0, 80) || null, landing: !!b.n,
      city: dec(h.get('x-vercel-ip-city')).slice(0, 60) || null, region: String(h.get('x-vercel-ip-country-region') || '').slice(0, 10) || null, country: String(h.get('x-vercel-ip-country') || '').slice(0, 4) || null };
    const { error } = await c.from('page_views').insert(full);
    if (error) await c.from('page_views').insert(row); // older database: run supabase/analytics-v2.sql
  } catch {}
  return new NextResponse(null, { status: 204 });
}
