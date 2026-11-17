import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { updateOrder } from '@/lib/actions/admin';
import { inr } from '@/lib/data';
import Preview from '@/components/admin/Preview';
export default async function Order({ params }) {
  const { db } = await requireAdmin('orders'); if (!db) return <Preview />;
  const { data: o } = await db.from('orders').select('*').eq('id', params.id).maybeSingle(); if (!o) notFound();
  const act = updateOrder.bind(null, o.id);
  return (<><Link href="/admin/orders" className="link-arrow">← Orders</Link><h1 style={{ marginTop: 18 }}>{o.order_number} <span className={`pm ${o.payment_method === 'cod' ? 'cod' : 'pre'}`}>{o.payment_method === 'cod' ? 'COD' : 'Prepaid'}</span></h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
      <div className="box"><div className="eyebrow">Customer</div><p style={{ margin: '10px 0' }}>{o.name}<br />{o.email}<br />{o.phone}<br />{o.address}, {o.city}, {o.state} {o.pincode}</p>
        <div className="eyebrow" style={{ marginTop: 20 }}>Items</div>{(o.items || []).map((i) => <div className="row ord-row" key={i.id}><span className="ord-it">{i.image && <img src={i.image} alt="" />}<span>{i.name} × {i.qty}{i.slug && <><br /><Link href={`/products/${i.slug}`} target="_blank" className="link-arrow" style={{ fontSize: 10 }}>View product ↗</Link></>}</span></span><span>{inr(i.price * i.qty)}</span></div>)}
        <div className="row"><span>Discount {o.discount_code && `(${o.discount_code})`}</span><span>−{inr(o.discount)}</span></div><div className="row"><span>Shipping</span><span>{inr(o.shipping)}</span></div><div className="row total"><span>Total ({o.payment_method})</span><span>{inr(o.total)}</span></div>
        {o.amount_due > 0 && <div className="row"><span>Collect on delivery</span><b style={{ color: 'var(--gold)' }}>{inr(o.amount_due)}</b></div>}
        <small style={{ color: 'var(--muted)' }}>Razorpay: {o.razorpay_payment_id || '—'}</small></div>
      <form className="box" action={act}><div className="eyebrow">Fulfilment</div>
        <div className="field" style={{ marginTop: 12 }}><label>Status</label><select className="inp" name="status" defaultValue={o.status}>{['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s}>{s}</option>)}</select></div>
        <div className="field"><label>Courier</label><input className="inp" name="courier" defaultValue={o.courier || ''} /></div>
        <div className="field"><label>Tracking number</label><input className="inp" name="tracking_number" defaultValue={o.tracking_number || ''} /></div>
        <div className="field"><label>Tracking URL</label><input className="inp" name="tracking_url" defaultValue={o.tracking_url || ''} /></div>
        <div className="field"><label>Internal notes</label><textarea className="inp" name="notes" defaultValue={o.notes || ''} /></div>
        <button className="btn-buy" style={{ maxWidth: 260 }}>Save{' '}<small>(emails customer when shipped)</small></button></form>
    </div></>);
}
