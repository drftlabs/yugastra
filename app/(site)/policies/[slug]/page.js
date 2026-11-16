import { notFound } from 'next/navigation';
import { getPage } from '@/lib/data';

export async function generateMetadata({ params }) { const p = await getPage(params.slug); return { title: p?.title || 'Policy' }; }
export default async function Policy({ params }) {
  const p = await getPage(params.slug); if (!p) notFound();
  return <div className="page"><div className="wrap"><h1>{p.title}</h1><div className="prose" style={{ marginTop: 26 }} dangerouslySetInnerHTML={{ __html: p.body }} /></div></div>;
}
