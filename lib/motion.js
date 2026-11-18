// Scroll reveal + soft parallax for the glow scenes. Respects reduced-motion.
export function initMotion() {
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calm) return () => {};
  root.classList.add('js');
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: '0px 0px -20% 0px' });
  const seen = new WeakSet();
  const scan = () => document.querySelectorAll('[data-rv]').forEach((el) => { if (!seen.has(el)) { seen.add(el); io.observe(el); } });
  scan();
  const hio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('hl'); hio.unobserve(e.target); } }), { threshold: 0, rootMargin: '0px 0px -42% 0px' });
  const hseen = new WeakSet();
  const hscan = () => document.querySelectorAll('.mean,.feat,.specs,.pdp-details,.hair,.story-screen').forEach((el) => { if (!hseen.has(el)) { hseen.add(el); hio.observe(el); } });
  hscan();
  const mo = new MutationObserver(() => { scan(); hscan(); }); mo.observe(document.body, { childList: true, subtree: true });
  // gold progress line
  let bar = document.querySelector('.scroll-line');
  if (!bar) { bar = document.createElement('div'); bar.className = 'scroll-line'; document.body.appendChild(bar); }
  const prog = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; };
  addEventListener('scroll', prog, { passive: true }); prog();
  return () => { removeEventListener('scroll', prog); io.disconnect(); hio.disconnect(); mo.disconnect(); };
}
