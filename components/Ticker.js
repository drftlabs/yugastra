const HI = /[\u0900-\u097F]/;
export default function Ticker({ text }) {
  const items = String(text || '').split('✦').map((s) => s.trim()).filter(Boolean);
  if (!items.length) return null;
  const row = (k) => (<div className="ticker-row" key={k} aria-hidden={k > 0}>{items.map((t, i) => <span key={i} className={HI.test(t) ? 'hi' : ''}>{t}<i>✦</i></span>)}</div>);
  return <div className="ticker" role="marquee" aria-label={items.join('. ')}><div className="ticker-track">{[0, 1].map(row)}</div></div>;
}
