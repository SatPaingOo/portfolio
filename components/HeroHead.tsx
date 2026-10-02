import React, { Suspense, lazy, useMemo } from 'react';
import HologramHead from './HologramHead';

/** three.js is only fetched when this chunk is requested. */
const Head3D = lazy(() => import('./HolographicHeadView'));

/**
 * Bust size, led by the space the hero actually has. Below lg the AURA panel
 * is a bottom sheet and the hero keeps roughly half the window, so the bust
 * stays small enough that the name and both buttons are on screen on arrival.
 * From lg the panel moves to the corner and the full height is available.
 */
const SIZE =
  'h-[clamp(72px,min(20vh,30vw),220px)] w-[clamp(72px,min(20vh,30vw),220px)] ' +
  'lg:h-[clamp(96px,min(50vh,28vw),360px)] lg:w-[clamp(96px,min(50vh,28vw),360px)]';

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

/**
 * The hero's head. Paints the SVG hologram immediately, then swaps in the
 * three.js head once its chunk arrives. Without WebGL the SVG stays.
 */
const HeroHead: React.FC = () => {
  const webgl = useMemo(hasWebGL, []);

  return (
    <div data-testid="hero-head" aria-hidden="true" className={`relative z-10 lg:order-1 ${SIZE} max-w-full shrink-0`}>
      {/* Glow halo shared by both renderings, so the swap does not flash. */}
      <div className="pointer-events-none absolute -inset-[16%] rounded-full bg-[radial-gradient(circle,rgba(0,200,245,0.30)_0%,rgba(0,171,209,0.12)_36%,transparent_68%)] blur-xl motion-safe:animate-pulse-slow" />

      {webgl ? (
        <Suspense fallback={<HologramHead />}>
          <Head3D />
        </Suspense>
      ) : (
        <HologramHead />
      )}
    </div>
  );
};

export default HeroHead;
