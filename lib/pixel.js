// Meta Pixel helpers. Safe to call anywhere: does nothing until a Pixel ID is saved in Admin → Settings.
// Also logs the matching funnel event for Admin → Analytics → Traffic.
import { ev } from '@/lib/track';
const OWN = { AddToCart: 'add_to_cart', InitiateCheckout: 'begin_checkout' };
export const px = (name, data) => {
  try { if (typeof window !== 'undefined' && window.fbq) window.fbq('track', name, data); } catch {}
  try { if (typeof window !== 'undefined' && OWN[name]) ev(OWN[name], { name: data?.content_name || '', value: data?.value || '' }); } catch {}
};
