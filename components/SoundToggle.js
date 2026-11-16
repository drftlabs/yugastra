'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/components/L';
import { bindSound, loadSound, setSound, tick } from '@/lib/sound';
export default function SoundToggle() {
  const [on, setOn] = useState(false); const hi = useLang() === 'hi';
  useEffect(() => { setOn(loadSound()); bindSound(); }, []);
  const flip = () => { const v = !on; setOn(v); setSound(v); if (v) tick('chime'); };
  return (
    <button type="button" className="snd" onClick={flip} aria-pressed={on} aria-label={hi ? (on ? 'ध्वनि बंद कीजिए' : 'ध्वनि चालू कीजिए') : (on ? 'Turn sound off' : 'Turn sound on')}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" />{on ? <path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" /> : <path d="M17 9l5 6M22 9l-5 6" />}</svg>
      <span>{hi ? `ध्वनि ${on ? 'चालू' : 'बंद'}` : `Sound ${on ? 'on' : 'off'}`}</span>
    </button>
  );
}
