import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// /hi/... serves the same pages in Hindi. We rewrite it to the plain route and pass the language on a header.
export async function middleware(req) {
  const full = req.nextUrl.pathname;
  const hi = full === '/hi' || full.startsWith('/hi/');
  const p = hi ? (full.slice(3) || '/') : full;
  let res;
  if (hi) {
    const h = new Headers(req.headers); h.set('x-lang', 'hi'); h.set('x-path', p);
    const u = req.nextUrl.clone(); u.pathname = p;
    res = NextResponse.rewrite(u, { request: { headers: h } });
  } else {
    const h = new Headers(req.headers); h.set('x-lang', 'en'); h.set('x-path', p);
    res = NextResponse.next({ request: { headers: h } });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return res; // preview mode (demo data)
  if (!p.startsWith('/account') && !p.startsWith('/admin')) return res;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const pre = hi ? '/hi' : '';
  if (p.startsWith('/account') && !p.startsWith('/account/login') && !user)
    return NextResponse.redirect(new URL(`${pre}/account/login`, req.url));
  if (p.startsWith('/admin') && !p.startsWith('/admin/login') && !user)
    return NextResponse.redirect(new URL('/admin/login', req.url));
  return res;
}
export const config = { matcher: ['/((?!_next/|api/|.*\\..*).*)'] };
