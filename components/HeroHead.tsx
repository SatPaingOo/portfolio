import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import HologramHead from './HologramHead';

/** three.js is only fetched when this chunk is requested. */
const Head3D = lazy(() => import('./HolographicHeadView'));

/**
 * Bust size, led by the space the hero actually has.
 *
 * Below lg the AURA panel is a bottom sheet and the hero keeps roughly half
 * the window, so the bust stays small enough that the name and both buttons
 * are on screen on arrival.
 *
 * From lg the hero is one centred column and the head takes the height the
 * rest of that column does not need. 33rem is what the rest costs: the
 * padding, the gaps, the name, the strapline, the summary panel and the
 * buttons. A plain `50vh` could not express that — the fixed cost does not
 * shrink with the window, so half of a 620px laptop left the column 182px
 * taller than the window and forced a scrollbar onto a hero that fits. The
 * 300px ceiling keeps the column clear of the collapsed AURA bubble, which
 * sits 16px up from the bottom edge and stands 64px tall.
 */
const SIZE =
  'h-[clamp(72px,min(20vh,30vw),220px)] w-[clamp(72px,min(20vh,30vw),220px)] ' +
  'lg:h-[clamp(96px,min(calc(100dvh_-_33rem),28vw),300px)] ' +
  'lg:w-[clamp(96px,min(calc(100dvh_-_33rem),28vw),300px)]';

/**
 * three.js and @react-three/fiber come to ~890 kB, against an 8 kB SVG that
 * already gives the hero a complete, animated head. So the WebGL upgrade is
 * treated as an enhancement and waits for the page to stop loading: the
 * fonts, the first view and the AURA panel get the network and the main
 * thread first, and nothing heavy sits in front of first paint.
 */
const SETTLE_MS = 1500;

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
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!webgl) return;
    let timer = 0;
    let idle = 0;

    // Counted from `load` rather than from mount, so the wait is measured
    // against the page being done rather than against React getting here
    // first. On a slow connection that is the difference between the upgrade
    // landing after everything else and landing on top of it.
    const schedule = () => {
      timer = window.setTimeout(() => {
        // Then on an idle callback, so the chunk is not parsed in the middle
        // of a frame the hologram is still animating.
        if (window.requestIdleCallback) {
          idle = window.requestIdleCallback(() => setSettled(true), { timeout: 1000 });
        } else {
          setSettled(true);
        }
      }, SETTLE_MS);
    };

    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      window.removeEventListener('load', schedule);
      if (timer) window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, [webgl]);

  return (
    <div data-testid="hero-head" aria-hidden="true" className={`relative z-10 lg:order-1 ${SIZE} max-w-full shrink-0`}>
      {/* Glow halo shared by both renderings, so the swap does not flash. */}
      <div className="pointer-events-none absolute -inset-[16%] rounded-full bg-[radial-gradient(circle,rgba(0,200,245,0.30)_0%,rgba(0,171,209,0.12)_36%,transparent_68%)] blur-xl motion-safe:animate-pulse-slow" />

      {webgl && settled ? (
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
