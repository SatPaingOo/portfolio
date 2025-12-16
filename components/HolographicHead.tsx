import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HolographicHeadProps {
  mouseX: number;
  isHovered?: boolean;
}

// Enhanced beautiful shader with gradient colors and advanced effects
const holographicShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform vec3 color2;
    uniform float fresnelPower;
    uniform float fresnelIntensity;
    uniform float time;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDirection = normalize(vViewPosition);
      
      // Enhanced Fresnel effect with multiple layers
      float fresnel = pow(1.0 - dot(normal, viewDirection), fresnelPower);
      fresnel = fresnel * fresnelIntensity;
      
      // Pulsing effect with multiple frequencies
      float pulse1 = sin(time * 2.0) * 0.15 + 1.0;
      float pulse2 = sin(time * 3.5 + 1.0) * 0.1 + 1.0;
      float pulse = (pulse1 + pulse2) * 0.5;
      
      // Color gradient based on position
      float gradient = (vWorldPosition.y + 1.0) * 0.5;
      vec3 gradientColor = mix(color, color2, gradient);
      
      // Additive blending with enhanced glow
      vec3 finalColor = gradientColor * pulse + gradientColor * fresnel * 2.0;
      float alpha = 0.95 + fresnel * 0.05;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
  uniforms: {
    color: { value: new THREE.Color(0x38dfff) },
    color2: { value: new THREE.Color(0x00c8f5) },
    fresnelPower: { value: 3.0 },
    fresnelIntensity: { value: 2.5 },
    time: { value: 0 }
  },
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
};

