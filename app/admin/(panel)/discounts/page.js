import { requireAdmin } from '@/lib/admin';
import Crud from '@/components/admin/Crud';
import Preview from '@/components/admin/Preview';
export default async function P() {
  const { db } = await requireAdmin('discounts'); if (!db) return <Preview />;
  const { data } = await db.from('discounts').select('*').order('code');
  const fields = [{ k: 'code', req: true }, { k: 'kind', label: 'Type', type: 'select', options: ['percent', 'flat'], def: 'percent' }, { k: 'value', label: 'Value (% or ₹)', type: 'number', req: true }, { k: 'min_order', label: 'Minimum order (₹)', type: 'number', def: 0 }, { k: 'max_uses', label: 'Max uses (0 = unlimited)', type: 'number', def: 0 }, { k: 'expires_at', label: 'Expires', type: 'date' }, { k: 'active', type: 'bool', def: true }];
  return <><h1>Discounts</h1><Crud table="discounts" title="code" fields={fields} rows={data || []} columns={[{ k: 'code' }, { k: 'kind' }, { k: 'value' }, { k: 'used' }, { k: 'max_uses' }, { k: 'active', bool: true }]} /></>;
}
