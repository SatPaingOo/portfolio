import React, { useMemo, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

interface HolographicHeadProps {
  /** Pointer offset in -1..1, read inside the render loop so pointer movement
   *  never triggers a React re-render. */
  pointer: React.MutableRefObject<number>;
  isHovered?: boolean;
  reducedMotion?: boolean;
}

const RIM = new THREE.Color(0x38dfff); // holo-300
const CORE = new THREE.Color(0x00c8f5); // holo-400
const GLINT = new THREE.Color(0xe0faff); // holo-50
/** The bust shades from cyan at the head to a soft blue at the chest. */
const DEEP = new THREE.Color(0x6aa8ff);

/** Bust extent in head space: crown to the cut across the upper chest. */
const Y_TOP = 0.93;
const Y_BOTTOM = -2.45;
/** The chest dissolves between here and Y_BOTTOM. */
const FADE_TOP = -1.95;

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

const bump = (x: number, y: number, cx: number, cy: number, sx: number, sy: number) =>
  Math.exp(-((x - cx) ** 2) / (2 * sx * sx) - ((y - cy) ** 2) / (2 * sy * sy));

const catmull = (a: number, b: number, c: number, d: number, t: number) =>
  0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (3 * b - a - 3 * c + d) * t * t * t);

/** Catmull-Rom through 2D control points, t in 0..1 across the whole run. */
const spline2 = (pts: [number, number][], t: number): [number, number] => {
  const f = t * (pts.length - 1);
  const seg = Math.min(pts.length - 2, Math.floor(f));
  const u = f - seg;
  const p0 = pts[Math.max(0, seg - 1)];
  const p1 = pts[seg];
  const p2 = pts[seg + 1];
  const p3 = pts[Math.min(pts.length - 1, seg + 2)];
  return [catmull(p0[0], p1[0], p2[0], p3[0], u), catmull(p0[1], p1[1], p2[1], p3[1], u)];
};

/* ------------------------------------------------------------------------- */
/* Head                                                                      */
/* ------------------------------------------------------------------------- */

/** Displacement from the most recent sculpt() call: negative in the visor
 *  channel and grille, positive on the brow plate, nose ridge and chin. */
let lastRelief = 0;

/**
 * Maps a direction on the unit sphere to a point on a sculpted android head.
 *
 * +z is the face and +y is up. The silhouette keeps human proportions, so the
 * android still reads as a head: an ellipsoid with the lower half filled out
 * and the dome squared off, a defined jaw angle, a fuller cranium behind. The
 * front is flattened into one moulded faceplate and carved only where hard
 * surface would be: a channel for the visor, a low nose ridge, cheek plates,
 * grille slots and a chin plate. Seams and lights are drawn as strokes.
 */
function sculpt(dx: number, dy: number, dz: number, out: THREE.Vector3): THREE.Vector3 {
  let hx = dx;
  let hz = dz;
  const r = Math.max(0.05, Math.sqrt(1 - dy * dy));
  if (dy < 0) {
    const widen = Math.pow(r, 0.55) / r;
    const f = 1 + (widen - 1) * smooth(0, -1, dy);
    hx *= f;
    hz *= f;
  } else {
    const widen = Math.pow(r, 0.78) / r;
    const f = 1 + (widen - 1) * smooth(0.15, 1, dy);
    hx *= f;
    hz *= f;
  }

  let x = hx * 0.68;
  const y = dy > 0 ? dy * 0.93 : dy;
  let z = hz * 0.84;

  // Jaw: keep the angle broad, round the chin off, give the angle a clean turn.
  const low = smooth(-0.25, -1, dy);
  x *= 1 - 0.34 * Math.pow(low, 1.6);
  z *= 1 - (dz < 0 ? 0.3 : 0.1) * Math.pow(low, 1.4);
  x *= 1 + 0.07 * bump(Math.abs(dx), dy, 0.62, -0.5, 0.2, 0.13);

  const front = smooth(0.15, 0.7, dz);
  // A flatter front, so the face reads as a single moulded plate.
  z *= 1 - 0.07 * front;
  // Cranium: fuller behind and above.
  if (dz < 0) z *= 1 + 0.12 * smooth(-0.2, 0.7, dy);

  lastRelief = 0;
  if (front > 0) {
    let p = 0;
    p += 0.03 * bump(dx, dy, 0, 0.5, 0.42, 0.14); // brow plate
    p -= 0.075 * bump(dx, dy, 0, 0.1, 0.62, 0.05); // visor channel across the eyes
    const noseSpan = smooth(0.05, 0.0, dy) * (1 - smooth(-0.26, -0.32, dy));
    p += noseSpan * (0.025 + 0.09 * smooth(0.0, -0.26, dy)) * Math.exp(-(dx * dx) / (2 * 0.045 * 0.045)); // nose ridge
    p += 0.04 * (bump(dx, dy, 0.46, -0.22, 0.14, 0.14) + bump(dx, dy, -0.46, -0.22, 0.14, 0.14)); // cheek plates
    for (let k = 0; k < 4; k++) p -= 0.014 * bump(dx, dy, 0, -0.46 - 0.05 * k, 0.12, 0.009); // grille slots
    p += 0.065 * bump(dx, dy, 0, -0.8, 0.2, 0.09); // chin plate

    lastRelief = p * front;
    z += lastRelief;
  }
  return out.set(x, y, z);
}

