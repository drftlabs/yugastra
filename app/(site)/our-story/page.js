import { getProduct } from '@/lib/data';
import { opt } from '@/lib/img';
import NameNote from '@/components/NameNote';
import { REALMS, METALS } from '@/lib/brand';
export const metadata = { title: 'The name and the idea' };
export default async function Story() {
  const dn = await getProduct('dhruv-night');
  const img = dn?.images?.[2];
  return <>
    <NameNote />
    <div className="page" style={{ paddingTop: 0 }}><div className="wrap story-grid">
      <div className="prose"><div className="eyebrow">Our story</div><h1 style={{ margin: '12px 0 24px' }}>A piece to keep</h1>
        <p>We are a small design team in India who love the old sky-watchers. Every YUGASTRA dial begins with something they saw: the fixed pole star, the sun in its twelve forms, the twenty-seven stars along the moon's path, the nine wanderers of the sky, and the moon in thirty lunar days.</p>
        <p>We emboss each idea into the dial, set it in Japanese quartz, and fit it to a substantial tonneau case with a soft silicone strap, so that it can be worn every day and kept for years. Nothing on the dial is ornamental. Everything on it means something.</p>
        <p>{METALS}</p>
        <p>The two A's of our wordmark are arrowheads, a quiet nod to the astra. The Y rises like rays. We are not making a watch to be replaced. We are making something that belongs to a greater collection, and to you.</p></div>
      <div className="story-photo">{img ? <img src={opt(img, 1000, 85)} alt="Dhruv Night" loading="lazy" decoding="async" /> : null}</div>
    </div>
    <div className="wrap" style={{ marginTop: 80 }}><div className="sec-head"><div className="eyebrow">The five realms</div><h2>What each one stands for</h2></div>
      <div className="realms">{Object.entries(REALMS).map(([k, r]) => <div className="realm" key={k}><div className="r">{r.realm}</div><h3>{k.toUpperCase()}</h3><div className="c">{r.colour}</div><p>{r.meaning}</p></div>)}</div></div>
    </div>
  </>;
}
