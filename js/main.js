import { initPreloader } from './preloader.js';
import { initCursor }    from './cursor.js';
import { initScroll }    from './scroll.js';
import { initNav }       from './nav.js';
import { initHero }      from './hero.js';
import { initWork }      from './work.js';
import { initProgress, initScramble, initMagnetic, initAccentPre } from './fx.js';
import { initGlass } from './glass.js';
import { initParallax, initCountUp, initRowGlow } from './parallax.js';
import { initSphere } from './sphere.js';

gsap.registerPlugin(ScrollTrigger);

initCursor();
initScroll();
initNav();
initProgress();
initAccentPre();

initGlass();

initPreloader(() => {
  initHero();
  initWork();
  initScramble();
  initMagnetic();
  initParallax();
  initCountUp();
  initRowGlow();
  initSphere();
});
