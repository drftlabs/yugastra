import crypto from 'crypto';
export const cleanPhone = (p) => String(p || '').replace(/\D/g, '').slice(-10);
export const validPhone = (p) => /^[6-9]\d{9}$/.test(cleanPhone(p));
export const newCode = () => String(crypto.randomInt(1000, 10000));
export const hashCode = (phone, code) =>
  crypto.createHash('sha256').update(`${phone}:${code}:${process.env.SUPABASE_SERVICE_ROLE_KEY}`).digest('hex');
const env = () => ({
  token: process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN || '',
  id: process.env.WHATSAPP_PHONE_ID || process.env.WHATSAPP_PHONE_NUMBER_ID || '',
});
// True when the WhatsApp Cloud API keys are present (no separate switch needed).
export const waConfigured = () => { const e = env(); return !!(e.token && e.id) || !!process.env.WA_TEST_CODE; };
export const waOn = () => !!process.env.NEXT_PUBLIC_WA_CONFIRM || waConfigured();
async function post(id, token, body) {
  const r = await fetch(`https://graph.facebook.com/v20.0/${id}/messages`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, err: j?.error ? `${j.error.message || 'error'}${j.error.code ? ` (code ${j.error.code})` : ''}` : '' };
}
export async function sendWhatsAppCode(phone, code) {
  const { token, id } = env();
  if (!token || !id) throw new Error('WhatsApp keys are missing (WHATSAPP_TOKEN, WHATSAPP_PHONE_ID).');
  const name = process.env.WHATSAPP_TEMPLATE || 'order_confirm_code', language = { code: process.env.WHATSAPP_LANG || 'en' };
  const base = { messaging_product: 'whatsapp', to: '91' + phone, type: 'template' };
  const body = { type: 'body', parameters: [{ type: 'text', text: code }] };
  // Authentication templates carry a "copy code" button; plain utility templates do not. Try with the button first, then without.
  let r = await post(id, token, { ...base, template: { name, language, components: [body, { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: code }] }] } });
  if (!r.ok) r = await post(id, token, { ...base, template: { name, language, components: [body] } });
  if (!r.ok) throw new Error(r.err || 'WhatsApp send failed');
}
