// Meta Pixel helpers. Safe to call anywhere: does nothing until a Pixel ID is saved in Admin → Settings.
export const px = (name, data) => { try { if (typeof window !== 'undefined' && window.fbq) window.fbq('track', name, data); } catch {} };
