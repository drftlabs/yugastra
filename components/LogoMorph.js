'use client';
import { useEffect, useState } from 'react';

// Header mark, in a loop:
//   0  YUG + ASTRA          (2.6s)   the two words, with a gold plus between them
//   1  YUGASTRA             (10s)    the plus folds away and the words join
//   2  युग + अस्त्र           (2.6s)   melts into the Hindi words
//   3  युगास्त्र              (6s)     the plus folds away; the joined Hindi word
// then back to YUG + ASTRA.  Edit the times (ms) here.
const MS = [2600, 10000, 2600, 6000];
export default function LogoMorph() {
  const [ph, setPh] = useState(0);
  useEffect(() => { const id = setTimeout(() => setPh((p) => (p + 1) % 4), MS[ph]); return () => clearTimeout(id); }, [ph]);
  const joined = ph === 1 || ph === 2;
  return (
    <span className={`lm2 ph${ph}`} aria-hidden="true">
      <span className={`lm-en2 ${joined ? 'j' : ''}`}>
        <img className="p1" decoding="async" src="/logo-yug.png" alt="" />
        <i className="plus">+</i>
        <img className="p2" decoding="async" src="/logo-astra.png" alt="" />
      </span>
      <span className="lm-hs"><b>युग</b><i className="plus">+</i><b>अस्त्र</b></span>
      <span className="lm-hj"><b>युगास्त्र</b></span>
    </span>
  );
}
