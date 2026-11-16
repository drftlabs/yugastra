// Generated tonneau watch-dial artwork (placeholder until real product photography is uploaded).
const ALIAS = { solar: 'surya', lunar: 'soma', stellar: 'dhruv' };
const FACE = {
  dhruv: ['#16306a', '#0b1a3a', '#060e22'],
  surya: ['#1a1a1a', '#0a0a0a', '#050505'],
  naksh: ['#6a1a2e', '#4a0e1b', '#2a0710'],
  vyom: ['#1d5a45', '#0f3a2d', '#082118'],
  soma: ['#575c64', '#3b3f45', '#25282c'],
};
const CASE_STOPS = { Black: ['#4a4a50', '#121214', '#000000'], Silver: ['#f4f4f4', '#9a9da2', '#3a3c40'], Gold: ['#fff0c0', '#d9b25f', '#6f5019'] };
const STRAP_HEX = { Black: '#16161a', Blue: '#22478f', Brown: '#6a4529', Maroon: '#7a1a30', Green: '#235a44', White: '#efece6' };
const GOLD = '#e8b960', SILVER = '#d8dbdf';
const CX = 100, CY = 126;
const pt = (r, deg) => [CX + r * Math.sin((deg * Math.PI) / 180), CY - r * Math.cos((deg * Math.PI) / 180)];

function Motif({ t, a }) {
  if (t === 'dhruv') {
    const star = [];
    for (let i = 0; i < 16; i++) { const r = i % 2 ? 7 : (i % 4 === 0 ? 30 : 20); const [x, y] = pt(r, i * 22.5); star.push(`${x},${y}`); }
    const dip = [[150, 62], [158, 66], [163, 72], [170, 74], [172, 82], [162, 84], [160, 78]];
    return (<g>
      <circle cx={CX} cy={CY} r="26" fill="none" stroke={a} strokeWidth=".5" opacity=".8" />
      <circle cx={CX} cy={CY} r="38" fill="none" stroke={a} strokeWidth=".5" strokeDasharray="1 2.2" opacity=".8" />
      <polygon points={star.join(' ')} fill={a} />
      <polyline points={dip.map((p) => p.join(',')).join(' ')} fill="none" stroke={a} strokeWidth=".5" opacity=".9" />
      {dip.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="1.1" fill={a} />)}
    </g>);
  }
  if (t === 'surya') {
    return (<g>
      {Array.from({ length: 12 }, (_, i) => { const d = i * 30; const [x1, y1] = pt(20, d), [x2, y2] = pt(38, d), [mx, my] = pt(30, d + (i % 2 ? 7 : 0)); return i % 2 ? <path key={i} d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} stroke={a} strokeWidth="2" fill="none" /> : <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={a} strokeWidth="2.4" strokeLinecap="round" />; })}
      <circle cx={CX} cy={CY} r="15" fill={a} />
      <circle cx={CX} cy={CY} r="42" fill="none" stroke={a} strokeWidth=".5" opacity=".7" />
    </g>);
  }
  if (t === 'naksh') {
    return (<g>
      <circle cx={CX} cy={CY} r="19" fill="none" stroke={a} strokeWidth=".5" opacity=".8" />
      {Array.from({ length: 27 }, (_, i) => { const [x, y] = pt(33, (i * 360) / 27); return <circle key={i} cx={x} cy={y} r="1.9" fill={a} />; })}
      <circle cx={CX} cy={CY} r="3.2" fill={a} />
    </g>);
  }
  if (t === 'vyom') {
    const beads = [[0, 38], [90, 38], [180, 38], [270, 38], [45, 29], [135, 29], [225, 29], [315, 29]];
    return (<g>
      {[15, 29, 38].map((r) => <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke={a} strokeWidth=".5" opacity=".85" />)}
      {beads.map(([d, r], i) => { const [x, y] = pt(r, d); return <circle key={i} cx={x} cy={y} r="2" fill={a} />; })}
      <circle cx={CX} cy={CY} r="9" fill={a} />
      {[-5, -2, 1, 4].map((o) => <line key={o} x1={CX - 8} y1={CY + o} x2={CX + 8} y2={CY + o} stroke="#0f3a2d" strokeWidth=".6" />)}
    </g>);
  }
  return (<g>
    {Array.from({ length: 30 }, (_, i) => { const [x, y] = pt(40, (i * 360) / 30); return i < 15 ? <circle key={i} cx={x} cy={y} r="1.7" fill={a} /> : <circle key={i} cx={x} cy={y} r="1.5" fill="none" stroke={a} strokeWidth=".5" />; })}
    <path d={`M${CX + 6} ${CY - 20} A20 20 0 1 0 ${CX + 6} ${CY + 20} A15 15 0 1 1 ${CX + 6} ${CY - 20} Z`} fill={a} />
    <path d={`M${CX + 22} ${CY - 12} l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2z`} fill={a} />
  </g>);
}