const _p1 = new THREE.Vector3();
const _p2 = new THREE.Vector3();
const _d = new THREE.Vector3();
const _t1 = new THREE.Vector3();
const _t2 = new THREE.Vector3();
const _up = new THREE.Vector3();

/** Sculpted position and a finite-difference normal; returns the relief. */
function sculptWithNormal(d: THREE.Vector3, pos: THREE.Vector3, nrm: THREE.Vector3): number {
  sculpt(d.x, d.y, d.z, pos);
  const relief = lastRelief;
  if (Math.abs(d.y) < 0.99) _up.set(0, 1, 0);
  else _up.set(1, 0, 0);
  _t1.crossVectors(_up, d).normalize();
  _t2.crossVectors(d, _t1);
  const e = 0.01;
  _d.copy(d).addScaledVector(_t1, e).normalize();
  sculpt(_d.x, _d.y, _d.z, _p1);
  _d.copy(d).addScaledVector(_t2, e).normalize();
  sculpt(_d.x, _d.y, _d.z, _p2);
  nrm.subVectors(_p1, pos).cross(_p2.sub(pos)).normalize();
  if (nrm.dot(pos) < 0) nrm.negate();
  return relief;
}

/** Ear modules: a short puck on each side of the head, turned slightly back. */
const EAR_R = 0.15;
const EAR_DEPTH = 0.09;
const EAR_YAW = 0.2;
const earCenter = (side: number) => new THREE.Vector3(side * 0.64, 0.06, -0.06);

/* ------------------------------------------------------------------------- */
/* Neck, shoulders and chest                                                 */
/* ------------------------------------------------------------------------- */

/**
 * Rows of the body from under the jaw to the cut across the chest:
 * [y, half-width, half-depth, forward offset, squareness].
 *
 * Each row is a superellipse. The neck is a slim round core; from the collar
 * the section squares off into armour, climbing along the trapezius, rounding
 * over the shoulder plates and settling to the width of the upper arms.
 */
type BodyRow = [number, number, number, number, number];
const BODY_ROWS: BodyRow[] = [
  [-0.62, 0.25, 0.23, -0.06, 2.0], // neck core, inside the jaw
  [-0.88, 0.24, 0.22, -0.06, 2.0],
  [-1.07, 0.25, 0.23, -0.05, 2.0],
  [-1.2, 0.36, 0.3, -0.04, 2.4], // collar
  [-1.3, 0.58, 0.35, -0.03, 2.6], // trapezius armour
  [-1.4, 0.94, 0.41, -0.02, 2.8],
  [-1.49, 1.26, 0.46, -0.01, 3.0],
  [-1.6, 1.48, 0.5, 0.0, 3.2], // top of the shoulder plate
  [-1.74, 1.6, 0.52, 0.0, 3.2],
  [-1.92, 1.62, 0.54, 0.01, 3.2],
  [-2.14, 1.56, 0.55, 0.01, 3.0],
  [-2.45, 1.5, 0.56, 0.01, 3.0], // cut
];

const _row = { X: 0, Z: 0, C: 0, n: 2 };

/** Smoothly interpolated body row at height y. Returns a shared object. */
function bodyRow(y: number) {
  const rows = BODY_ROWS;
  let i = 0;
  while (i < rows.length - 2 && y < rows[i + 1][0]) i++;
  const p0 = rows[Math.max(0, i - 1)];
  const p1 = rows[i];
  const p2 = rows[i + 1];
  const p3 = rows[Math.min(rows.length - 1, i + 2)];
  const t = Math.min(1, Math.max(0, (p1[0] - y) / (p1[0] - p2[0])));
  _row.X = catmull(p0[1], p1[1], p2[1], p3[1], t);
  _row.Z = catmull(p0[2], p1[2], p2[2], p3[2], t);
  _row.C = catmull(p0[3], p1[3], p2[3], p3[3], t);
  _row.n = catmull(p0[4], p1[4], p2[4], p3[4], t);
  return _row;
}

/** Height of each raised neck segment; crests sit at -0.7 - k * NECK_PITCH. */
const NECK_PITCH = 0.075;

