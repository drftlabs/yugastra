'use client';
import { useEffect } from 'react';
import { px } from '@/lib/pixel';
export default function PixelPurchase({ order }) {
  useEffect(() => {
    try {
      const k = 'yg_px_' + order; if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, '1');
      const last = JSON.parse(sessionStorage.getItem('yg_last') || '{}');
      setTimeout(() => px('Purchase', { value: Number(last.value) || 0, currency: 'INR', content_type: 'product', num_items: last.n || 1 }), 800);
    } catch {}
  }, [order]);
  return null;
}
