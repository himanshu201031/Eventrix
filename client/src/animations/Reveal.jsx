import { motion } from 'framer-motion';

/**
 * Scroll-reveal wrapper. Fades + slides children in when they enter the viewport.
 */
export default function Reveal({ children, delay = 0, y = 36, x = 0, duration = 0.7, once = true, className = '', style }) {
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
