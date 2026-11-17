// Night-sky stars on ONE small canvas (cheap: no per-star DOM, no CSS animations, ~30 fps, paused when the tab is hidden).
// Stars twinkle softly, flare with a cross-shaped sparkle on load, sparkle on their own every couple of seconds,
// and flare near wherever you tap or click.
export function initStars(root) {
  if (!root || root.dataset.on) return; root.dataset.on = '1';
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = document.createElement('canvas'); root.appendChild(cv); const ctx = cv.getContext('2d'); if (!ctx) return;
  let W = 0, H = 0, stars = [], flares = [], last = 0, nextAuto = 0;
  const spr = document.createElement('canvas'); spr.width = spr.height = 32; // soft blurred dot, drawn once
  const sx = spr.getContext('2d'), g = sx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(215,228,255,.75)'); g.addColorStop(1, 'rgba(190,210,255,0)');
  sx.fillStyle = g; sx.fillRect(0, 0, 32, 32);
  const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  const make = () => { const n = W < 700 ? 40 : 70; stars = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), r: 1.6 + Math.random() * 2.2, o: 0.35 + Math.random() * 0.55, p: Math.random() * 6.28, s: 0.6 + Math.random() * 1.4 })); };
  const flare = (s) => { if (s) flares.push({ s, t: 0 }); };
  const burst = (k) => { for (let i = 0; i < k; i++) setTimeout(() => flare(stars[(Math.random() * stars.length) | 0]), i * 110); };
  const draw = (ts) => {
    requestAnimationFrame(draw);
    if (document.hidden || ts - last < 33) return; const dt = (ts - last) / 1000; last = ts;
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      const a = reduce ? s.o : s.o * (0.55 + 0.45 * Math.sin(ts / 1000 * s.s + s.p));
      ctx.globalAlpha = a; const d = s.r * 2; ctx.drawImage(spr, s.x * W - s.r, s.y * H - s.r, d, d);
    }
    ctx.globalCompositeOperation = 'lighter';
    for (let i = flares.length - 1; i >= 0; i--) {
      const f = flares[i]; f.t += dt; const k = f.t / 1.3; if (k >= 1) { flares.splice(i, 1); continue; }
      const e = Math.sin(Math.PI * Math.min(1, k * 1.15)), L = 5 + 13 * e, x = f.s.x * W, y = f.s.y * H;
      ctx.globalAlpha = e; ctx.drawImage(spr, x - 7 * e, y - 7 * e, 14 * e, 14 * e);
      ctx.globalAlpha = e * 0.75; ctx.lineWidth = 1; ctx.strokeStyle = '#fff'; ctx.beginPath();
      ctx.moveTo(x - L, y); ctx.lineTo(x + L, y); ctx.moveTo(x, y - L); ctx.lineTo(x, y + L); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    if (!reduce && ts > nextAuto) { burst(1 + ((Math.random() * 2) | 0)); nextAuto = ts + 2600; }
  };
  const start = () => {
    size(); make(); burst(8); requestAnimationFrame(draw);
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); make(); }, 250); }, { passive: true });
    if (!reduce) addEventListener('pointerdown', (e) => {
      const px = e.clientX / W, py = e.clientY / H;
      stars.slice().sort((a, b) => Math.hypot(a.x - px, a.y - py) - Math.hypot(b.x - px, b.y - py)).slice(0, 3).forEach((s, i) => setTimeout(() => flare(s), i * 80));
    }, { passive: true });
  };
  // start after the page is interactive so stars never compete with the watch photos
  (window.requestIdleCallback || ((f) => setTimeout(f, 400)))(start, { timeout: 1500 });
}
