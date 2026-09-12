import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import HolographicHead from './HolographicHead';

const HolographicHeadView: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef(0);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Cache the box and refresh it on resize instead of measuring inside the
    // pointer handler, which used to force a layout on every mouse event.
    let centerX = 0;
    let halfWidth = 1;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      halfWidth = Math.max(rect.width / 2, 1);
    };
    measure();

    // One update per animation frame, written to a ref so the Canvas host never
    // re-renders while the pointer moves.
    let frame = 0;
    let latestX = centerX;
    const flush = () => {
      frame = 0;
      pointer.current = Math.max(-1, Math.min(1, ((latestX - centerX) / halfWidth) * 0.5));
    };
    const onPointerMove = (e: PointerEvent) => {
      latestX = e.clientX;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      // The size tracks viewport height so a short laptop window cannot be
      // pushed into a scrollbar by a fixed 240px canvas.
      // Both axes are given a definite length. aspect-square alone is not enough:
      // the canvas element's intrinsic 150px height wins over an auto height.
      className={`relative z-10 h-[clamp(96px,18vh,200px)] w-[clamp(96px,18vh,200px)] max-w-full shrink-0
        transition-transform duration-500 ease-out
        ${isHovered ? 'scale-[1.06]' : 'scale-100'}`}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance', premultipliedAlpha: false }}
        dpr={[1, 2]}
        // The container sits inside main's scroll box. Leaving the measure hook's
        // scroll tracking on lets a resize land mid-measure and the canvas keeps
        // its unsized 300x150 default, which renders nothing at all.
        resize={{ scroll: false, debounce: 0 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        {/* Every material here is unlit, so the scene needs no light rig. */}
        <HolographicHead pointer={pointer} isHovered={isHovered} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};

export default HolographicHeadView;
