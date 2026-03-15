// Wrap .sect-heading text in a clip span for slide-up reveal
function wrapHeadings() {
  document.querySelectorAll('.sect-heading').forEach(h => {
    const span = document.createElement('span');
    span.className = 'sh-inner';
    while (h.firstChild) span.appendChild(h.firstChild);
    h.appendChild(span);
  });
}

// Section reveal: label fades, heading slides up, then content staggered
function revealSection(section, contentSelector, opts = {}) {
  const label   = section.querySelector('.sect-label');
  const heading = section.querySelector('.sect-heading .sh-inner');
  const items   = section.querySelectorAll(contentSelector);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: opts.start || 'top 72%',
      once: true,
    },
  });

  if (label) {
    tl.fromTo(label,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      0
    );
  }

  if (heading) {
    tl.fromTo(heading,
      { yPercent: 80, opacity: 0, filter: 'blur(12px)' },
      { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.85, ease: 'power4.out' },
      label ? 0.08 : 0
    );
  }

  if (items.length) {
    tl.fromTo(items,
      { opacity: 0, y: opts.y ?? 24 },
      {
        opacity: 1, y: 0,
        duration: opts.dur ?? 0.7,
        ease: 'power3.out',
        stagger: opts.stagger ?? 0.08,
      },
      heading ? '-=0.35' : (label ? '-=0.3' : 0)
    );
  }
}

function initStats() {
  const stats = document.querySelector('.about-stats');
  if (!stats) return;

  gsap.fromTo(stats,
    { opacity: 0, y: 20 },
    {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: stats, start: 'top 85%', once: true,
        onEnter() {
          stats.querySelectorAll('.stat-num').forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: target > 100 ? 2 : 1.2,
              ease: 'power2.out',
              onUpdate() { el.textContent = Math.round(obj.val); },
            });
          });
        },
      },
    }
  );
}

export function initWork() {
  wrapHeadings();
  initStats();

  const about    = document.querySelector('.about');
  const work     = document.querySelector('.work');
  const projects = document.querySelector('.projects');
  const skills   = document.querySelector('.skills');
  const awards   = document.querySelector('.awards');

  if (about)    revealSection(about,    '.about-text > p, .about-img', { stagger: 0.12, y: 32 });
  if (work)     revealSection(work,     '.work-item',  { stagger: 0.07 });
  if (projects) revealSection(projects, '.proj-item',  { stagger: 0.09 });
  if (skills)   revealSection(skills,   '.skill-row',  { stagger: 0.06 });
  if (awards)   revealSection(awards,   '.award-row',  { stagger: 0.07 });

  // Contact CTA
  gsap.to('.cta-in', {
    y: '0%',
    duration: 1.1,
    stagger: 0.14,
    ease: 'power4.out',
    scrollTrigger: { trigger: '.contact-cta', start: 'top 78%', once: true },
  });

  gsap.fromTo('.contact-bottom',
    { opacity: 0, y: 20 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-bottom', start: 'top 88%', once: true },
    }
  );
}
