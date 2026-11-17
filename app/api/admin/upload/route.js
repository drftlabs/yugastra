import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAdmin } from '@/lib/admin';
export async function POST(req) {
  await requireAdmin();
  const fd = await req.formData(); const f = fd.get('file'); const keep = fd.get('keep') === '1';
  if (!f || typeof f === 'string') return NextResponse.json({ error: 'No file received. Choose an image and try again.' }, { status: 400 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: 'Uploads need BLOB_READ_WRITE_TOKEN. Add it in Vercel, then redeploy.' }, { status: 400 });
  if (f.size > 4.4 * 1024 * 1024) return NextResponse.json({ error: 'Image is over 4.4 MB. Please compress it and try again.' }, { status: 413 });
  let r;
  try { r = keep ? await put(`yugastra/products/${f.name}`, f, { access: 'public', addRandomSuffix: false, allowOverwrite: true }) : await put(`yugastra/${Date.now()}-${f.name}`, f, { access: 'public' }); }
  catch (e) { return NextResponse.json({ error: `Upload failed: ${e?.message || 'storage error'}. If the store is Private, create a Public Blob store.` }, { status: 502 }); }
  return NextResponse.json({ url: r.url });
}
