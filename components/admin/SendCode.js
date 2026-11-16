'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendAccessCode } from '@/lib/actions/admin';
export default function SendCode({ id, phone, name, product, invited }) {
  const [code, setCode] = useState(''); const [busy, setBusy] = useState(false); const r = useRouter();
  const go = async () => { setBusy(true); const x = await sendAccessCode(id); setBusy(false); if (x.error) alert(x.error); else { setCode(x.code); r.refresh(); } };
  const ph = String(phone || '').replace(/\D/g, '');
  const msg = encodeURIComponent(`Dear ${name}, ${product} from YUGASTRA is now open to you. Your private access code: ${code}. We have also emailed it to you.`);
  return (
    <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <button className="btn sm" onClick={go} disabled={busy}>{invited ? 'Send a new code' : 'Send access code'}</button>
      {code && <><b style={{ letterSpacing: '.12em', color: 'var(--gold)' }}>{code}</b><a className="btn sm" target="_blank" rel="noreferrer" href={`https://wa.me/${ph}?text=${msg}`}>WhatsApp them</a></>}
    </span>
  );
}
