// ── 3D Particle Sphere ─────────────────────────────────────
// Self-contained. To remove: delete this file + initSphere() call in main.js

const COLORS = ['#ff6b3d','#5b8df7','#3ecf8e','#f7c347','#b56ef7'];
const COUNT  = 200;
const SPRITE_R = 28; // offscreen sprite half-size in px

// Pre-render one glow sprite per color (done once, reused every frame)
function makeSprite(hex) {
  const size = SPRITE_R * 2;
  const oc   = document.createElement('canvas');
  oc.width   = size;
  oc.height  = size;
  const ox   = oc.getContext('2d');
  const grad = ox.createRadialGradient(SPRITE_R, SPRITE_R, 0, SPRITE_R, SPRITE_R, SPRITE_R);
  grad.addColorStop(0,    hex + 'cc');
  grad.addColorStop(0.18, hex + '88');
  grad.addColorStop(0.5,  hex + '22');
  grad.addColorStop(1,    hex + '00');
  ox.beginPath();
  ox.arc(SPRITE_R, SPRITE_R, SPRITE_R, 0, Math.PI * 2);
  ox.fillStyle = grad;
  ox.fill();
  return oc;
}

export function initSphere() {
  const hero = document.querySelector('.hero');
  if (!hero || window.matchMedia('(max-width:768px)').matches) return;

  const sprites = Object.fromEntries(COLORS.map(c => [c, makeSprite(c)]));

  const wrap = document.createElement('div');
  wrap.id    = 'sphere-wrap';
  wrap.style.cssText = [
    'position:absolute','top:0','right:0','bottom:0',
    'width:58%','pointer-events:none','z-index:0','overflow:hidden',
  ].join(';');
  hero.prepend(wrap);

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;width:100%;height:100%;';
  wrap.appendChild(canvas);

  const ctx = canvas.getContext('2d', { alpha: true });
  let W, H, cx, cy, R;

  function resize() {
    W = canvas.width  = wrap.offsetWidth;
    H = canvas.height = wrap.offsetHeight;
    cx = W * 0.52;
    cy = H * 0.50;
    R  = Math.min(W, H) * 0.32;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Fibonacci lattice
  const pts = Array.from({ length: COUNT }, (_, i) => ({
    theta: Math.acos(1 - 2 * (i + 0.5) / COUNT),
    phi:   Math.PI * (1 + Math.sqrt(5)) * i,
    color: COLORS[i % COLORS.length],
    size:  Math.random() * 1.2 + 0.6,
    speed: Math.random() * 0.002 + 0.001,
    phase: Math.random() * Math.PI * 2,
    // pre-compute static sin/cos of base angles
    sinT:  Math.sin(Math.acos(1 - 2 * (i + 0.5) / COUNT)),
    cosT:  Math.cos(Math.acos(1 - 2 * (i + 0.5) / COUNT)),
    sinP:  Math.sin(Math.PI * (1 + Math.sqrt(5)) * i),
    cosP:  Math.cos(Math.PI * (1 + Math.sqrt(5)) * i),
  }));

  // Reusable projected array (avoid allocation every frame)
  const projected = new Array(COUNT);

  let rotX = 0.3, rotY = 0;
  let targX = 0.3, targY = 0;
  let auto  = 0;
  let intro = 0;
  let visible = true;

  const introObj = { v: 0 };
  gsap.to(introObj, {
    v: 1, duration: 2.2, delay: 0.3, ease: 'power3.out',
    onUpdate() { intro = introObj.v; },
  });

  document.addEventListener('mousemove', e => {
    targX = (e.clientY / innerHeight - 0.5) *  1.1;
    targY = (e.clientX / innerWidth  - 0.5) * -0.5;
  }, { passive: true });

  // Pause when hero is off-screen
  const observer = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
  observer.observe(hero);

  let lastT = 0;

  function frame(t) {
    rafId = requestAnimationFrame(frame);
    if (!visible) return;

    // Throttle to ~50fps max (skip frames that arrive too soon)
    if (t - lastT < 18) return;
    lastT = t;

    ctx.clearRect(0, 0, W, H);

    auto += 0.004;
    rotX += (targX - rotX) * 0.03;
    rotY += (targY + auto - rotY) * 0.03;

    // Cache trig for this frame — computed ONCE not per-particle
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    const ri   = R * intro;

    for (let i = 0; i < COUNT; i++) {
      const p = pts[i];
      // Wobble: small perturbation on theta
      const wobble = Math.sin(t * 0.001 * p.speed + p.phase) * 0.04;
      const sinTw  = Math.sin(p.theta + wobble);
      const cosTw  = Math.cos(p.theta + wobble);
      const x = sinTw * p.cosP;
      const y = sinTw * p.sinP;
      const z = cosTw;

      // Rotate Y then X (inline, no object allocation)
      const x1 =  x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y2 =  y * cosX - z1 * sinX;
      const z2 =  y * sinX + z1 * cosX;

      const d01  = (z2 + 1) * 0.5;
      projected[i] = {
        sx: cx + x1 * ri,
        sy: cy + y2 * ri,
        depth: z2,
        d01,
        alpha: d01 * 0.85 + 0.05,
        size: p.size * (d01 * 0.75 + 0.25),
        sprite: sprites[p.color],
      };
    }

    // Sort back-to-front
    projected.sort((a, b) => a.depth - b.depth);

    // Connection lines — batched into single path for perf
    ctx.beginPath();
    const back = projected.filter(p => p.depth < 0.1);
    for (let i = 0; i < back.length; i += 2) {
      const limit = Math.min(i + 6, back.length);
      for (let j = i + 1; j < limit; j++) {
        const dx = back[i].sx - back[j].sx;
        const dy = back[i].sy - back[j].sy;
        const d2 = dx * dx + dy * dy;
        if (d2 < 3025) { // 55² — avoid Math.hypot
          ctx.moveTo(back[i].sx, back[i].sy);
          ctx.lineTo(back[j].sx, back[j].sy);
        }
      }
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth   = 0.4;
    ctx.stroke();

    // Particles — drawImage with pre-rendered sprite (no per-frame gradient)
    for (let i = 0; i < COUNT; i++) {
      const p = projected[i];
      const r = (p.size * intro * SPRITE_R) | 0;
      if (r < 1) continue;
      ctx.globalAlpha = p.alpha;
      ctx.drawImage(p.sprite, (p.sx - r) | 0, (p.sy - r) | 0, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
  }

  let rafId = requestAnimationFrame(frame);

  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate(self) {
      gsap.set(wrap, { opacity: 1 - self.progress * 1.4 });
    },
  });
}
