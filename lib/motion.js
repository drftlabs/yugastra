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
  // gold progress line
  let bar = document.querySelector('.scroll-line');
  if (!bar) { bar = document.createElement('div'); bar.className = 'scroll-line'; document.body.appendChild(bar); }
  const prog = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; };
  addEventListener('scroll', prog, { passive: true }); prog();
  return () => { removeEventListener('scroll', prog); io.disconnect(); mo.disconnect(); };
}
