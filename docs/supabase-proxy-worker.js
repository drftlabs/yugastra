// Cloudflare Worker: passes every request through to your Supabase project, so the app can use your own domain
// (for example db.yugastra.com) instead of the *.supabase.co address that some Indian networks block.
// 1) Replace REF below with your project reference (the part before .supabase.co).
// 2) Create a Worker in Cloudflare, paste this in, deploy, and attach the custom domain db.yugastra.com.
// 3) In Vercel set NEXT_PUBLIC_SUPABASE_URL to https://db.yugastra.com and redeploy.
const ORIGIN = 'https://REF.supabase.co';
export default {
  async fetch(req) {
    const u = new URL(req.url);
    const target = new URL(u.pathname + u.search, ORIGIN);
    return fetch(new Request(target, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body, redirect: 'manual' }));
  },
};
