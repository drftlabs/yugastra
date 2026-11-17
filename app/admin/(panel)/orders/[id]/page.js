import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { updateOrder, updateOrderAddress, cancelOrder, deleteOrder } from '@/lib/actions/admin';
import ConfirmForm from '@/components/admin/ConfirmForm';
import { orderLabel } from '@/lib/orderLabel';
import { inr } from '@/lib/data';
import Preview from '@/components/admin/Preview';
export default async function Order({ params }) {
  const { db } = await requireAdmin('orders'); if (!db) return <Preview />;
  const { data: o } = await db.from('orders').select('*').eq('id', params.id).maybeSingle(); if (!o) notFound();
  const act = updateOrder.bind(null, o.id); const addr = updateOrderAddress.bind(null, o.id);
  const cod = o.payment_method === 'cod';
  return (<><Link href="/admin/orders" className="link-arrow">← Orders</Link><h1 style={{ marginTop: 18 }}>{o.order_number} <span className={`pm ${o.payment_method === 'cod' ? 'cod' : 'pre'}`}>{o.payment_method === 'cod' ? 'COD' : 'Prepaid'}</span></h1>
    <p style={{ margin: '-10px 0 16px' }}><span className={`pill ${o.status}`}>{orderLabel(o)}</span>{(o.status === 'pending_payment' || o.status === 'cancelled') && <small style={{ color: 'var(--muted)', marginLeft: 10 }}>Not a confirmed order (listed under Abandoned carts)</small>}</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
      <div className="box"><div className="eyebrow">Customer</div><p style={{ margin: '10px 0' }}>{o.name}<br />{o.email}<br />{o.phone}<br />{o.address}, {o.city}, {o.state} {o.pincode}</p>
        <div className="eyebrow" style={{ marginTop: 20 }}>Items</div>{(o.items || []).map((i) => <div className="row ord-row" key={i.id}><span className="ord-it">{i.image && <img src={i.image} alt="" />}<span>{i.name} × {i.qty}{i.slug && <><br /><Link href={`/products/${i.slug}`} target="_blank" className="link-arrow" style={{ fontSize: 10 }}>View product ↗</Link></>}</span></span><span>{inr(i.price * i.qty)}</span></div>)}
        <div className="row"><span>Discount {o.discount_code && `(${o.discount_code})`}</span><span>−{inr(o.discount)}</span></div><div className="row"><span>Shipping</span><span>{inr(o.shipping)}</span></div><div className="row total"><span>Total ({o.payment_method})</span><span>{inr(o.total)}</span></div>
        {o.amount_due > 0 && <div className="row"><span>Collect on delivery</span><b style={{ color: 'var(--gold)' }}>{inr(o.amount_due)}</b></div>}
        <div className="pay-box"><div className="eyebrow">Payment</div>
          <div className="row"><span>Method</span><b>{cod ? 'Cash on delivery' : 'Online (Razorpay)'}</b></div>
          {!cod && <div className="row"><span>Razorpay payment ID</span><b style={{ color: 'var(--gold)', userSelect: 'all' }}>{o.razorpay_payment_id || '—'}</b></div>}
          {!cod && o.razorpay_order_id && <div className="row"><span>Razorpay order ID</span><span style={{ userSelect: 'all' }}>{o.razorpay_order_id}</span></div>}
          {o.paid_at && <div className="row"><span>Paid at</span><span>{new Date(o.paid_at).toLocaleString('en-IN')}</span></div>}
          {cod && <div className="row"><span>Status</span><span>Not paid yet · confirmed by WhatsApp code</span></div>}</div></div>
      <form className="box" action={act}><div className="eyebrow">Fulfilment</div>
        <div className="field" style={{ marginTop: 12 }}><label>Status</label><select className="inp" name="status" defaultValue={o.status}>{['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s}>{s}</option>)}</select></div>
        <div className="field"><label>Courier</label><input className="inp" name="courier" defaultValue={o.courier || ''} /></div>
        <div className="field"><label>Tracking number</label><input className="inp" name="tracking_number" defaultValue={o.tracking_number || ''} /></div>
        <div className="field"><label>Tracking URL</label><input className="inp" name="tracking_url" defaultValue={o.tracking_url || ''} /></div>
        <div className="field"><label>Internal notes</label><textarea className="inp" name="notes" defaultValue={o.notes || ''} /></div>
        <button className="btn-buy" style={{ maxWidth: 260 }}>Save{' '}<small>(emails customer when shipped)</small></button></form>
    </div>
    <form className="box" action={addr} style={{ marginTop: 20 }}><div className="eyebrow">Edit customer details and address</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '0 16px', marginTop: 12 }}>
        {[['name', 'Name'], ['phone', 'Mobile'], ['email', 'Email'], ['pincode', 'Pincode'], ['city', 'City'], ['state', 'State'], ['landmark', 'Landmark']].map(([k, l]) => <div className="field" key={k}><label>{l}</label><input className="inp" name={k} defaultValue={o[k] || ''} /></div>)}
      </div>
      <div className="field"><label>Address</label><textarea className="inp" name="address" defaultValue={o.address || ''} /></div>
      <button className="btn-buy" style={{ maxWidth: 260 }}>Save address</button></form>
    <div className="box" style={{ marginTop: 20, borderColor: 'rgba(255,138,120,.35)' }}><div className="eyebrow" style={{ color: '#ff9f8c' }}>Cancel or delete</div>
      <p style={{ color: 'var(--muted)', fontSize: 13, margin: '8px 0 14px' }}>Cancelling keeps the order on record, returns the stock and moves it to Abandoned carts. Deleting removes it for good. Refund any online payment from the Razorpay dashboard.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {o.status !== 'cancelled' && <ConfirmForm action={cancelOrder.bind(null, o.id)} label="Cancel order" message="Cancel this order and return its stock?" />}
        <ConfirmForm action={deleteOrder.bind(null, o.id)} label="Delete order" message="Delete this order permanently? This cannot be undone." style={{ borderColor: 'rgba(255,138,120,.6)', color: '#ff9f8c' }} />
      </div></div></>);
}
