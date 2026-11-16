import { requireAdmin } from '@/lib/admin';
import Crud from '@/components/admin/Crud';
import Preview from '@/components/admin/Preview';
export default async function P() {
  const { db } = await requireAdmin('images'); if (!db) return <Preview />;
  const { data } = await db.from('site_images').select('*').order('slot');
  const fields = [{ k: 'slot', type: 'select', options: ['detail_1', 'detail_2', 'detail_3', 'detail_4', 'wrist_small', 'wrist_large', 'hero_image', 'realm_dhruv', 'realm_surya', 'realm_naksh', 'realm_vyom', 'realm_soma', 'pdp_hand', 'box_photo', 'heritage_photo'], req: true },
    { k: 'image', type: 'image', hint: 'hero_image replaces the first hero slide image. realm_dhruv to realm_soma replace each realm tile on the home page (about 1600 × 1360 px). pdp_hand is the edge-to-edge hand photo on every product page. heritage_photo sits under the hero on the Heritage page (wide, about 2400 × 1200 px). box_photo is added as the last photo of every product. detail_1 to detail_4 fill the four frames on the home page. wrist_small and wrist_large appear in the size guide on every watch page.' },
    { k: 'caption' }, { k: 'caption_hi', label: 'हिंदी · caption' }, { k: 'active', type: 'bool', def: true }];
  return <><h1>Site images</h1><Crud table="site_images" title="image" fields={fields} rows={data || []} columns={[{ k: 'slot' }, { k: 'caption' }, { k: 'active', bool: true }]} /></>;
}
