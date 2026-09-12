import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import HolographicHead from './HolographicHead';

/**
 * The three.js head. Loaded lazily by HeroHead, so three.js stays out of the
 * first page load; it fills its parent and fades in over the SVG placeholder.
 */
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
    // Pointer position across the whole window, relative to the head. One
    // measurement per animation frame, written to a ref so React never
    // re-renders while the pointer moves.
    let frame = 0;
    let latestX = window.innerWidth / 2;
    const flush = () => {
      frame = 0;
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      pointer.current = Math.max(-1, Math.min(1, (latestX - cx) / (window.innerWidth / 2)));
    };
    const onMove = (e: PointerEvent) => {
      latestX = e.clientX;
      if (!frame) frame = requestAnimationFrame(flush);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full animate-[holo-fadein_0.9s_ease-out_both]"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance', premultipliedAlpha: false }}
        dpr={[1, 2]}
        // With reduced motion the head holds still, so render on demand instead
        // of redrawing an unchanged frame sixty times a second.
        frameloop={reducedMotion ? 'demand' : 'always'}
        // The container sits inside main's scroll box. The measure hook's scroll
        // tracking can land mid-resize and leave the canvas at its unsized
        // 300x150 default, which renders nothing.
        resize={{ scroll: false, debounce: 0 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <HolographicHead pointer={pointer} isHovered={isHovered} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};

export default HolographicHeadView;
