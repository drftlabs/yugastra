export const CASE_HEX = { Black: '#1a1a1a', Silver: '#c9ccd0', Gold: '#d9b25f', 'Matte black': '#222224', 'Stainless steel': '#c9ccd0' };
export const STRAP_HEX = { Black: '#111111', Blue: '#1f3f7a', Brown: '#5a3a22', Maroon: '#6a1526', Green: '#1f4d3a', White: '#f2f0eb' };

// Dial swatch from text such as "Navy sunray dial, gold hands": dial colour, with the hands colour as a small centre dot.
export const dialSwatch = (txt) => {
  const [d, h = ''] = String(txt).toLowerCase().split(',');
  const dial = /white/.test(d) ? '#f2efe8' : /navy|blue/.test(d) ? '#0e2247' : /green/.test(d) ? '#0f3a2d' : /burgundy|maroon/.test(d) ? '#4a1020' : /graphite/.test(d) ? '#3a3f45' : /teal/.test(d) ? '#0f4a52' : '#0a0a0a';
  const hands = /gold/.test(h) ? '#ddbe78' : /silver/.test(h) ? '#d8dbdf' : '#888';
  return { dial, hands };
};
