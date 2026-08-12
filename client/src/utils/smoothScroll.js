import Lenis from 'lenis';

let lenis = null;
let rafId = null;

/**
 * Initialise Lenis smooth scrolling once (idempotent).
 */
export function initSmoothScroll() {
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });

  const raf = (time) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);
  return lenis;
}

export function destroySmoothScroll() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

export function getLenis() {
  return lenis;
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
}

export function stopScroll() {
  lenis?.stop();
}

export function startScroll() {
  lenis?.start();
}