/** A point on the body. theta 0 is the right side, pi/2 the front. */
function bodyPoint(theta: number, y: number, out: THREE.Vector3): THREE.Vector3 {
  const row = bodyRow(y);
  // Segmented neck: raised rings, like vertebrae, between the jaw and collar.
  const ribMask = smooth(-0.7, -0.76, y) * (1 - smooth(-1.08, -1.14, y));
  const rib = 0.03 * ribMask * Math.pow(0.5 + 0.5 * Math.cos(((y + 0.7) / NECK_PITCH) * Math.PI * 2), 4);
  const X = row.X + rib;
  const Z = row.Z + rib;
  const { C, n } = row;
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const e = 2 / n;
  const x = X * Math.sign(c) * Math.pow(Math.abs(c), e);
  // The chest plate stands a little proud of the back.
  const z = Z * (s > 0 ? 1.06 : 1) * Math.sign(s) * Math.pow(Math.abs(s), e) + C;
  return out.set(x, y, z);
}

const _b1 = new THREE.Vector3();
const _b2 = new THREE.Vector3();

function bodyWithNormal(theta: number, y: number, pos: THREE.Vector3, nrm: THREE.Vector3) {
  bodyPoint(theta, y, pos);
  bodyPoint(theta + 0.004, y, _b1);
  bodyPoint(theta, y - 0.004, _b2);
  nrm.subVectors(_b1, pos).cross(_b2.sub(pos)).normalize();
  const C = bodyRow(y).C;
  if (nrm.x * pos.x + nrm.z * (pos.z - C) < 0) nrm.negate();
}

/* ------------------------------------------------------------------------- */
/* Shaders                                                                   */
/* ------------------------------------------------------------------------- */

/**
 * Lighting shared by the surface and the points. A fixed key light rakes in
 * from the upper left, relative to the camera, so the visor channel and the
 * plate edges fall into shadow; relief darkens recesses and brightens ridges.
 */
const LIGHTING = /* glsl */ `
  float keyLight(vec3 n) {
    vec3 L = normalize(vec3(-0.72, 0.5, 0.42));
    float h = dot(n, L) * 0.5 + 0.5;
    return h * h * h;
  }
  float reliefShade(float relief) {
    return 1.0 + clamp(relief * 8.0, -0.92, 1.0);
  }
`;

const FADE = `smoothstep(${Y_BOTTOM.toFixed(2)}, ${FADE_TOP.toFixed(2)}`;
const GRADIENT = `smoothstep(${Y_BOTTOM.toFixed(2)}, -1.0`;

const surfaceShader = {
  vertexShader: /* glsl */ `
    attribute float aRelief;
    uniform float uGlitchOffset;
    varying vec3 vN;
    varying vec3 vV;
    varying vec3 vP;
    varying float vRelief;
    void main() {
      vec3 p = position;
      // A thin horizontal slice slides sideways during a glitch.
      p.x += step(0.994, fract(position.y * 6.0 + 0.37)) * uGlitchOffset;
      vP = position;
      vRelief = aRelief;
      vN = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      vV = -mv.xyz;
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uRim;
    uniform vec3 uDeep;
    uniform vec3 uCore;
    uniform float uTime;
    uniform float uScanY;
    uniform float uGlitch;
    uniform float uIntensity;
    varying vec3 vN;
    varying vec3 vV;
    varying vec3 vP;
    varying float vRelief;
    ${LIGHTING}
    void main() {
      vec3 n = normalize(vN);
      float facing = clamp(dot(n, normalize(vV)), 0.0, 1.0);
      float fres = pow(1.0 - facing, 2.4);
      float diff = keyLight(n);
      float shade = reliefShade(vRelief);
      // Topographic contour lines, slowly crawling upwards.
      float d = abs(fract(vP.y * 9.0 + uTime * 0.1) - 0.5);
      float line = smoothstep(0.455, 0.5, d);
      float scan = 1.0 - smoothstep(0.0, 0.06, abs(vP.y - uScanY));
      float fade = ${FADE}, vP.y);
      vec3 rim = mix(uDeep, uRim, ${GRADIENT}, vP.y));
      // Contours carry more of the torso, which has few strokes of its own.
      float body = 1.0 + 1.2 * smoothstep(-1.1, -1.65, vP.y);
      vec3 col = rim * ((fres * 1.0 + line * (0.08 + 0.3 * diff) * body + diff * 0.28) * shade + scan * 0.4) + uCore * 0.03;
      float a = ((fres * 0.65 + line * 0.14 * body + diff * 0.1) * shade + scan * 0.2 + 0.015) * fade * uGlitch * uIntensity;
      gl_FragColor = vec4(col, a);
    }
  `,
};

