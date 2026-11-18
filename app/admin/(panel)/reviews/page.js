import { requireAdmin } from '@/lib/admin';
import Crud from '@/components/admin/Crud';
import ConfirmForm from '@/components/admin/ConfirmForm';
import { deleteAllReviews } from '@/lib/actions/admin';
import Preview from '@/components/admin/Preview';
export default async function P() {
  const { db } = await requireAdmin('reviews'); if (!db) return <Preview />;
  const [{ data }, { data: prods }] = await Promise.all([db.from('reviews').select('*').order('created_at', { ascending: false }), db.from('products').select('id,name')]);
  const fields = [{ k: 'product_id', label: 'Product', type: 'select', options: (prods || []).map((p) => ({ v: p.id, l: p.name })) }, { k: 'name' }, { k: 'rating', type: 'number', def: 5 }, { k: 'body', type: 'textarea' }, { k: 'approved', type: 'bool' }, { k: 'featured', type: 'bool' }];
  return <><h1>Reviews</h1><p style={{ color: 'var(--muted)', marginBottom: 12 }}>Only approved reviews appear on the site, as quotes above “Related watches”. Write the name as “Name · City” to show the city on its own line.</p><div style={{ marginBottom: 18 }}><ConfirmForm action={deleteAllReviews} label="Delete all reviews" message="Delete ALL reviews, including any placeholder ones? This cannot be undone." /></div><Crud table="reviews" title="review" fields={fields} rows={data || []} columns={[{ k: 'name' }, { k: 'rating' }, { k: 'body' }, { k: 'approved', bool: true }]} /></>;
}
