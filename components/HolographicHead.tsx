import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HolographicHeadProps {
  /** Pointer offset in -1..1, read inside the render loop so pointer movement
   *  never triggers a React re-render. */
  pointer: React.MutableRefObject<number>;
  isHovered?: boolean;
  reducedMotion?: boolean;
}

const BRAND = {
  core: 0x00c8f5,   // holo-400
  rim: 0x80ebff,    // holo-200
  edge: 0x38dfff,   // holo-300
  deep: 0x006b8a,   // holo-700
};

/**
 * Rim-lit shell. Alpha is driven almost entirely by the Fresnel term, so the
 * interior stays dark and only the silhouette glows. That is what makes the
 * object read as a hologram rather than a solid ball — the previous version
 * stacked four additive wireframe spheres, which saturated to flat white.
 */
const shellShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vView;
    varying float vHeight;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vView = -mv.xyz;
      vHeight = position.y;
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: `
    uniform vec3 colorCore;
    uniform vec3 colorRim;
    uniform float time;
    uniform float boost;

    varying vec3 vNormal;
    varying vec3 vView;
    varying float vHeight;

    void main() {
      vec3 n = normalize(vNormal);
      vec3 v = normalize(vView);

      // Facing ratio: 0 dead-on, 1 at the silhouette.
      float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.1);

      // Slow horizontal scan bands, the classic projection tell.
      float scan = 0.88 + 0.12 * sin(vHeight * 22.0 - time * 1.4);

      vec3 col = mix(colorCore * 0.45, colorRim, fres) * scan;
      float alpha = (fres * 0.85 + 0.05) * boost;

      gl_FragColor = vec4(col, alpha);
    }
  `,
};

const HolographicHead: React.FC<HolographicHeadProps> = ({ pointer, isHovered = false, reducedMotion = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shellMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const scaleRef = useRef(0.9);

  /**
   * A 20-face icosahedron cage. About 30 unique edges, so every line is
   * individually visible at 150-220 CSS px; a 48x48 sphere wireframe put ~7,000
   * segments in the same space and read as noise.
   */
  const cage = useMemo(() => {
    const geo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.3, 0));
    const mat = new THREE.LineBasicMaterial({
      color: BRAND.edge,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.LineSegments(geo, mat);
  }, []);

  /** Glowing nodes sitting on the cage vertices. */
  const nodes = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.3, 0);
    const mat = new THREE.PointsMaterial({
      color: BRAND.rim,
      size: 0.075,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    return new THREE.Points(geo, mat);
  }, []);

  /** Faceted inner shell carrying the Fresnel rim light. */
  const shell = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.88, 1);
    const mat = new THREE.ShaderMaterial({
      vertexShader: shellShader.vertexShader,
      fragmentShader: shellShader.fragmentShader,
      uniforms: {
        colorCore: { value: new THREE.Color(BRAND.core) },
        colorRim: { value: new THREE.Color(BRAND.rim) },
        time: { value: 0 },
        boost: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      // FrontSide is load-bearing. On a back face the normal points away from
      // the camera, the Fresnel term saturates to 1, and the whole silhouette
      // fills in as a solid disc instead of glowing only at the edge.
      side: THREE.FrontSide,
    });
    shellMatRef.current = mat;
    return new THREE.Mesh(geo, mat);
  }, []);

  /** Faint outline of the shell facets, for structure under the rim glow. */
  const shellEdges = useMemo(() => {
    const geo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.93, 1));
    const mat = new THREE.LineBasicMaterial({
      color: BRAND.deep,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.LineSegments(geo, mat);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (shellMatRef.current) {
      shellMatRef.current.uniforms.time.value = reducedMotion ? 0 : t;
      shellMatRef.current.uniforms.boost.value = isHovered ? 1.35 : 1;
    }

    if (groupRef.current) {
      const target = isHovered ? 1.06 : 0.95;
      scaleRef.current += (target - scaleRef.current) * 0.1;
      groupRef.current.scale.setScalar(scaleRef.current);

      // Follow the pointer, then drift back to a slow idle spin when centred.
      const px = pointer.current;
      const yaw = px * 0.55;
      groupRef.current.rotation.y += (yaw - groupRef.current.rotation.y) * 0.08;
      if (!reducedMotion && Math.abs(px) < 0.08) {
        groupRef.current.rotation.y += 0.0035;
      }
      groupRef.current.rotation.x = reducedMotion ? 0.12 : 0.12 + Math.sin(t * 0.4) * 0.05;
    }

    if (reducedMotion) return;

    // These are plain three.js objects rendered through <primitive>, so they are
    // mutated directly; <primitive> does not forward a React ref.
    cage.rotation.y -= 0.0025;
    cage.rotation.z += 0.0012;
    nodes.rotation.copy(cage.rotation);

    if (ringARef.current) ringARef.current.rotation.z += 0.006;
    if (ringBRef.current) ringBRef.current.rotation.x -= 0.004;
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 2.2) * 0.18);
    }
  });

  useEffect(() => {
    const parts = [cage, nodes, shell, shellEdges];
    return () => {
      parts.forEach((p) => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      });
      shellMatRef.current = null;
    };
  }, [cage, nodes, shell, shellEdges]);

  return (
    <group ref={groupRef} rotation={[0.12, 0, 0]}>
      <primitive object={shell} />
      <primitive object={shellEdges} />
      <primitive object={cage} />
      <primitive object={nodes} />

      {/* Two thin orbital trails on different axes. A torus keeps a readable
          silhouette from every angle; a flat ring vanishes when seen edge-on. */}
      <mesh ref={ringARef} rotation={[Math.PI / 2.1, 0, 0]}>
        <torusGeometry args={[1.62, 0.009, 6, 128]} />
        <meshBasicMaterial
          color={BRAND.edge}
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ringBRef} rotation={[0, Math.PI / 2.6, Math.PI / 3.4]}>
        <torusGeometry args={[1.46, 0.007, 6, 128]} />
        <meshBasicMaterial
          color={BRAND.core}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Small cyan heart. The old build put two white emissive spheres at
          intensity 8 and 10 here, which is what washed the centre out. */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.17, 24, 24]} />
        <meshBasicMaterial
          color={BRAND.rim}
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default HolographicHead;