export default function Dial({ theme = 'dhruv', className = 'dial', hands = '10:08', caseColor = 'Silver', strap = '' }) {
  const t = FACE[theme] ? theme : ALIAS[theme] || 'dhruv';
  const [f0, f1, f2] = FACE[t];
  const a = t === 'soma' ? SILVER : GOLD;
  const id = 'd' + t + (strap ? 's' : '');
  const cs = CASE_STOPS[caseColor] || CASE_STOPS.Silver;
  const sh = STRAP_HEX[strap];
  const [h, m] = hands.split(':').map(Number);
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
  const barrel = (ins) => `M${52 + ins} ${12 + ins} H${148 - ins} Q${176 - ins} ${12 + ins} ${184 - ins} ${44 + ins} Q${196 - ins} 126 ${184 - ins} ${208 - ins} Q${176 - ins} ${240 - ins} ${148 - ins} ${240 - ins} H${52 + ins} Q${24 + ins} ${240 - ins} ${16 + ins} ${208 - ins} Q${4 + ins} 126 ${16 + ins} ${44 + ins} Q${24 + ins} ${12 + ins} ${52 + ins} ${12 + ins} Z`;
  return (
    <svg className={className} viewBox={sh ? '-8 -76 216 400' : '-8 -4 216 256'} role="img" aria-label={`${t} dial`}>
      <defs>
        <radialGradient id={id + 'f'} cx="50%" cy="42%" r="70%"><stop offset="0" stopColor={f0} /><stop offset=".6" stopColor={f1} /><stop offset="1" stopColor={f2} /></radialGradient>
        <linearGradient id={id + 'c'} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={cs[0]} /><stop offset=".5" stopColor={cs[1]} /><stop offset="1" stopColor={cs[2]} /></linearGradient>
        {sh && <linearGradient id={id + 's'} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity=".5" /><stop offset=".28" stopColor="#fff" stopOpacity=".14" /><stop offset=".72" stopColor="#000" stopOpacity=".12" /><stop offset="1" stopColor="#000" stopOpacity=".55" /></linearGradient>}
      </defs>
      {sh && (<g>
        <path d="M58 22 L142 22 L136 -66 Q100 -72 64 -66 Z" fill={sh} /><path d="M58 22 L142 22 L136 -66 Q100 -72 64 -66 Z" fill={`url(#${id}s)`} />
        <path d="M62 14 L65 -62 M138 14 L135 -62" stroke="#fff" strokeOpacity=".16" strokeWidth=".8" strokeDasharray="2.4 2.4" fill="none" />
        <path d="M58 230 L142 230 L136 318 Q100 324 64 318 Z" fill={sh} /><path d="M58 230 L142 230 L136 318 Q100 324 64 318 Z" fill={`url(#${id}s)`} />
        <path d="M62 238 L65 314 M138 238 L135 314" stroke="#fff" strokeOpacity=".16" strokeWidth=".8" strokeDasharray="2.4 2.4" fill="none" />
        {[0, 1, 2, 3, 4].map((k) => <circle key={k} cx="100" cy={262 + k * 12} r="2" fill="#000" fillOpacity=".55" />)}
      </g>)}
      <path d={barrel(0)} fill={`url(#${id}c)`} />
      <path d={barrel(7)} fill="#0b0b0b" />
      <path d={barrel(11)} fill={`url(#${id}f)`} />
      {Array.from({ length: 12 }, (_, i) => { const d = i * 30, q = d % 90 === 0; const sx = Math.sin((d * Math.PI) / 180), cy = Math.cos((d * Math.PI) / 180); const x1 = CX + 70 * sx, y1 = CY - 94 * cy, x2 = CX + (q ? 58 : 62) * sx, y2 = CY - (q ? 78 : 82) * cy; return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} stroke={a} strokeWidth={q ? 2.6 : 2} strokeLinecap="round" />; })}
      <Motif t={t} a={a} />
      <text x="100" y="52" textAnchor="middle" fontSize="8" letterSpacing="2.6" fill={a} style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>YUGASTRA</text>
      <text x="100" y="200" textAnchor="middle" fontSize="5.2" letterSpacing="2.2" fill={a} style={{ fontFamily: 'var(--font-outfit), sans-serif' }} opacity=".9">{t.toUpperCase()}</text>
      <g transform={`rotate(${ha} ${CX} ${CY})`}><polygon points={`${CX - 3},${CY} ${CX},${CY - 34} ${CX + 3},${CY}`} fill={a} /></g>
      <g transform={`rotate(${ma} ${CX} ${CY})`}><polygon points={`${CX - 2.4},${CY} ${CX},${CY - 52} ${CX + 2.4},${CY}`} fill={a} /></g>
      <line x1={CX} y1={CY + 8} x2={pt(54, 210)[0]} y2={pt(54, 210)[1]} stroke="#e4372b" strokeWidth=".8" />
      <circle cx={CX} cy={CY} r="3.4" fill={a} /><circle cx={CX} cy={CY} r="1.4" fill="#000" />
    </svg>
  );
}
