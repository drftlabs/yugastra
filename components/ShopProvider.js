'use client';
import { px } from '@/lib/pixel';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const Ctx = createContext(null);
export const useShop = () => useContext(Ctx);

export default function ShopProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem('yg_cart') || '[]')); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem('yg_cart', JSON.stringify(items)); } catch {} }, [items]);
  const api = useMemo(() => ({
    items, open, setOpen,
    count: items.reduce((s, i) => s + i.qty, 0),
    subtotal: items.reduce((s, i) => s + i.price * i.qty, 0),
    add: (p, qty = 1, openDrawer = true) => {
      setItems((cur) => {
        const ex = cur.find((i) => i.id === p.id);
        const max = p.stock ?? 5;
        if (ex) return cur.map((i) => (i.id === p.id ? { ...i, qty: Math.min(max, 5, i.qty + qty) } : i));
        return [...cur, { id: p.id, slug: p.slug, name: p.name, price: Number(p.price), image: (p.images?.length >= 6 ? p.images[2] : p.images?.[0]) || null, theme: p.theme || 'solar', stock: p.stock, qty }];
      });
      px('AddToCart', { content_ids: [p.id], content_name: p.name, content_type: 'product', value: Number(p.price), currency: 'INR' });
      if (openDrawer) setOpen(true);
    },
    setQty: (id, qty) => setItems((cur) => (qty < 1 ? cur.filter((i) => i.id !== id) : cur.map((i) => (i.id === id ? { ...i, qty: Math.min(i.stock ?? 5, 5, qty) } : i)))),
    remove: (id) => setItems((cur) => cur.filter((i) => i.id !== id)),
    clear: () => setItems([]),
  }), [items, open]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
