export function initHero() {
  const tl = gsap.timeline({ delay: 0.05 });

  tl.to('.hero-title .line-in', {
    y: '0%',
    duration: 1.1,
    ease: 'power4.out',
    stagger: 0.12,
  });

  tl.from('.hero-sub', {
    opacity: 0,
    y: 14,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.5');

  tl.from('.hero-scroll', {
    opacity: 0,
    y: 10,
    duration: 0.6,
    ease: 'power3.out',
  }, '-=0.4');
}
