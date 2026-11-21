// Anonymous analytics helpers (browser only). Visitor id lives in localStorage, session id rolls over after 30 minutes idle.
const rnd = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
export function ids() {
  try {
    let v = localStorage.getItem('yg_vid'); if (!v) { v = rnd(); localStorage.setItem('yg_vid', v); }
    let s = null, fresh = false; const now = Date.now();
    try { const o = JSON.parse(localStorage.getItem('yg_sid') || 'null'); if (o && now - o.t < 30 * 60000) s = o.id; } catch {}
    if (!s) { s = rnd(); fresh = true; }
    localStorage.setItem('yg_sid', JSON.stringify({ id: s, t: now }));
    return { v, s, fresh };
  } catch { return { v: '', s: '', fresh: false }; }
}
export function send(body) {
  try {
    const d = JSON.stringify(body);
    if (navigator.sendBeacon) navigator.sendBeacon('/api/track', new Blob([d], { type: 'text/plain' })); else fetch('/api/track', { method: 'POST', body: d, keepalive: true });
  } catch {}
}
// name: add_to_cart | begin_checkout | ...
export function ev(name, meta = {}) {
  try {
    if (navigator.webdriver || location.pathname.startsWith('/admin')) return;
    const { v, s } = ids(); if (!v) return;
    send({ k: 'ev', n: name, p: location.pathname, v, s, m: meta });
  } catch {}
}
export const visitorId = () => { try { return localStorage.getItem('yg_vid') || ''; } catch { return ''; } };
