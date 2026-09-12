import React, { useEffect, useRef } from 'react';

/** Served from public/, so it follows Vite's base path (/portfolio/ here). */
const SRC = `${import.meta.env.BASE_URL}hologram-head.svg`;

/**
 * Hologram head as a hand-authored SVG, animated with CSS only.
 *
 * Shown while the three.js head loads, and kept for browsers without WebGL.
 * It fills its parent; HeroHead owns the size and the glow halo.
 */
const HologramHead: React.FC = () => {
  const tiltRef = useRef<HTMLDivElement>(null);

  // Tilt towards the pointer. Written straight to CSS variables once per frame,
  // so pointer movement never re-renders React.
  useEffect(() => {
    const el = tiltRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let px = 0;
    let py = 0;
    const flush = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, (px - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      const ny = Math.max(-1, Math.min(1, (py - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      el.style.setProperty('--holo-ry', `${(nx * 14).toFixed(2)}deg`);
      el.style.setProperty('--holo-rx', `${(-ny * 9).toFixed(2)}deg`);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  // The overlays are masked by the drawing itself, so the scan band and the
  // scanlines light up the linework instead of washing over a square.
  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: `url(${SRC})`,
    maskImage: `url(${SRC})`,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  };

  return (
    <div className="holo-float h-full w-full">
      <div
        ref={tiltRef}
        className="holo-flicker relative h-full w-full transition-transform duration-300 ease-out"
        style={{
          transform: 'perspective(700px) rotateY(var(--holo-ry, 0deg)) rotateX(var(--holo-rx, 0deg))',
          transformStyle: 'preserve-3d',
        }}
      >
        <img src={SRC} alt="" draggable={false} className="h-full w-full select-none" />

        {/* Fine static scanlines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40 bg-[repeating-linear-gradient(0deg,rgba(128,235,255,0.35)_0px,rgba(128,235,255,0.35)_1px,transparent_1px,transparent_4px)]"
          style={maskStyle}
        />

        {/* Travelling scan band */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={maskStyle}>
          <div className="holo-scan absolute inset-x-0 top-0 h-1/4 bg-[linear-gradient(180deg,transparent,rgba(224,250,255,0.85),transparent)]" />
        </div>
      </div>
    </div>
  );
};

export default HologramHead;
