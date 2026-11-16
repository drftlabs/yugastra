import { headers } from 'next/headers';
// Server-side language, set by middleware from the /hi prefix.
export const getLang = () => { try { return headers().get('x-lang') === 'hi' ? 'hi' : 'en'; } catch { return 'en'; } };
// Use the Hindi copy of any field that has one (field_hi), otherwise the English.
export function lz(x, lang) {
  if (lang !== 'hi' || !x) return x;
  if (Array.isArray(x)) return x.map((r) => lz(r, lang));
  const o = { ...x };
  for (const k of Object.keys(x)) if (k.endsWith('_hi') && x[k]) o[k.slice(0, -3)] = x[k];
  return o;
}
