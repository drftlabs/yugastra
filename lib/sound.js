// Optional, off by default. A soft tick on hover and a low chime on a quiz answer, made with the Web Audio API (no files).
let ctx = null, on = false, bound = false, last = null;
export const soundOn = () => on;
export function setSound(v) { on = !!v; try { localStorage.setItem('yg-sound', v ? '1' : '0'); } catch (e) {} }
export function loadSound() { try { on = localStorage.getItem('yg-sound') === '1'; } catch (e) { on = false; } return on; }
export function tick(kind) {
  if (!on) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime, ch = kind === 'chime';
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(ch ? 523 : 2100, t);
    o.frequency.exponentialRampToValueAtTime(ch ? 784 : 1500, t + (ch ? 0.3 : 0.05));
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(ch ? 0.07 : 0.035, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (ch ? 0.7 : 0.07));
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + (ch ? 0.75 : 0.09));
  } catch (e) {}
}
export function bindSound() {
  if (bound || typeof document === 'undefined') return; bound = true;
  if (!matchMedia('(hover: hover)').matches) return;
  document.addEventListener('pointerover', (e) => {
    const el = e.target.closest && e.target.closest('a.btn,.quiz-opts button,.wa-btn,.ccard,.link-arrow,.nav-item>a,.h2-bars button');
    if (el && el !== last) { last = el; tick(); } else if (!el) last = null;
  });
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('.quiz-opts button')) tick('chime'); });
}
