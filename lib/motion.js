// Scroll reveal + soft parallax for the glow scenes. Respects reduced-motion.
export function initMotion() {
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calm) return () => {};
  root.classList.add('js');
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  const seen = new WeakSet();
  const scan = () => document.querySelectorAll('[data-rv]').forEach((el) => { if (!seen.has(el)) { seen.add(el); io.observe(el); } });
  scan();
  const mo = new MutationObserver(scan); mo.observe(document.body, { childList: true, subtree: true });
  let raf = 0;
  const tick = () => {
    raf = 0;
    const vh = innerHeight;
    document.querySelectorAll('.orbscene').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const c = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.setProperty('--py', (c * -36).toFixed(1));
    });
  };
  const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
  addEventListener('scroll', on, { passive: true }); addEventListener('resize', on); on();
  // gold progress line
  let bar = document.querySelector('.scroll-line');
  if (!bar) { bar = document.createElement('div'); bar.className = 'scroll-line'; document.body.appendChild(bar); }
  const prog = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; };
  addEventListener('scroll', prog, { passive: true }); prog();
  // light and tilt that follow the cursor
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const onMove = (e) => {
    document.querySelectorAll('.h2-slide.on, .feat-art.orbwrap').forEach((box) => {
      const r = box.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      box.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); box.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      const d = box.querySelector('.h2-dial, .dial'); if (!d) return;
      d.style.setProperty('--ry', ((x - 0.5) * 12).toFixed(2) + 'deg'); d.style.setProperty('--rx', ((0.5 - y) * 10).toFixed(2) + 'deg');
    });
  };
  const onLeave = () => document.querySelectorAll('.h2-dial, .feat-art .dial').forEach((d) => { d.style.setProperty('--rx', '0deg'); d.style.setProperty('--ry', '0deg'); });
  if (fine) { addEventListener('pointermove', onMove, { passive: true }); document.addEventListener('mouseleave', onLeave); }
  return () => { removeEventListener('scroll', prog); removeEventListener('pointermove', onMove); document.removeEventListener('mouseleave', onLeave); io.disconnect(); mo.disconnect(); removeEventListener('scroll', on); removeEventListener('resize', on); };
}
