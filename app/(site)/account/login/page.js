'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useT, useLang, pre } from '@/components/L';
import { browserClient } from '@/lib/supabase/client';
export default function Login() {
  const [email, setEmail] = useState(''); const [code, setCode] = useState(''); const [step, setStep] = useState(0); const [e, setE] = useState(''); const r = useRouter(); const t = useT(); const lang = useLang();
  async function send(ev) { ev.preventDefault(); setE(''); const { error } = await browserClient().auth.signInWithOtp({ email, options: { shouldCreateUser: true } }); error ? setE(error.message) : setStep(1); }
  async function verify(ev) { ev.preventDefault(); setE(''); const { error } = await browserClient().auth.verifyOtp({ email, token: code, type: 'email' }); error ? setE(error.message) : (r.push(pre(lang, '/account')), r.refresh()); }
  return <div className="page"><div className="wrap" style={{ maxWidth: 440 }}><h1>{t('Sign in')}</h1><div style={{ height: 22 }} />
    <form className="box" onSubmit={step ? verify : send}>
      <div className="field"><label>{t('Email')}</label><input className="inp" type="email" required value={email} onChange={(x) => setEmail(x.target.value)} disabled={!!step} /></div>
      {step === 1 && <div className="field"><label>{t('Code from your email')}</label><input className="inp" required value={code} onChange={(x) => setCode(x.target.value)} /></div>}
      {e && <div className="err">{e}</div>}<button className="btn btn-gold btn-block">{step ? t('Verify') : t('Email me a code')}</button>
    </form></div></div>;
}
