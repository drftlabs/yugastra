import { requireAdmin } from '@/lib/admin';
import Crud from '@/components/admin/Crud';
import Preview from '@/components/admin/Preview';
export default async function P() {
  const { db } = await requireAdmin('circle'); if (!db) return <Preview />;
  const { data } = await db.from('circle_members').select('*').order('sort');
  const fields = [{ k: 'name' }, { k: 'watch' }, { k: 'dial' }, { k: 'diameter' }, { k: 'edition', label: 'Edition (#001)' }, { k: 'image', type: 'image' }, { k: 'sort', type: 'number', def: 0 }, { k: 'active', type: 'bool', def: true }];
  return <><h1>The Circle</h1><Crud table="circle_members" title="member" fields={fields} rows={data || []} columns={[{ k: 'name' }, { k: 'watch' }, { k: 'edition' }, { k: 'active', bool: true }]} /></>;
}
