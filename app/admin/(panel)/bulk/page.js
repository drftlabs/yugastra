import { requireAdmin } from '@/lib/admin';
import BulkUpload from '@/components/admin/BulkUpload';
export default async function P() {
  await requireAdmin('bulk');
  return <><h1>Bulk image upload</h1><BulkUpload /></>;
}
