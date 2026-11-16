import crypto from 'crypto';
export const cleanPhone = (p) => String(p || '').replace(/\D/g, '').slice(-10);
export const validPhone = (p) => /^[6-9]\d{9}$/.test(cleanPhone(p));
export const newCode = () => String(crypto.randomInt(1000, 10000));
export const hashCode = (phone, code) =>
  crypto.createHash('sha256').update(`${phone}:${code}:${process.env.SUPABASE_SERVICE_ROLE_KEY}`).digest('hex');
export async function sendWhatsAppCode(phone, code) {
  const { WHATSAPP_TOKEN: t, WHATSAPP_PHONE_ID: id } = process.env;
  if (!t || !id) throw new Error('WhatsApp not configured');
  const r = await fetch(`https://graph.facebook.com/v20.0/${id}/messages`, {
    method: 'POST', headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp', to: '91' + phone, type: 'template',
      template: {
        name: process.env.WHATSAPP_TEMPLATE || 'order_confirm_code', language: { code: process.env.WHATSAPP_LANG || 'en' },
        components: [
          { type: 'body', parameters: [{ type: 'text', text: code }] },
          { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: code }] },
        ],
      },
    }),
  });
  if (!r.ok) throw new Error('WhatsApp send failed');
}
