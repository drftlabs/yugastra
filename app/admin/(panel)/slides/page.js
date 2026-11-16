import { requireAdmin } from '@/lib/admin';
import Crud from '@/components/admin/Crud';
import Preview from '@/components/admin/Preview';
export default async function P() {
  const { db } = await requireAdmin('slides'); if (!db) return <Preview />;
  const { data } = await db.from('slides').select('*').order('sort');
  const fields = [{ k: 'eyebrow' }, { k: 'title', req: true }, { k: 'subtitle', type: 'textarea' }, { k: 'cta_label', label: 'Button text', def: 'Discover' }, { k: 'cta_href', label: 'Button link', def: '/collections' }, { k: 'theme', type: 'select', options: ['dhruv', 'surya', 'naksh', 'vyom', 'soma'], def: 'dhruv' }, { k: 'image', label: 'Image (optional, replaces dial art)', type: 'image' }, { k: 'sort', type: 'number', def: 0 }, { k: 'active', type: 'bool', def: true }];
  return <><h1>Home slides</h1><Crud table="slides" title="slide" fields={fields} rows={data || []} columns={[{ k: 'title' }, { k: 'eyebrow' }, { k: 'sort' }, { k: 'active', bool: true }]} /></>;
}
