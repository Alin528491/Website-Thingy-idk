import { lenis } from './scroll.js';

export function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // Always start at top on (re)load
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  // Smooth scroll for nav links
  nav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      lenis.scrollTo(target, { duration: 1.4, easing: t => 1 - Math.pow(1 - t, 4) });

      // Active state
      nav.querySelectorAll('a').forEach(a => a.removeAttribute('data-active'));
      link.setAttribute('data-active', '1');
    });
  });

  // Hide/show on scroll direction
  let last = 0;
  let hidden = false;

  const show = () => {
    if (!hidden) return;
    hidden = false;
    gsap.to(nav, { yPercent: 0, duration: 0.45, ease: 'power3.out' });
  };

  const hide = () => {
    if (hidden) return;
    hidden = true;
    gsap.to(nav, { yPercent: -110, duration: 0.3, ease: 'power3.in' });
  };

  // Dot nav smooth scroll
  document.querySelectorAll('.dot-nav-item').forEach(dot => {
    dot.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(dot.getAttribute('href'));
      if (target) lenis.scrollTo(target, { duration: 1.4, easing: t => 1 - Math.pow(1 - t, 4) });
    });
  });

  // Update active link based on scroll position
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const links    = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const dots     = Array.from(document.querySelectorAll('.dot-nav-item'));

  window.addEventListener('scroll', () => {
    const cur = window.scrollY;

    // Show/hide nav
    if (cur < 80) { show(); last = cur; return; }
    cur > last + 4 ? hide() : cur < last - 4 ? show() : null;
    last = cur;

    // Active link + dot highlight
    const mid = cur + window.innerHeight * 0.4;
    let active = sections[0];
    sections.forEach(s => { if (s.offsetTop <= mid) active = s; });
    const activeId = `#${active?.id}`;
    links.forEach(a => a.toggleAttribute('data-active', a.getAttribute('href') === activeId));
    dots.forEach(d  => d.toggleAttribute('data-active', d.getAttribute('href') === activeId));
  }, { passive: true });
}
