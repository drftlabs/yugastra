import { NextResponse } from 'next/server';
import { serviceClient } from '@/lib/supabase/server';
import { cleanPhone, validPhone, newCode, hashCode, sendWhatsAppCode } from '@/lib/whatsapp';

export async function POST(req) {
  const c = serviceClient(); if (!c) return NextResponse.json({ error: 'Unavailable in preview' }, { status: 503 }); const phone = cleanPhone((await req.json()).phone);
  if (!c || !validPhone(phone)) return NextResponse.json({ error: 'Enter a valid 10-digit mobile number.' }, { status: 400 });
  const { data: ex } = await c.from('wa_otps').select('sent_at').eq('phone', phone).maybeSingle();
  if (ex?.sent_at && Date.now() - new Date(ex.sent_at).getTime() < 30000) return NextResponse.json({ error: 'Please wait 30 seconds before resending.' }, { status: 429 });
  const code = process.env.WA_TEST_CODE || newCode();
  await c.from('wa_otps').upsert({ phone, code_hash: hashCode(phone, code), expires_at: new Date(Date.now() + 600000).toISOString(), attempts: 0, sent_at: new Date().toISOString(), verified_until: null });
  if (!process.env.WA_TEST_CODE) { try { await sendWhatsAppCode(phone, code); } catch (e) { return NextResponse.json({ error: 'Could not send WhatsApp code.' }, { status: 502 }); } }
  return NextResponse.json({ ok: true });
}
