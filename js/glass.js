export function initGlass() {
  // Nav: cursor-reactive specular
  const nav = document.getElementById('nav');
  if (nav) {
    nav.addEventListener('mousemove', e => {
      const r = nav.getBoundingClientRect();
      nav.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    });
    nav.addEventListener('mouseleave', () => nav.style.setProperty('--mx', '50%'));
  }

  // Pills: specular + 3D tilt + scale
  document.querySelectorAll('.glass-pill').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top)  / r.height;
      el.style.setProperty('--mx', (x * 100) + '%');
      el.style.setProperty('--my', (y * 100) + '%');
      gsap.to(el, {
        rotateX: (y - 0.5) * -22,
        rotateY: (x - 0.5) *  22,
        scale: 1.1,
        transformPerspective: 420,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true,
      });
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--mx', '50%');
      el.style.setProperty('--my', '30%');
      gsap.to(el, {
        rotateX: 0, rotateY: 0, scale: 1,
        duration: 1.1,
        ease: 'elastic.out(1.4, 0.3)',
        overwrite: true,
      });
    });
  });

  // Glass cards: cursor specular only
  document.querySelectorAll('.glass-pill-track').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      el.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--mx', '50%');
      el.style.setProperty('--my', '50%');
    });
  });
}
