// Server is the source of truth for all money maths.
export function shippingCfg(s) {
  return {
    freeMin: Number(s.free_shipping_min) || 0, fee: Number(s.shipping_fee) || 0,
    codEnabled: s.cod_enabled === true || s.cod_enabled === 'true',
    codFee: Number(s.cod_fee) || 0, codPct: Number(s.cod_prepaid_pct) || 0, codFlat: Number(s.cod_prepaid_flat) || 0,
  };
}
export const hasAdvance = (cfg) => (Number(cfg.codPct) || 0) > 0 || (Number(cfg.codFlat) || 0) > 0;
// COD has two forms: (1) pay a small advance online, free shipping; (2) pay nothing now, a COD fee applies, confirmed on WhatsApp.
export function priceOrder({ subtotal, discount = 0, method, cfg, advance = false }) {
  const disc = Math.min(discount, subtotal);
  const after = subtotal - disc;
  if (method === 'cod') {
    if (advance && hasAdvance(cfg)) {
      const pct = Math.min(100, Math.max(0, Number(cfg.codPct) || 0));
      const flat = Math.max(0, Number(cfg.codFlat) || 0);
      const adv = flat > 0 ? Math.min(flat, after) : Math.ceil((after * pct) / 100);
      const payNow = Math.max(1, adv);
      return { method, advance: true, subtotal, discount: disc, shipping: 0, total: after, payNow, due: after - payNow };
    }
    const shipping = Number(cfg.codFee) || 0, total = after + shipping;
    return { method, advance: false, subtotal, discount: disc, shipping, total, payNow: 0, due: total };
  }
  const shipping = cfg.freeMin > 0 && after < cfg.freeMin ? cfg.fee : cfg.freeMin > 0 ? 0 : cfg.fee;
  const total = after + shipping;
  return { method: 'online', subtotal, discount: disc, shipping, total, payNow: total, due: 0 };
}
export async function checkDiscount(c, code, subtotal) {
  if (!code) return { ok: false, amount: 0 };
  const { data: d } = await c.from('discounts').select('*').ilike('code', code.trim()).eq('active', true).maybeSingle();
  if (!d) return { ok: false, amount: 0, error: 'Invalid code' };
  if (d.expires_at && new Date(d.expires_at) < new Date()) return { ok: false, amount: 0, error: 'Code expired' };
  if (d.max_uses > 0 && d.used >= d.max_uses) return { ok: false, amount: 0, error: 'Code fully used' };
  if (subtotal < Number(d.min_order || 0)) return { ok: false, amount: 0, error: `Minimum order ₹${d.min_order}` };
  const amount = d.kind === 'flat' ? Number(d.value) : Math.round((subtotal * Number(d.value)) / 100);
  return { ok: true, amount: Math.min(amount, subtotal), code: d.code };
}
