const ORB_COLORS = [
  'radial-gradient(circle, rgba(255,107,61,0.08) 0%, transparent 65%)',
  'radial-gradient(circle, rgba(91,141,247,0.08) 0%, transparent 65%)',
  'radial-gradient(circle, rgba(62,207,142,0.07) 0%, transparent 65%)',
  'radial-gradient(circle, rgba(181,110,247,0.08) 0%, transparent 65%)',
];

export function initCursor() {
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  const orb  = document.getElementById('orb');

  if (!dot || !ring) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let colorIdx = 0;

  const orbTx = orb ? gsap.quickTo(orb, 'x', { duration: 1.6, ease: 'power2.out' }) : null;
  const orbTy = orb ? gsap.quickTo(orb, 'y', { duration: 1.6, ease: 'power2.out' }) : null;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.06, overwrite: true });
    if (orbTx) { orbTx(mx); orbTy(my); }
  });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    gsap.set(ring, { x: rx, y: ry });
  });

  // Cycle orb color as user moves through sections
  if (orb) {
    ScrollTrigger.create({
      trigger: '#activities', start: 'top center',
      onEnter:  () => { orb.style.background = ORB_COLORS[1]; },
      onLeaveBack: () => { orb.style.background = ORB_COLORS[0]; },
    });
    ScrollTrigger.create({
      trigger: '#skills', start: 'top center',
      onEnter:  () => { orb.style.background = ORB_COLORS[2]; },
      onLeaveBack: () => { orb.style.background = ORB_COLORS[1]; },
    });
    ScrollTrigger.create({
      trigger: '#contact', start: 'top center',
      onEnter:  () => { orb.style.background = ORB_COLORS[3]; },
      onLeaveBack: () => { orb.style.background = ORB_COLORS[2]; },
    });
  }

  document.querySelectorAll('a, button, .work-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
  });
}
