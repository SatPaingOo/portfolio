import React, { Suspense, lazy, useMemo } from 'react';
import HologramHead from './HologramHead';

/** three.js is only fetched when this chunk is requested. */
const Head3D = lazy(() => import('./HolographicHeadView'));

/**
 * Bust size. Height-led so a tall desktop window gets a large bust while short
 * laptop windows keep the hero free of scrollbars, and capped by width so a
 * phone's wrapped summary still fits. Tuned against measured free space:
 * 1280x620 fits up to 129px (gets 115), 375x812 up to 186px (gets 172),
 * 1440x900 up to 409px (gets 335). Underscores are Tailwind's spaces; CSS math
 * needs them around the minus sign.
 */
const SIZE = 'h-[clamp(96px,min(78.6vh_-_372px,46vw),360px)] w-[clamp(96px,min(78.6vh_-_372px,46vw),360px)]';

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
    <div data-testid="hero-head" aria-hidden="true" className={`relative z-10 ${SIZE} max-w-full shrink-0`}>
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