const pointsShader = {
  vertexShader: /* glsl */ `
    attribute vec3 aNormal;
    attribute float aSize;
    attribute float aGlint;
    attribute float aRelief;
    attribute float aFeature;
    attribute float aVisor;
    uniform float uSize;
    uniform float uDpr;
    uniform float uScanY;
    uniform float uGlitchOffset;
    uniform float uVisorX;
    varying float vBright;
    varying float vY;
    varying float vGlint;
    varying float vFeature;
    varying float vVisor;
    ${LIGHTING}
    void main() {
      vec3 p = position;
      p.x += step(0.994, fract(position.y * 6.0 + 0.37)) * uGlitchOffset;
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      vec3 n = normalize(normalMatrix * aNormal);
      float facing = dot(n, normalize(-mv.xyz));
      float rim = pow(1.0 - clamp(facing, 0.0, 1.0), 1.6);
      float diff = keyLight(n);
      float scan = 1.0 - smoothstep(0.0, 0.07, abs(position.y - uScanY));
      // The torso is broad and faces the camera squarely, so it catches little
      // rim light; lift it so the chest reads as volume, not a dark cut-out.
      float lit = (0.08 + diff * 1.25 + rim * 0.45) * reliefShade(aRelief)
        * (1.0 + 0.7 * smoothstep(-1.1, -1.65, position.y));
      // Seams and plate edges are drawn stronger than the cloud. aFeature is a
      // strength, so secondary seams can sit quieter.
      lit = mix(lit, 1.5 + diff * 0.6, aFeature);
      // The visor glows, brightest where a light sweeps slowly across it.
      lit += aVisor * (0.5 + 1.8 * exp(-pow((position.x - uVisorX) / 0.09, 2.0)));
      // Points turned away from the camera fade, so the back of the bust does
      // not clutter the front.
      vBright = (lit + scan * 1.0) * mix(0.06, 1.0, smoothstep(-0.05, 0.3, facing));
      vY = position.y;
      vGlint = aGlint;
      vFeature = aFeature;
      vVisor = aVisor;
      gl_PointSize = uSize * aSize * uDpr / -mv.z;
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uRim;
    uniform vec3 uDeep;
    uniform vec3 uGlintColor;
    uniform float uGlitch;
    uniform float uIntensity;
    varying float vBright;
    varying float vY;
    varying float vGlint;
    varying float vFeature;
    varying float vVisor;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float soft = smoothstep(0.5, 0.05, d);
      float fade = ${FADE}, vY);
      vec3 base = mix(uDeep, uRim, ${GRADIENT}, vY));
      vec3 tint = mix(base, uGlintColor, max(vGlint, max(vFeature * 0.55, vVisor * 0.8)));
      vec3 col = tint * (vBright + vGlint * 2.0);
      // The cloud is kept dim: thousands of additive points otherwise saturate
      // to one flat glow and wash out every shadow the relief casts.
      float strength = mix(0.55, 1.0, max(max(vFeature, vGlint), vVisor));
      gl_FragColor = vec4(col, soft * min(1.0, vBright + vGlint) * fade * uGlitch * uIntensity * strength);
    }
  `,
};

const zeros = (count: number) => new THREE.Float32BufferAttribute(new Float32Array(count), 1);

/* ------------------------------------------------------------------------- */
/* Component                                                                 */
/* ------------------------------------------------------------------------- */

