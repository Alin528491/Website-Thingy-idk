const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// --- scroll progress bar ---
export function initProgress() {
  const bar = document.getElementById('progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

// --- text scramble on hover ---
export function initScramble() {
  document.querySelectorAll('.wi-name, .pi-name').forEach(el => {
    const orig = el.textContent;
    let frame = 0;
    let raf;

    const run = () => {
      frame++;
      const progress = frame / (orig.length * 1.5);

      el.textContent = orig.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (i < frame * 1.5) return orig[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');

      if (progress < 1) {
        raf = requestAnimationFrame(run);
      } else {
        el.textContent = orig;
      }
    };

    el.addEventListener('mouseenter', () => {
      cancelAnimationFrame(raf);
      frame = 0;
      raf = requestAnimationFrame(run);
    });

    el.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      el.textContent = orig;
    });
  });
}

// --- magnetic button ---
export function initMagnetic() {
  document.querySelectorAll('.contact-cta').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      gsap.to(el, { x: dx, y: dy, duration: 0.5, ease: 'power2.out' });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

// --- preloader accent color ---
export function initAccentPre() {
  const name = document.querySelector('.pre-name');
  if (name) gsap.to(name, { color: 'var(--acc)', duration: 0.4, delay: 0.5 });
}
