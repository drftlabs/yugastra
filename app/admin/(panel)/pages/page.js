import { requireAdmin } from '@/lib/admin';
import Crud from '@/components/admin/Crud';
import Preview from '@/components/admin/Preview';
import { legalDefaults } from '@/lib/legalDefaults';
export default async function P() {
  const { db } = await requireAdmin('pages'); if (!db) return <Preview />;
  const { data } = await db.from('pages').select('*');
  const have = new Set((data || []).map((r) => r.slug));
  const rows = [...(data || []), ...Object.entries(legalDefaults).filter(([s]) => !have.has(s)).map(([slug, v]) => ({ slug, ...v }))];
  const fields = [{ k: 'slug', req: true, label: 'Slug (privacy, terms, shipping, refund, warranty, grievance)' }, { k: 'title', req: true }, { k: 'body', label: 'Body (HTML)', type: 'textarea', tall: true }, { k: 'title_hi', label: 'हिंदी · title' }, { k: 'body_hi', label: 'हिंदी · body (HTML)', type: 'textarea', tall: true }];
  return <><h1>Legal pages</h1><p style={{ color: 'var(--muted)', marginBottom: 16 }}>Edit a page and save to override the built-in starter text.</p><Crud table="pages" pk="slug" title="page" fields={fields} rows={rows} columns={[{ k: 'slug' }, { k: 'title' }]} /></>;
}
