export function initPreloader(onDone) {
  const pre  = document.getElementById('pre');
  const num  = document.getElementById('pre-num');
  const line = document.getElementById('pre-line');
  const main = document.getElementById('main');
  const nav  = document.getElementById('nav');

  if (!pre) { onDone?.(); return; }

  // CSS already hides these; reinforce in case of override
  if (main) gsap.set(main, { visibility: 'hidden' });
  if (nav)  gsap.set(nav,  { visibility: 'hidden' });

  const letters = Array.from(pre.querySelectorAll('.pre-l'));
  const last    = pre.querySelector('.pre-last');
  const tag     = pre.querySelector('.pre-tag');
  const foot    = pre.querySelector('.pre-foot');
  const strips  = Array.from(pre.querySelectorAll('.pre-strip'));

  // progress fill
  const fill = document.createElement('div');
  fill.style.cssText = 'position:absolute;top:0;right:0;bottom:0;left:0;transform-origin:left center;transform:scaleX(0);background:linear-gradient(90deg,#ff6b3d,#5b8df7,#3ecf8e);';
  if (line) line.appendChild(fill);

  const obj = { val: 0 };
  const tl  = gsap.timeline();

  // letters slide up from below
  tl.fromTo(letters,
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 }
  )

  // last name + tag fade in
  .fromTo([last, tag],
    { y: 12, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
    '-=0.35'
  )

  // foot bar
  .fromTo(foot,
    { opacity: 0 },
    { opacity: 1, duration: 0.4, ease: 'power2.out' },
    '-=0.4'
  )

  // counter 0 → 100
  .to(obj, {
    val: 100,
    duration: 1.8,
    ease: 'power2.inOut',
    onUpdate() {
      const v = Math.round(obj.val);
      if (num)  num.textContent = String(v).padStart(2, '0');
      if (fill) fill.style.transform = `scaleX(${obj.val / 100})`;
    },
  }, '-=0.2')

  .to({}, { duration: 0.2 })

  // center fades out
  .to(pre.querySelector('.pre-center'),
    { opacity: 0, y: -16, duration: 0.4, ease: 'power2.in' }
  )
  .to(foot, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '<')

  // reveal site
  .call(() => {
    if (main) main.style.visibility = 'visible';
    if (nav)  nav.style.visibility  = 'visible';
    onDone?.();
  })

  // strips sweep up from below
  .fromTo(strips,
    { yPercent: 100 },
    {
      yPercent: -110,
      duration: 0.8,
      ease: 'power3.inOut',
      stagger: { each: 0.06, from: 'random' },
      onComplete() { pre.remove(); },
    }
  );
}
