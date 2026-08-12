/**
 * Animated aurora color blobs — decorative soft color layers (flat light mode).
 */
export default function Blobs({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-brand-purple/35 blur-[120px] animate-pulse-glow will-change-transform" />
      <div className="absolute top-1/4 -right-32 h-[460px] w-[460px] rounded-full bg-brand-pink/25 blur-[120px] animate-pulse-glow will-change-transform" style={{ animationDelay: '1.4s' }} />
      <div className="absolute -bottom-32 left-1/4 h-[420px] w-[420px] rounded-full bg-brand-orange/20 blur-[120px] animate-pulse-glow will-change-transform" style={{ animationDelay: '2.4s' }} />
      <div className="absolute bottom-10 right-1/3 h-[300px] w-[300px] rounded-full bg-brand-cyan/15 blur-[100px] animate-pulse-glow will-change-transform" style={{ animationDelay: '3.1s' }} />
    </div>
  );
}
