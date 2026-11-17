// Slow, small sparkles that drift upward from the centre, in the collection's colour. Pure CSS, no JS at runtime.
export default function Sparkles({ theme = 'brand', n = 30 }) {
  const dots = Array.from({ length: n }, (_, i) => {
    const r = (k) => { const x = Math.sin((i + 1) * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
    return { x: 50 + (r(1) - 0.5) * 58, s: 2 + r(2) * 3.2, d: 9 + r(3) * 9, l: -r(4) * 18, dx: (r(5) - 0.5) * 70 };
  });
  return (
    <div className={`sparkles t-${theme}`} aria-hidden="true">
      {dots.map((d, i) => <i key={i} style={{ '--x': `${d.x}%`, '--s': `${d.s}px`, '--d': `${d.d}s`, '--l': `${d.l}s`, '--dx': `${d.dx}px` }} />)}
    </div>
  );
}
