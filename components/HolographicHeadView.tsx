import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import HolographicHead from './HolographicHead';

const HolographicHeadView: React.FC = () => {
  const [mouseX, setMouseX] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        // Normalize mouse position: -1 (left) to 1 (right)
        const normalizedX = ((e.clientX - centerX) / (rect.width / 2)) * 0.5;
        // Clamp between -1 and 1
        setMouseX(Math.max(-1, Math.min(1, normalizedX)));
      }
    };

    // Track mouse movement
    window.addEventListener('mousemove', handleMouseMove);
    
    // Reset to center when mouse leaves
    const handleMouseLeave = () => {
      setMouseX(0);
      setIsHovered(false);
    };
    
    if (containerRef.current) {
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative cursor-pointer z-10 transition-transform duration-500 ease-out"
      style={{ 
        perspective: '1000px',
        width: '240px',
        height: '240px',
        minWidth: '240px',
        minHeight: '240px',
        background: 'transparent',
        transform: isHovered ? 'scale(1.25)' : 'scale(1)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: "high-performance",
          premultipliedAlpha: false
        }}
        dpr={[1, 2]}
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'transparent'
        }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} color={0x38dfff} intensity={2} />
        <pointLight position={[-5, -5, -5]} color={0x00c8f5} intensity={1.5} />
        <pointLight position={[0, 5, 0]} color={0x80ebff} intensity={1.8} />
        <pointLight position={[0, 0, 5]} color={0x38dfff} intensity={1.5} />
        <HolographicHead mouseX={mouseX} isHovered={isHovered} />
      </Canvas>
    </div>
  );
};

export default HolographicHeadView;