const HolographicHead: React.FC<HolographicHeadProps> = ({ mouseX, isHovered = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const ring4Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const point1Ref = useRef<THREE.Mesh>(null);
  const point2Ref = useRef<THREE.Mesh>(null);
  const point3Ref = useRef<THREE.Mesh>(null);
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const targetScale = useRef(0.7);

  // Smoothly interpolate to target rotation and scale based on hover
  useFrame((state) => {
    if (groupRef.current) {
      // Smooth scale interpolation on hover
      const hoverScale = isHovered ? 1.0 : 0.7;
      targetScale.current += (hoverScale - targetScale.current) * 0.1;
      groupRef.current.scale.set(
        targetScale.current,
        targetScale.current,
        targetScale.current
      );

      // Map mouseX (-1 to 1) to rotation angle (-0.5 to 0.5 radians)
      const targetY = mouseX * 0.5;
      
      // Smooth interpolation
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.1;
      
      // Subtle automatic rotation when mouse is centered
      if (Math.abs(mouseX) < 0.1) {
        groupRef.current.rotation.y += 0.01;
      }
    }

    // Rotate rings at different speeds - faster on hover
    const ringSpeed = isHovered ? 1.5 : 1.0;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += 0.01 * ringSpeed;
      ring1Ref.current.rotation.x += 0.004 * ringSpeed;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= 0.007 * ringSpeed;
      ring2Ref.current.rotation.y += 0.005 * ringSpeed;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += 0.008 * ringSpeed;
      ring3Ref.current.rotation.y -= 0.003 * ringSpeed;
    }
    if (ring4Ref.current) {
      ring4Ref.current.rotation.y += 0.006 * ringSpeed;
      ring4Ref.current.rotation.z += 0.002 * ringSpeed;
    }

    // Animate glowing points orbiting
    const time = state.clock.elapsedTime;
    if (point1Ref.current) {
      point1Ref.current.position.x = Math.sin(time * 0.8) * 0.6;
      point1Ref.current.position.y = Math.cos(time * 0.8) * 0.6;
      point1Ref.current.position.z = 0.8;
    }
    if (point2Ref.current) {
      point2Ref.current.position.x = Math.sin(time * 1.2 + Math.PI) * 0.5;
      point2Ref.current.position.y = Math.cos(time * 1.2 + Math.PI) * 0.5;
      point2Ref.current.position.z = -0.3;
    }
    if (point3Ref.current) {
      point3Ref.current.position.x = Math.sin(time * 1.0 + Math.PI / 2) * 0.55;
      point3Ref.current.position.y = Math.cos(time * 1.0 + Math.PI / 2) * 0.55;
      point3Ref.current.position.z = 0.4;
    }

    // Animate central core pulsing
    if (coreRef.current) {
      const scale = 1.0 + Math.sin(time * 3.0) * 0.15;
      coreRef.current.scale.set(scale, scale, scale);
    }

    // Animate shader time and fresnel effect - enhanced on hover
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.time.value = time;
      const baseIntensity = isHovered ? 3.5 : 2.5;
      shaderMaterialRef.current.uniforms.fresnelIntensity.value = 
        baseIntensity + Math.sin(time * 1.5) * (isHovered ? 0.7 : 0.5);
    }
  });

  // Create beautiful holographic sphere geometry with higher detail
  const sphereGeometry = useMemo(() => {
    return new THREE.SphereGeometry(1, 48, 48);
  }, []);

  // Main wireframe sphere with enhanced custom shader material
  const wireframeSphere = useMemo(() => {
    const wireframe = new THREE.WireframeGeometry(sphereGeometry);
    const shaderMat = new THREE.ShaderMaterial({
      vertexShader: holographicShader.vertexShader,
      fragmentShader: holographicShader.fragmentShader,
      uniforms: {
        color: { value: new THREE.Color(0x38dfff) },
        color2: { value: new THREE.Color(0x00c8f5) },
        fresnelPower: { value: 3.0 },
        fresnelIntensity: { value: 2.5 },
        time: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    shaderMaterialRef.current = shaderMat;
    return new THREE.LineSegments(wireframe, shaderMat);
  }, [sphereGeometry]);

  // Inner wireframe layer for depth - enhanced
  const innerWireframe = useMemo(() => {
    const innerGeometry = new THREE.SphereGeometry(0.90, 40, 40);
    const wireframe = new THREE.WireframeGeometry(innerGeometry);
    const material = new THREE.LineBasicMaterial({
      color: 0x80ebff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    return new THREE.LineSegments(wireframe, material);
  }, []);

  // Middle wireframe layer
  const middleWireframe = useMemo(() => {
    const middleGeometry = new THREE.SphereGeometry(0.80, 36, 36);
    const wireframe = new THREE.WireframeGeometry(middleGeometry);
    const material = new THREE.LineBasicMaterial({
      color: 0x4dd0e1,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    return new THREE.LineSegments(wireframe, material);
  }, []);

  // Deepest inner layer
  const deepWireframe = useMemo(() => {
    const deepGeometry = new THREE.SphereGeometry(0.70, 32, 32);
    const wireframe = new THREE.WireframeGeometry(deepGeometry);
    const material = new THREE.LineBasicMaterial({
      color: 0x00c8f5,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    return new THREE.LineSegments(wireframe, material);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wireframeSphere.geometry.dispose();
      wireframeSphere.material.dispose();
      innerWireframe.geometry.dispose();
      innerWireframe.material.dispose();
      middleWireframe.geometry.dispose();
      middleWireframe.material.dispose();
      deepWireframe.geometry.dispose();
      deepWireframe.material.dispose();
      sphereGeometry.dispose();
    };
  }, [wireframeSphere, innerWireframe, middleWireframe, deepWireframe, sphereGeometry]);
  
  return (
    <group ref={groupRef}>
      {/* Main wireframe sphere with enhanced custom shader */}
      <primitive object={wireframeSphere} />
      
      {/* Inner wireframe layer for depth */}
      <primitive object={innerWireframe} />
      
      {/* Middle wireframe layer */}
      <primitive object={middleWireframe} />
      
      {/* Deepest inner layer */}
      <primitive object={deepWireframe} />
      
      {/* Outer concentric ring - brightest */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.35, 1.40, 160]} />
        <meshBasicMaterial 
          color={0x38dfff}
          transparent
          opacity={1.0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Second outer ring */}
      <mesh ref={ring2Ref} rotation={[0, 0, Math.PI / 2]}>
        <ringGeometry args={[1.25, 1.30, 160]} />
        <meshBasicMaterial 
          color={0x80ebff}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Middle concentric ring */}
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 4, 0]}>
        <ringGeometry args={[1.18, 1.22, 160]} />
        <meshBasicMaterial 
          color={0x4dd0e1}
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner concentric ring */}
      <mesh ref={ring4Ref} rotation={[Math.PI / 3, 0, Math.PI / 6]}>
        <ringGeometry args={[1.12, 1.15, 160]} />
        <meshBasicMaterial 
          color={0x00c8f5}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Central glowing core with pulsing animation */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial 
          color={0xffffff}
          emissive={0x38dfff}
          emissiveIntensity={8}
        />
      </mesh>
      
      {/* Inner core glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshStandardMaterial 
          color={0xffffff}
          emissive={0xffffff}
          emissiveIntensity={10}
        />
      </mesh>
      
      {/* Orbiting glowing points with animation */}
      <mesh ref={point1Ref} position={[0, 0.6, 0.8]}>
        <sphereGeometry args={[0.10, 24, 24]} />
        <meshStandardMaterial 
          color={0xffffff}
          emissive={0x38dfff}
          emissiveIntensity={6}
        />
      </mesh>
      <mesh ref={point2Ref} position={[-0.5, -0.3, 0.7]}>
        <sphereGeometry args={[0.08, 20, 20]} />
        <meshStandardMaterial 
          color={0xffffff}
          emissive={0x80ebff}
          emissiveIntensity={5}
        />
      </mesh>
      <mesh ref={point3Ref} position={[0.5, -0.3, 0.7]}>
        <sphereGeometry args={[0.08, 20, 20]} />
        <meshStandardMaterial 
          color={0xffffff}
          emissive={0x4dd0e1}
          emissiveIntensity={5}
        />
      </mesh>
      
      {/* Additional small orbiting particles */}
      <mesh position={[0.7, 0.4, 0.5]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial 
          color={0x80ebff}
          emissive={0x80ebff}
          emissiveIntensity={4}
        />
      </mesh>
      <mesh position={[-0.7, 0.4, 0.5]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial 
          color={0x80ebff}
          emissive={0x80ebff}
          emissiveIntensity={4}
        />
      </mesh>
    </group>
  );
};

export default HolographicHead;

