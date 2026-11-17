import { requireAdmin } from '@/lib/admin';
import Crud from '@/components/admin/Crud';
import ProductsCsv from '@/components/admin/ProductsCsv';
import Preview from '@/components/admin/Preview';
export default async function P() {
  const { db } = await requireAdmin('products'); if (!db) return <Preview />;
  const [{ data: rows }, { data: cols }] = await Promise.all([db.from('products').select('*').order('sort'), db.from('collections').select('id,name').order('sort')]);
  const fields = [
    { k: 'name', req: true }, { k: 'slug', label: 'Slug (URL)', req: true }, { k: 'collection_id', label: 'Collection', type: 'select', options: (cols || []).map((c) => ({ v: c.id, l: c.name })) },
    { k: 'sku', label: 'SKU' }, { k: 'stock_mode', label: 'Availability', type: 'select', options: ['in_stock', 'waitlist', 'sold_out'], def: 'in_stock' }, { k: 'tagline' }, { k: 'case_color', label: 'Case colour', type: 'select', options: ['Black', 'Silver', 'Gold'] }, { k: 'strap_color', label: 'Strap colour', type: 'select', options: ['Black', 'Blue', 'Brown', 'Maroon', 'Green', 'White'] }, { k: 'price', label: 'Price (₹)', type: 'number', req: true }, { k: 'compare_price', label: 'Compare-at price', type: 'number' },
    { k: 'stock', label: 'Stock', type: 'number', def: 0 }, { k: 'weight_g', label: 'Weight (g)', type: 'number', def: 85 },
    { k: 'description', label: 'Basic description', type: 'textarea' }, { k: 'long_description', label: 'Description (colour story)', type: 'textarea' }, { k: 'tagline_hi', label: 'हिंदी · tagline' }, { k: 'description_hi', label: 'हिंदी · basic description', type: 'textarea' }, { k: 'long_description_hi', label: 'हिंदी · description (colour story)', type: 'textarea' }, { k: 'features', label: 'Key features', type: 'list' }, { k: 'seo_title', label: 'SEO title' }, { k: 'seo_description', label: 'SEO description', type: 'textarea' }, { k: 'images', label: 'Images (first is cover)', type: 'images' }, { k: 'video', label: 'Video (upload; shown after the photos)', type: 'image', hint: 'Upload an MP4 or paste its link.' }, { k: 'specs', label: 'Specifications', type: 'kv' },
    { k: 'sort', type: 'number', def: 0 }, { k: 'featured', type: 'bool' }, { k: 'active', type: 'bool', def: true },
  ];
  const { data: boxRows } = await db.from('site_images').select('*').eq('slot', 'box_photo');
  const boxFields = [{ k: 'slot', type: 'select', options: ['box_photo'], def: 'box_photo', req: true }, { k: 'image', type: 'image', hint: 'One box photo. It is added as the last photo of every product.' }, { k: 'active', type: 'bool', def: true }];
  return <><h1>Box photo (shown last on every product)</h1><Crud table="site_images" title="box photo" fields={boxFields} rows={boxRows || []} columns={[{ k: 'slot' }, { k: 'active', bool: true }]} /><h1 style={{ marginTop: 40 }}>Products & inventory</h1><ProductsCsv products={rows || []} collections={cols || []} /><Crud table="products" title="timepiece" fields={fields} rows={rows || []} columns={[{ k: 'name' }, { k: 'price', money: true }, { k: 'stock' }, { k: 'sku', label: 'SKU' }, { k: 'featured', bool: true }, { k: 'active', bool: true }]} /></>;
}
