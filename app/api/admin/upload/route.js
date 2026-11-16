import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAdmin } from '@/lib/admin';
export async function POST(req) {
  await requireAdmin();
  const f = (await req.formData()).get('file');
  if (!f || !process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: 'Uploads need BLOB_READ_WRITE_TOKEN. Paste an image URL instead.' }, { status: 400 });
  const r = await put(`yugastra/${Date.now()}-${f.name}`, f, { access: 'public' });
  return NextResponse.json({ url: r.url });
}