const HolographicHead: React.FC<HolographicHeadProps> = ({ pointer, isHovered = false, reducedMotion = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const glitchUntil = useRef(0);
  const nextGlitch = useRef(3);

  /** Uniform objects shared by reference, so one write drives every material. */
  const shared = useMemo(
    () => ({
      uTime: { value: 0 },
      uScanY: { value: Y_BOTTOM },
      uGlitch: { value: 1 },
      uGlitchOffset: { value: 0 },
      uIntensity: { value: 1 },
      uDpr: { value: 1 },
      uVisorX: { value: 0 },
    }),
    []
  );

  /** Head, ear modules and body as one closed surface in shared bust space. */
  const surfaceGeo = useMemo(() => {
    const head = new THREE.SphereGeometry(1, 144, 108);
    const pos = head.getAttribute('position') as THREE.BufferAttribute;
    const relief = new Float32Array(pos.count);
    const v = new THREE.Vector3();
    const o = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).normalize();
      sculpt(v.x, v.y, v.z, o);
      pos.setXYZ(i, o.x, o.y, o.z);
      relief[i] = lastRelief;
    }
    head.setAttribute('aRelief', new THREE.Float32BufferAttribute(relief, 1));
    // Drop uv so the seam and pole duplicates merge, which gives smooth normals.
    head.deleteAttribute('uv');
    head.deleteAttribute('normal');
    const headMerged = mergeVertices(head);
    headMerged.computeVertexNormals();
    head.dispose();

    // Body: rows down the bust, a ring of superellipse points per row. The
    // ring wraps by index, so there is no seam to split the normals.
    const ROWS = 110;
    const SEGS = 96;
    const bodyPos = new Float32Array(ROWS * SEGS * 3);
    for (let rI = 0; rI < ROWS; rI++) {
      const y = -0.62 + (Y_BOTTOM + 0.62) * (rI / (ROWS - 1));
      for (let s = 0; s < SEGS; s++) {
        bodyPoint((s / SEGS) * Math.PI * 2, y, v);
        bodyPos.set([v.x, v.y, v.z], (rI * SEGS + s) * 3);
      }
    }
    const index: number[] = [];
    for (let rI = 0; rI < ROWS - 1; rI++) {
      for (let s = 0; s < SEGS; s++) {
        const a = rI * SEGS + s;
        const b = rI * SEGS + ((s + 1) % SEGS);
        const c = (rI + 1) * SEGS + s;
        const d = (rI + 1) * SEGS + ((s + 1) % SEGS);
        // Counter-clockwise from outside, so FrontSide draws the outer skin.
        index.push(a, b, c, b, d, c);
      }
    }
    const body = new THREE.BufferGeometry();
    body.setAttribute('position', new THREE.BufferAttribute(bodyPos, 3));
    body.setIndex(index);
    body.computeVertexNormals();
    body.setAttribute('aRelief', zeros(ROWS * SEGS));

    const ears = [1, -1].map((side) => {
      const g = new THREE.CylinderGeometry(EAR_R, EAR_R, EAR_DEPTH, 40, 1, false);
      g.rotateZ(Math.PI / 2); // axis along x, facing out of the side of the head
      g.rotateY(side * EAR_YAW);
      const c = earCenter(side);
      g.translate(c.x, c.y, c.z);
      g.deleteAttribute('uv');
      g.setAttribute('aRelief', zeros(g.getAttribute('position').count));
      return g;
    });

    const merged = mergeGeometries([headMerged, body, ...ears]);
    [headMerged, body, ...ears].forEach((g) => g.dispose());
    return merged;
  }, []);

  /**
   * The depth-only occluder: the same surface pushed inwards along its normals.
   * Scaling it about the origin instead pushed it outwards wherever the surface
   * faces the origin, like the tops of the shoulders below the head, and there
   * it hid the very points and lines it should have sat behind.
   */
  const occluderGeo = useMemo(() => {
    const g = surfaceGeo.clone();
    const p = g.getAttribute('position') as THREE.BufferAttribute;
    const n = g.getAttribute('normal') as THREE.BufferAttribute;
    const INSET = 0.02;
    for (let i = 0; i < p.count; i++) {
      p.setXYZ(i, p.getX(i) - n.getX(i) * INSET, p.getY(i) - n.getY(i) * INSET, p.getZ(i) - n.getZ(i) * INSET);
    }
    return g;
  }, [surfaceGeo]);

  /** Particle cloud, seams and lights over the bust, with per-point normals. */
  const pointsGeo = useMemo(() => {
    const pos: number[] = [];
    const nrm: number[] = [];
    const size: number[] = [];
    const glint: number[] = [];
    const rel: number[] = [];
    const feat: number[] = [];
    const vis: number[] = [];
    const P = new THREE.Vector3();
    const N = new THREE.Vector3();
    const D = new THREE.Vector3();
    const golden = Math.PI * (3 - Math.sqrt(5));
    const push = (p: THREE.Vector3, n: THREE.Vector3, r = 0, s = 1, g = 0, f = 0, v = 0) => {
      pos.push(p.x, p.y, p.z);
      nrm.push(n.x, n.y, n.z);
      rel.push(r);
      size.push(s);
      glint.push(g);
      feat.push(f);
      vis.push(v);
    };
    const fib = (i: number, count: number, target: THREE.Vector3) => {
      const yy = 1 - ((i + 0.5) / count) * 2;
      const rr = Math.sqrt(1 - yy * yy);
      const th = golden * i;
      return target.set(Math.cos(th) * rr, yy, Math.sin(th) * rr);
    };

    // Head: a Fibonacci sphere spreads points evenly, with no clump at the poles.
    const HEAD = 4000;
    for (let i = 0; i < HEAD; i++) {
      fib(i, HEAD, D);
      push(P, N, sculptWithNormal(D, P, N));
    }
    // Extra density on the faceplate.
    const FACE_SOURCE = 7200;
    for (let i = 0; i < FACE_SOURCE; i++) {
      fib(i, FACE_SOURCE, D);
      if (D.z < 0.3) continue;
      push(P, N, sculptWithNormal(D, P, N));
    }

    // Body: rows down the bust, points per row in proportion to its girth, each
    // row turned by the golden fraction so no radial lines show.
    let rowIndex = 0;
    for (let y = -0.66; y > Y_BOTTOM; y -= 0.02, rowIndex++) {
      const { X, Z } = bodyRow(y);
      const girth = 2 * Math.PI * Math.sqrt((X * X + Z * Z) / 2);
      const count = Math.max(12, Math.round(girth / 0.036));
      const phase = (rowIndex * 0.618) % 1;
      for (let k = 0; k < count; k++) {
        bodyWithNormal(((k + phase) / count) * Math.PI * 2, y, P, N);
        push(P, N);
      }
    }

    /*
     * Strokes. Face curves are laid out in sphere-direction space, the space
     * the sculpt uses; curves that wrap the skull use full 3D directions; body
     * curves use (theta, y). Each is projected onto its surface and lifted just
     * off it. Sampled densely, the points read as glowing seams and lights that
     * stay on the bust as it turns.
     */
    const stroke = (curve: (t: number) => [number, number], samples: number, strokeSize = 1.2, strength = 1) => {
      for (let i = 0; i <= samples; i++) {
        const [cx, cy] = curve(i / samples);
        D.set(cx, cy, Math.sqrt(Math.max(0, 1 - cx * cx - cy * cy)));
        sculptWithNormal(D, P, N);
        P.addScaledVector(N, 0.012);
        push(P, N, 0, strokeSize, 0, strength);
      }
    };
    const dirStroke = (curve: (t: number) => [number, number, number], samples: number, strokeSize = 1.2, strength = 1) => {
      for (let i = 0; i <= samples; i++) {
        const [x, y, z] = curve(i / samples);
        D.set(x, y, z).normalize();
        sculptWithNormal(D, P, N);
        P.addScaledVector(N, 0.012);
        push(P, N, 0, strokeSize, 0, strength);
      }
    };
    const visorStroke = (curve: (t: number) => [number, number], samples: number, strokeSize: number, glow = 0) => {
      for (let i = 0; i <= samples; i++) {
        const [cx, cy] = curve(i / samples);
        D.set(cx, cy, Math.sqrt(Math.max(0, 1 - cx * cx - cy * cy)));
        sculptWithNormal(D, P, N);
        P.addScaledVector(N, 0.014);
        push(P, N, 0, strokeSize, glow, 1, 1);
      }
    };
    const bodyStroke = (curve: (t: number) => [number, number], samples: number, strokeSize = 1.2, strength = 1, lift = 0.012) => {
      for (let i = 0; i <= samples; i++) {
        const [theta, y] = curve(i / samples);
        bodyWithNormal(theta, y, P, N);
        P.addScaledVector(N, lift);
        push(P, N, 0, strokeSize, 0, strength);
      }
    };

    // Faceplate seam: temple, down the cheek, round the jaw, to the chin.
    const FACEPLATE: [number, number][] = [
      [0.5, 0.34],
      [0.62, 0.12],
      [0.62, -0.18],
      [0.54, -0.5],
      [0.36, -0.78],
      [0.0, -0.93],
    ];
    for (const side of [1, -1]) {
      stroke((t) => {
        const [x, y] = spline2(FACEPLATE, t);
        return [side * x, y];
      }, 120, 1.3, 0.9);
    }
    // Brow seam joining the tops of the faceplate.
    stroke((t) => [-0.5 + t, 0.34 + 0.08 * Math.sin(Math.PI * t)], 80, 1.3, 0.9);

    // Visor: bright top and bottom edges, three glowing inner lines, and an eye
    // light either side that the sweep passes over.
    visorStroke((t) => {
      const x = -0.58 + 1.16 * t;
      return [x, 0.168 - 0.03 * (x / 0.58) ** 2];
    }, 120, 1.6);
    visorStroke((t) => {
      const x = -0.55 + 1.1 * t;
      return [x, 0.032 - 0.02 * (x / 0.55) ** 2];
    }, 120, 1.6);
    for (const yy of [0.07, 0.1, 0.13]) {
      visorStroke((t) => {
        const x = -0.52 + 1.04 * t;
        return [x, yy - 0.025 * (x / 0.52) ** 2];
      }, 110, 1.1);
    }
    for (const side of [1, -1]) {
      visorStroke((t) => {
        const x = side * (0.2 + 0.2 * t);
        return [x, 0.1 - 0.025 * (x / 0.52) ** 2];
      }, 30, 3.2, 1);
    }

    // Crest over the top of the head, with a quieter line either side.
    for (const off of [0, -0.16, 0.16]) {
      dirStroke((t) => {
        const phi = ((25 + 135 * t) * Math.PI) / 180;
        return [off, Math.sin(phi), Math.cos(phi)];
      }, 100, off === 0 ? 1.3 : 1.0, off === 0 ? 0.9 : 0.6);
    }
    // Side panel seam, from the temple round to the back of the head.
    for (const side of [1, -1]) {
      dirStroke((t) => {
        const a = ((55 - 150 * t) * Math.PI) / 180;
        return [side * Math.cos(a) * 0.925, 0.38, Math.sin(a) * 0.925];
      }, 100, 1.0, 0.65);
    }
    // Cheek vents.
    for (const side of [1, -1]) {
      for (let k = 0; k < 3; k++) {
        stroke((t) => [side * (0.36 + 0.13 * t), -0.2 - 0.06 * k - 0.03 * t], 20, 1.0, 0.75);
      }
    }
    // Grille, narrowing towards the chin.
    for (let k = 0; k < 4; k++) {
      const w = 0.13 - 0.012 * k;
      stroke((t) => [-w + 2 * w * t, -0.46 - 0.05 * k], 36, 1.1, 0.85);
    }
    // Nose ridge, on the side away from the key light, and the chin seam.
    stroke((t) => [0.03, -0.27 * t], 30, 1.0, 0.5);
    stroke((t) => [-0.26 + 0.52 * t, -0.7 - 0.03 * Math.sin(Math.PI * t)], 50, 1.1, 0.7);

    // Ear modules: a cloud over each puck, two light rings, a centre light, and
    // a fin sweeping up and back.
    for (const side of [1, -1]) {
      const rot = new THREE.Matrix4().makeRotationY(side * EAR_YAW);
      const c = earCenter(side);
      const outward = new THREE.Vector3(side, 0, 0).applyMatrix4(rot).normalize();
      const local = (x: number, y: number, z: number) => P.set(x, y, z).applyMatrix4(rot).add(c);

      for (let i = 0; i < 140; i++) {
        const rr = EAR_R * Math.sqrt((i + 0.5) / 140);
        const a = golden * i;
        local((side * EAR_DEPTH) / 2, rr * Math.cos(a), rr * Math.sin(a));
        push(P, outward);
      }
      for (let i = 0; i < 90; i++) {
        const a = golden * i;
        local((((i * 0.618) % 1) - 0.5) * EAR_DEPTH, EAR_R * Math.cos(a), EAR_R * Math.sin(a));
        N.set(0, Math.cos(a), Math.sin(a)).applyMatrix4(rot).normalize();
        push(P, N);
      }
      for (const [ringR, w, s] of [
        [0.125, 1.3, 0.9],
        [0.07, 1.2, 1.0],
      ] as const) {
        for (let i = 0; i <= 60; i++) {
          const a = (i / 60) * Math.PI * 2;
          local(side * (EAR_DEPTH / 2 + 0.008), ringR * Math.cos(a), ringR * Math.sin(a));
          push(P, outward, 0, w, 0, s);
        }
      }
      local(side * (EAR_DEPTH / 2 + 0.01), 0, 0);
      push(P, outward, 0, 3, 1, 1);
      for (const [y0, z0, y1, z1] of [
        [0.13, -0.05, 0.5, -0.34],
        [0.1, -0.1, 0.42, -0.42],
      ] as const) {
        for (let i = 0; i <= 40; i++) {
          const t = i / 40;
          local(side * 0.02, y0 + (y1 - y0) * t, z0 + (z1 - z0) * t);
          push(P, outward, 0, 1.2, 0, 0.8);
        }
      }
    }

    // Neck: a ring on each raised segment, and cables standing off each side.
    const FRONT = Math.PI / 2;
    for (let k = 1; k <= 5; k++) {
      const y = -0.7 - NECK_PITCH * k;
      bodyStroke((t) => [t * Math.PI * 2, y], 90, 1.1, 0.7);
    }
    for (const side of [1, -1]) {
      for (const lean of [0, 0.35]) {
        bodyStroke((t) => [FRONT - side * (1.25 + lean - 0.25 * t), -0.68 - 0.52 * t], 60, 1.3, 0.6, 0.045);
      }
    }
    // Collar ring at the base of the neck.
    bodyStroke((t) => [t * Math.PI * 2, -1.2], 120, 1.4, 0.9);

    // Armour.
    for (const side of [1, -1]) {
      // Shoulder plates: two layered arcs over each shoulder, front to back.
      for (const drop of [0, 0.11]) {
        bodyStroke((t) => [FRONT - side * (0.8 + 1.6 * t), -1.64 - drop + 0.1 * Math.sin(Math.PI * t)], 90, 1.4, drop ? 0.7 : 0.95);
      }
      // Chest plate edge, running down and in towards the centre.
      bodyStroke((t) => [FRONT - side * (0.45 - 0.38 * t), -1.26 - 0.66 * t], 60, 1.2, 0.8);
    }
    // Seam across the chest.
    bodyStroke((t) => [FRONT - 0.75 + 1.5 * t, -1.8 - 0.015 * Math.sin(Math.PI * t)], 80, 1.0, 0.55);
    // Core light at the centre of the chest.
    bodyStroke((t) => {
      const a = t * Math.PI * 2;
      return [FRONT + 0.05 * Math.cos(a), -1.6 + 0.07 * Math.sin(a)];
    }, 40, 1.4, 1, 0.014);
    bodyWithNormal(FRONT, -1.6, P, N);
    P.addScaledVector(N, 0.02);
    push(P, N, 0, 3.4, 1, 1);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('aNormal', new THREE.Float32BufferAttribute(nrm, 3));
    geo.setAttribute('aRelief', new THREE.Float32BufferAttribute(rel, 1));
    geo.setAttribute('aSize', new THREE.Float32BufferAttribute(size, 1));
    geo.setAttribute('aGlint', new THREE.Float32BufferAttribute(glint, 1));
    geo.setAttribute('aFeature', new THREE.Float32BufferAttribute(feat, 1));
    geo.setAttribute('aVisor', new THREE.Float32BufferAttribute(vis, 1));
    return geo;
  }, []);

  const motesGeo = useMemo(() => {
    const COUNT = 80;
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const rr = 1.35 + Math.random() * 0.85;
      arr[i * 3] = Math.cos(a) * rr;
      arr[i * 3 + 1] = Y_BOTTOM + Math.random() * (Y_TOP - Y_BOTTOM + 0.35);
      arr[i * 3 + 2] = Math.sin(a) * rr;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    return geo;
  }, []);

  const materials = useMemo(() => {
    // Depth-only pass over the inset occluder geometry. It hides points and
    // contours behind the bust without drawing colour.
    const occluder = new THREE.MeshBasicMaterial({ colorWrite: false });

    const surface = new THREE.ShaderMaterial({
      vertexShader: surfaceShader.vertexShader,
      fragmentShader: surfaceShader.fragmentShader,
      uniforms: { ...shared, uRim: { value: RIM }, uDeep: { value: DEEP }, uCore: { value: CORE } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });

    const points = new THREE.ShaderMaterial({
      vertexShader: pointsShader.vertexShader,
      fragmentShader: pointsShader.fragmentShader,
      uniforms: {
        ...shared,
        uSize: { value: 8 },
        uRim: { value: RIM },
        uDeep: { value: DEEP },
        uGlintColor: { value: GLINT },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const motes = new THREE.PointsMaterial({
      color: RIM,
      size: 0.022,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return { occluder, surface, points, motes };
  }, [shared]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    shared.uDpr.value = state.gl.getPixelRatio();
    shared.uTime.value = reducedMotion ? 0 : t;
    // A light sweeping slowly back and forth along the visor.
    shared.uVisorX.value = reducedMotion ? 0 : Math.sin(t * 0.8) * 0.3;

    const period = 5.2;
    shared.uScanY.value = reducedMotion
      ? 99
      : Y_BOTTOM + ((t % period) / period) * (Y_TOP - Y_BOTTOM + 0.3);

    // Rare, brief tear. Long random gaps keep it reading as a fault, not a loop.
    let glitch = 1;
    let offset = 0;
    if (!reducedMotion) {
      if (t > nextGlitch.current) {
        glitchUntil.current = t + 0.09;
        nextGlitch.current = t + 3.5 + Math.random() * 5;
      }
      if (t < glitchUntil.current) {
        glitch = 0.7;
        offset = (Math.random() - 0.5) * 0.14;
      }
    }
    shared.uGlitch.value = glitch;
    shared.uGlitchOffset.value = offset;
    shared.uIntensity.value += ((isHovered ? 1.3 : 1) - shared.uIntensity.value) * 0.1;

    const g = groupRef.current;
    if (g) {
      // Rest in three-quarter view, where the head reads best, then sway and
      // follow the pointer around that angle.
      const sway = reducedMotion ? 0 : Math.sin(t * 0.45) * 0.22;
      const target = 0.34 + pointer.current * 0.5 + sway;
      g.rotation.y += (target - g.rotation.y) * 0.05;
      g.rotation.x = -0.02;
      g.position.y = 0.75 + (reducedMotion ? 0 : Math.sin(t * 0.9) * 0.03);
      const s = isHovered ? 1.0 : 0.95;
      g.scale.setScalar(g.scale.x + (s - g.scale.x) * 0.1);
    }

    if (reducedMotion) return;

    if (ringsRef.current) ringsRef.current.rotation.y += 0.004;
    const arr = motesGeo.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < arr.count; i++) {
      let y = arr.getY(i) + 0.0018;
      if (y > Y_TOP + 0.35) y = Y_BOTTOM;
      arr.setY(i, y);
    }
    arr.needsUpdate = true;
  });

  useEffect(
    () => () => {
      surfaceGeo.dispose();
      occluderGeo.dispose();
      pointsGeo.dispose();
      motesGeo.dispose();
      Object.values(materials).forEach((m) => m.dispose());
    },
    [surfaceGeo, occluderGeo, pointsGeo, motesGeo, materials]
  );

  return (
    // The bust spans y 0.93 to -2.45; scaled and lifted so it sits centred with
    // room for the projector rings.
    <group ref={groupRef} position={[0, 0.75, 0]} scale={0.95}>
      <mesh geometry={occluderGeo} material={materials.occluder} />
      <mesh geometry={surfaceGeo} material={materials.surface} />
      <points geometry={pointsGeo} material={materials.points} />
      <points geometry={motesGeo} material={materials.motes} />

      {/* Projector plate the chest dissolves into. */}
      <group ref={ringsRef} position={[0, Y_BOTTOM - 0.05, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.52, 1.56, 96]} />
          <meshBasicMaterial color={RIM} transparent opacity={0.55} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
          <ringGeometry args={[1.74, 1.755, 96]} />
          <meshBasicMaterial color={CORE} transparent opacity={0.28} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
};

export default HolographicHead;
