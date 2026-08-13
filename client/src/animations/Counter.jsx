import { useEffect, useRef } from 'react';
import { useInView, animate, useReducedMotion } from 'framer-motion';

/**
 * Animated counter — counts from `from` to `to` when scrolled into view.
 * `format` receives the current value and must return a string.
 * Respects prefers-reduced-motion by showing the final value immediately.
 */
export default function Counter({ to, from = 0, duration = 2, format = (n) => Math.round(n).toLocaleString('en-IN'), className = '', suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, from, to, duration, format, suffix, reduce]);

  return (
    <span ref={ref} className={className}>
      {format(reduce ? to : from) + suffix}
    </span>
  );
}
