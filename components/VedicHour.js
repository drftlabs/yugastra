'use client';
import { useEffect, useState } from 'react';
import { useLang, useT } from '@/components/L';
const GLOSS = { 'the hour before dawn': 'भोर से पूर्व की बेला', morning: 'प्रभात', 'the long forenoon': 'दीर्घ पूर्वाह्न', midday: 'मध्य दिवस', afternoon: 'अपराह्न', evening: 'संध्या', 'the deep of night': 'रात्रि का गहन प्रहर' };
// The Vedic day is read in parts. These are approximate, counted from a 6 a.m. sunrise.
const PARTS = [
  [4, 6, 'Brahma Muhurta', 'ब्राह्म मुहूर्त', 'the hour before dawn'],
  [6, 9, 'Pratah', 'प्रातः', 'morning'],
  [9, 12, 'Sangava', 'सङ्गव', 'the long forenoon'],
  [12, 15, 'Madhyahna', 'मध्याह्न', 'midday'],
  [15, 18, 'Aparahna', 'अपराह्ण', 'afternoon'],
  [18, 21, 'Sayahna', 'सायाह्न', 'evening'],
];
const NIGHT = ['Nishitha', 'निशीथ', 'the deep of night'];
export default function VedicHour() {
  const [p, setP] = useState(null); const lang = useLang(); const t = useT();
  useEffect(() => {
    const f = () => { const h = new Date().getHours(); const x = PARTS.find(([a, b]) => h >= a && h < b); setP(x ? x.slice(2) : NIGHT); };
    f(); const t = setInterval(f, 60000); return () => clearInterval(t);
  }, []);
  return (
    <div className="vh" aria-live="off">
      <span className="vh-k">{lang === 'hi' ? 'वैदिक दिवस की बेला' : 'The hour of the Vedic day'}</span>
      <span className="vh-v">{p ? lang === 'hi' ? <><span className="hi">{p[1]}</span> · {GLOSS[p[2]] || p[2]}</> : <>{p[0]} <span className="hi">{p[1]}</span> · {p[2]}</> : <>&nbsp;</>}</span>
    </div>
  );
}
