import { inr } from '@/lib/data';
export async function send(to, subject, html) {
  const key = process.env.RESEND_API_KEY; if (!key || !to) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.EMAIL_FROM || 'YUGASTRA <onboarding@resend.dev>', to, subject, html }),
    });
  } catch (e) { console.error('email failed', e); }
}
export const shell = (body) => `<div style="background:#0a0a0a;color:#f4efe6;font-family:Arial,sans-serif;padding:32px;max-width:560px;margin:auto"><h2 style="letter-spacing:.3em;color:#dca544;font-weight:300">YUGASTRA</h2>${body}</div>`;
export async function sendOrderEmails(o) {
  const lines = (o.items || []).map((i) => `<tr><td>${i.name} × ${i.qty}</td><td align="right">${inr(i.price * i.qty)}</td></tr>`).join('');
  const hi = o.lang === 'hi';
  const body = hi ? `<p>धन्यवाद, ${o.name}। आपका आदेश <b>${o.order_number}</b> स्वीकार कर लिया गया है।</p><table width="100%">${lines}</table><p>कुल: <b>${inr(o.total)}</b>${o.amount_due > 0 ? ` · वितरण पर शेष: <b>${inr(o.amount_due)}</b>` : ''}</p><p style="color:#a29d92">आपकी घड़ी के प्रेषित होते ही हम आपको ट्रैकिंग विवरण ईमेल करेंगे।</p>` : `<p>Thank you, ${o.name}. Your order <b>${o.order_number}</b> is confirmed.</p><table width="100%">${lines}</table><p>Total: <b>${inr(o.total)}</b>${o.amount_due > 0 ? ` · Balance on delivery: <b>${inr(o.amount_due)}</b>` : ''}</p><p style="color:#a29d92">We will email tracking details once your timepiece ships.</p>`;
  await send(o.email, hi ? `आपका आदेश ${o.order_number} स्वीकृत | युगास्त्र` : `Order ${o.order_number} confirmed — YUGASTRA`, shell(body));
  await send(process.env.ADMIN_NOTIFY_EMAIL, `New order ${o.order_number} · ${inr(o.total)}`, shell(`<p>${o.name} · ${o.phone}<br>${o.address}, ${o.city} ${o.pincode}</p><p>Method: ${o.payment_method} · Total ${inr(o.total)}</p>`));
}
export const sendShipEmail = (o) => { const hi = o.lang === 'hi'; return send(o.email, hi ? `आपका युगास्त्र आदेश ${o.order_number} प्रेषित हो गया है` : `Your YUGASTRA order ${o.order_number} has shipped`, shell(`<p>${o.courier || (hi ? 'कूरियर' : 'Courier')} · ${o.tracking_number || ''}</p>${o.tracking_url ? `<p><a style="color:#dca544" href="${o.tracking_url}">${hi ? 'शिपमेंट ट्रैक करें' : 'Track shipment'}</a></p>` : ''}`)); };
