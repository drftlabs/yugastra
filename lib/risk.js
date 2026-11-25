// Flags orders that share a phone number or email with another real order (not cancelled, not unconfirmed, not unpaid).
export const REAL = (o) => !['cancelled', 'otp_pending', 'pending_payment'].includes(o.status);
const ph = (x) => String(x || '').replace(/\D/g, '').slice(-10);
const em = (x) => String(x || '').trim().toLowerCase();
export function riskMap(rows) {
  const byP = new Map(), byE = new Map(), out = new Map();
  const add = (m, k, o) => { if (!k) return; if (!m.has(k)) m.set(k, []); m.get(k).push(o); };
  rows.filter(REAL).forEach((o) => { add(byP, ph(o.phone), o); add(byE, em(o.email), o); });
  const mark = (list, why) => {
    if (list.length < 2) return;
    list.forEach((o) => { const r = out.get(o.id) || { why: new Set(), others: new Map() }; r.why.add(why); list.forEach((x) => { if (x.id !== o.id) r.others.set(x.id, x); }); out.set(o.id, r); });
  };
  byP.forEach((l) => mark(l, 'phone')); byE.forEach((l) => mark(l, 'email'));
  return out;
}
export const riskLabel = (r) => `Risk · ${r.others.size + 1} orders, same ${[...r.why].join(' + ')}`;
export const phoneKey = ph; export const emailKey = em;
