'use client';
import Link, { useT } from '@/components/L';
import { useShop } from '@/components/ShopProvider';
import Dial from '@/components/Dial';
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function CartDrawer({ freeMin = 0 }) {
  const { items, open, setOpen, subtotal, setQty, remove } = useShop(); const t = useT();
  return (
    <>
      <div className={`scrim ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="drawer-h"><span>{t('Your bag')}</span><button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close">✕</button></div>
        <div className="drawer-b">
          {!items.length && <p style={{ color: 'var(--muted)', padding: '40px 0', textAlign: 'center' }}>{t('Your bag is empty.')}</p>}
          {items.map((i) => (
            <div className="ci" key={i.id}>
              <div className="th">{i.image ? <img src={i.image} alt="" /> : <Dial theme={i.theme} />}</div>
              <div>
                <Link href={`/products/${i.slug}`} onClick={() => setOpen(false)} style={{ fontFamily: 'var(--f-head)', letterSpacing: '.1em', textTransform: 'uppercase', fontSize: 13 }}>{i.name}</Link>
                <div className="qty"><button onClick={() => setQty(i.id, i.qty - 1)}>−</button><span>{i.qty}</span><button onClick={() => setQty(i.id, i.qty + 1)}>+</button></div>
              </div>
              <div style={{ textAlign: 'right' }}><div className="price">{inr(i.price * i.qty)}</div><button onClick={() => remove(i.id)} style={{ background: 'none', border: 0, color: 'var(--muted)', fontSize: 12, cursor: 'pointer', marginTop: 8 }}>{t('Remove')}</button></div>
            </div>
          ))}
        </div>
        {!!items.length && (
          <div className="drawer-f">
            <div className="row total"><span>{t('Subtotal')}</span><span>{inr(subtotal)}</span></div>
            <p style={{ color: 'var(--muted)', fontSize: 12, margin: '8px 0 16px' }}>{t('Shipping and payment options at checkout.')}</p>
            <Link href="/checkout" className="btn btn-gold btn-block" onClick={() => setOpen(false)}>{t('Checkout')}</Link>
          </div>
        )}
      </aside>
    </>
  );
}
