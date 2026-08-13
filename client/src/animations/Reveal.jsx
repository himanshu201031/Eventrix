import { motion, useReducedMotion } from 'framer-motion';

/**
 * Scroll-reveal wrapper. Fades + slides children in when they enter the viewport.
 * Respects prefers-reduced-motion by rendering the final state directly.
 */
export default function Reveal({ children, delay = 0, y = 36, x = 0, duration = 0.7, once = true, className = '', style }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: '-70px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
