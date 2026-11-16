import { requireAdmin } from '@/lib/admin';
import Crud from '@/components/admin/Crud';
import Preview from '@/components/admin/Preview';
export default async function P() {
  const { db } = await requireAdmin('journal'); if (!db) return <Preview />;
  const { data } = await db.from('journal_posts').select('*').order('sort');
  const fields = [{ k: 'title', req: true }, { k: 'slug', req: true }, { k: 'realm', type: 'select', options: ['dhruv', 'surya', 'naksh', 'vyom', 'soma'] },
    { k: 'excerpt', type: 'textarea' }, { k: 'body', label: 'Body (leave a blank line between paragraphs)', type: 'textarea' },
    { k: 'title_hi', label: 'हिंदी · title' }, { k: 'excerpt_hi', label: 'हिंदी · excerpt', type: 'textarea' }, { k: 'body_hi', label: 'हिंदी · body', type: 'textarea' },
    { k: 'cover', label: 'Cover image', type: 'image' }, { k: 'sort', type: 'number', def: 0 }, { k: 'published', type: 'bool', def: true }];
  return <><h1>Journal</h1><Crud table="journal_posts" title="piece" fields={fields} rows={data || []} columns={[{ k: 'title' }, { k: 'realm' }, { k: 'published', bool: true }]} /></>;
}
