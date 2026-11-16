import { requireAdmin } from '@/lib/admin';
export async function GET() {
  const { db } = await requireAdmin('orders'); if (!db) return new Response('preview', { status: 503 });
  const { data } = await db.from('orders').select('*').order('created_at', { ascending: false });
  const cols = ['order_number', 'created_at', 'status', 'name', 'email', 'phone', 'address', 'city', 'state', 'pincode', 'subtotal', 'discount', 'shipping', 'total', 'payment_method', 'amount_due', 'courier', 'tracking_number'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [cols.join(','), ...(data || []).map((o) => cols.map((c) => esc(o[c])).join(','))].join('\n');
  return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=yugastra-orders.csv' } });
}
