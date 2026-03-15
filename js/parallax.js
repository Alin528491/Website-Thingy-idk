import { lenis } from './scroll.js';

export function initParallax() {
  // ── Scroll-velocity skew (Awwwards signature effect) ───────
  const main = document.getElementById('main');
  if (main && lenis) {
    lenis.on('scroll', ({ velocity }) => {
      gsap.to(main, {
        skewY: velocity * 0.04,
        overwrite: 'auto',
        duration: 0.5,
        ease: 'power3.out',
      });
    });
  }
  const glowA = document.querySelector('.hero-glow--a');
  const glowB = document.querySelector('.hero-glow--b');

  // ── Cursor-following hero glow blobs ───────────────────
  if (glowA && glowB) {
    const txA = gsap.quickTo(glowA, 'x', { duration: 1.2, ease: 'power2.out' });
    const tyA = gsap.quickTo(glowA, 'y', { duration: 1.2, ease: 'power2.out' });
    const txB = gsap.quickTo(glowB, 'x', { duration: 1.8, ease: 'power2.out' });
    const tyB = gsap.quickTo(glowB, 'y', { duration: 1.8, ease: 'power2.out' });

    window.addEventListener('mousemove', e => {
      const cx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      txA(cx * 60);  tyA(cy * 40);   // glow A moves more
      txB(-cx * 40); tyB(-cy * 30);  // glow B moves opposite
    });
  }

  // ── Scroll parallax: move the whole title block upward ───
  // Target the container, NOT .line-in (which has the reveal animation)
  gsap.to('.hero-title', {
    y: () => -window.innerHeight * 0.12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  gsap.to('.hero-sub', {
    y: () => -window.innerHeight * 0.06,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  gsap.to('.hero-badge', {
    y: () => -window.innerHeight * 0.04,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

}

// ── Count-up for award years ───────────────────────────────
export function initCountUp() {
  document.querySelectorAll('.aw-year').forEach(el => {
    const target = parseInt(el.textContent, 10);
    if (isNaN(target)) return;

    const obj = { val: target - 3 };
    el.textContent = obj.val;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter() {
        gsap.to(obj, {
          val: target,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.val); },
        });
      },
    });
  });
}

// ── Hover glow on activity + project rows ─────────────────
export function initRowGlow() {
  document.querySelectorAll('.work-item, .proj-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(el, { duration: 0.3, ease: 'power2.out', opacity: 1 });
    });
  });

  // Subtle parallax on about image placeholder
  gsap.to('.img-ph', {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}
