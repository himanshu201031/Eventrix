/**
 * Infinite marquee — children are duplicated for a seamless CSS loop.
 * `reverse` flips the direction.
 */
export default function Marquee({ children, className = '', reverse = false }) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className="inline-flex w-max animate-marquee"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
