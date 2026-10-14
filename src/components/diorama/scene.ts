import {
  AdditiveBlending,
  AmbientLight,
  CanvasTexture,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  Vector3,
  WebGLRenderer,
} from "three";
import { HALF_WIDTH, LAYERS, acacia, ridgePoints, ridgeY } from "./landscape";

export type DioramaHandle = { destroy: () => void };

type Opts = {
  /** 0 → 1 as the hero is scrolled through */
  getProgress: () => number;
  onReady: () => void;
  onFail: () => void;
};

const INK = "#1f150f";

function shapeFrom(pts: [number, number][]) {
  const s = new Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  return s;
}

function paperTexture() {
  const S = 256;
  const el = document.createElement("canvas");
  el.width = el.height = S;
  const g = el.getContext("2d")!;
  const img = g.createImageData(S, S);
  for (let i = 0; i < S * S; i++) {
    const v = 238 + Math.random() * 17;
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v - 2;
    img.data[i * 4 + 2] = v - 6;
    img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  // a few long fibres
  g.globalAlpha = 0.08;
  g.strokeStyle = "#7a5a3a";
  for (let i = 0; i < 70; i++) {
    g.beginPath();
    const x = Math.random() * S;
    const y = Math.random() * S;
    g.moveTo(x, y);
    g.quadraticCurveTo(x + Math.random() * 30 - 15, y + Math.random() * 30 - 15, x + Math.random() * 50 - 25, y + Math.random() * 50 - 25);
    g.stroke();
  }
  const t = new CanvasTexture(el);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(0.4, 0.4);
  return t;
}

/** 70s sun: warm disc with transparent horizontal cuts across its lower half. */
function sunTexture() {
  const S = 512;
  const el = document.createElement("canvas");
  el.width = el.height = S;
  const g = el.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, S);
  grad.addColorStop(0, "#f0c35e");
  grad.addColorStop(0.55, "#e39a3e");
  grad.addColorStop(1, "#c4643a");
  g.fillStyle = grad;
  g.beginPath();
  g.arc(S / 2, S / 2, S / 2 - 2, 0, Math.PI * 2);
  g.fill();
  g.globalCompositeOperation = "destination-out";
  const cuts = [
    [0.56, 0.018],
    [0.64, 0.028],
    [0.72, 0.04],
    [0.8, 0.052],
    [0.88, 0.064],
  ];
  for (const [y, h] of cuts) g.fillRect(0, y * S, S, h * S);
  const t = new CanvasTexture(el);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function glowTexture() {
  const S = 256;
  const el = document.createElement("canvas");
  el.width = el.height = S;
  const g = el.getContext("2d")!;
  const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grad.addColorStop(0, "rgba(255,214,150,0.55)");
  grad.addColorStop(0.4, "rgba(255,190,120,0.18)");
  grad.addColorStop(1, "rgba(255,190,120,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, S, S);
  const t = new CanvasTexture(el);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function cloudPoints(w: number, bumps: { x: number; r: number; y: number }[]): [number, number][] {
  const pts: [number, number][] = [[w / 2, 0]];
  for (let x = w / 2; x >= -w / 2; x -= 0.04) {
    let y = 0;
    for (const b of bumps) {
      const d = x - b.x;
      if (Math.abs(d) < b.r) y = Math.max(y, b.y + Math.sqrt(b.r * b.r - d * d));
    }
    pts.push([x, y]);
  }
  pts.push([-w / 2, 0]);
  return pts;
}

export async function mountDiorama(container: HTMLElement, opts: Opts): Promise<DioramaHandle> {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2));
  renderer.outputColorSpace = SRGBColorSpace;
  const canvasEl = renderer.domElement;
  Object.assign(canvasEl.style, { width: "100%", height: "100%", display: "block" });
  container.appendChild(canvasEl);

  const disposables: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 80);

  const ambient = new AmbientLight(0xfff4e6, 2.3);
  scene.add(ambient);
  const key = new DirectionalLight(0xffe2bc, 1.2);
  key.position.set(-3, 5, 6);
  scene.add(key);

  // Sky: vertical gradient that slides toward dusk as you scroll
  const skyMat = keep(
    new ShaderMaterial({
      uniforms: {
        dusk: { value: 0 },
        topA: { value: new Color("#f2e7d0") },
        horA: { value: new Color("#efbd84") },
        topB: { value: new Color("#4a2f45") },
        horB: { value: new Color("#d76f3e") },
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        uniform float dusk; uniform vec3 topA, horA, topB, horB; varying vec2 vUv;
        void main(){
          vec3 top = mix(topA, topB, dusk);
          vec3 hor = mix(horA, horB, dusk);
          vec3 col = mix(hor, top, smoothstep(0.44, 0.6 - dusk * 0.08, vUv.y));
          float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
          col += (n - 0.5) * 0.03;
          gl_FragColor = vec4(col, 1.0);
        }`,
      depthWrite: false,
    }),
  );
  // ShaderMaterial colours are written as-is; feed sRGB values directly
  for (const k of ["topA", "horA", "topB", "horB"] as const) {
    const c = skyMat.uniforms[k].value as Color;
    c.convertLinearToSRGB();
  }
  const sky = new Mesh(keep(new PlaneGeometry(90, 40)), skyMat);
  sky.position.set(0, 2, -12);
  scene.add(sky);

  // Sun + glow
  const glow = new Mesh(
    keep(new PlaneGeometry(11, 11)),
    keep(new MeshBasicMaterial({ map: keep(glowTexture()), transparent: true, depthWrite: false, blending: AdditiveBlending })),
  );
  glow.position.set(0.6, 0.6, -6.6);
  scene.add(glow);
  const sun = new Mesh(
    keep(new PlaneGeometry(3.8, 3.8)),
    keep(new MeshBasicMaterial({ map: keep(sunTexture()), transparent: true, depthWrite: false })),
  );
  sun.position.set(0.6, 0.6, -6.5);
  scene.add(sun);

  const paper = keep(paperTexture());
  const shadowMats = [0.16, 0.1, 0.06].map((o) =>
    keep(new MeshBasicMaterial({ color: INK, transparent: true, opacity: o, depthWrite: false })),
  );

  const shadowMeshes: Mesh[] = [];

  /** Extruded paper piece + a soft three-step shadow just behind it. */
  const addPaper = (shapes: Shape[], color: string, z: number, parent: Group | Scene = scene) => {
    const group = new Group();
    group.position.z = z;
    const geo = keep(new ExtrudeGeometry(shapes, { depth: 0.07, bevelEnabled: false, curveSegments: 6 }));
    const mesh = new Mesh(geo, keep(new MeshLambertMaterial({ color, map: paper })));
    group.add(mesh);
    const flat = keep(new ShapeGeometry(shapes));
    shadowMats.forEach((m, i) => {
      const sh = new Mesh(flat, m);
      const k = i + 1;
      sh.position.set(0.035 * k, 0.05 * k, -0.02 - 0.01 * k);
      if (i === 2) shadowMeshes.push(sh);
      group.add(sh);
    });
    parent.add(group);
    return group;
  };

  // Clouds
  const clouds: { g: Group; y: number }[] = [];
  const cloudDefs = [
    { x: -4.2, y: 2.3, z: -5.2, s: 1.1 },
    { x: 3.4, y: 2.9, z: -5.6, s: 0.9 },
    { x: 6.8, y: 1.7, z: -3.6, s: 0.7 },
    { x: -8.5, y: 1.5, z: -3.4, s: 0.8 },
  ];
  for (const d of cloudDefs) {
    const pts = cloudPoints(2.6, [
      { x: -0.75, r: 0.38, y: 0 },
      { x: -0.15, r: 0.55, y: 0.05 },
      { x: 0.55, r: 0.42, y: 0 },
    ]);
    const g = addPaper([shapeFrom(pts)], "#f6ecd9", d.z);
    g.position.set(d.x, d.y, d.z);
    g.scale.setScalar(d.s);
    clouds.push({ g, y: d.y });
  }

  // Hills with acacias standing on their ridges
  const hills: { group: Group; z: number }[] = [];
  for (const l of LAYERS) {
    const outline: [number, number][] = [[-HALF_WIDTH, -12], ...ridgePoints(l), [HALF_WIDTH, -12]];
    const shapes = [shapeFrom(outline)];
    for (const t of l.trees ?? []) {
      const { trunk, canopy } = acacia(t.x, ridgeY(l, t.x), t.s);
      shapes.push(shapeFrom(trunk), shapeFrom(canopy));
    }
    hills.push({ group: addPaper(shapes, l.color, l.z), z: l.z });
  }

  // Stars that come out at dusk
  const starPos: number[] = [];
  for (let i = 0; i < 160; i++) starPos.push((Math.random() - 0.5) * 40, 1 + Math.random() * 9, -11);
  const starGeo = keep(new BufferGeometry());
  starGeo.setAttribute("position", new Float32BufferAttribute(starPos, 3));
  const starMat = keep(
    new PointsMaterial({ color: "#fff1d6", size: coarse ? 2.2 : 2.6, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false }),
  );
  scene.add(new Points(starGeo, starMat));

  // A small flock of birds
  const birdMat = keep(new MeshBasicMaterial({ color: "#2e2219" }));
  const birdGeo = keep(
    new ShapeGeometry(
      shapeFrom([
        [-0.2, 0.05],
        [-0.08, 0.02],
        [0, -0.03],
        [0.08, 0.02],
        [0.2, 0.05],
        [0.08, -0.01],
        [0, -0.07],
        [-0.08, -0.01],
      ]),
    ),
  );
  const flock = new Group();
  const birds: Mesh[] = [];
  [
    [0, 0, 0],
    [-0.45, -0.18, 0.1],
    [-0.8, 0.12, -0.2],
    [-1.25, -0.08, 0],
    [0.4, -0.3, 0.2],
  ].forEach(([x, y, z]) => {
    const b = new Mesh(birdGeo, birdMat);
    b.position.set(x, y, z);
    flock.add(b);
    birds.push(b);
  });
  flock.position.set(-9, 1.9, -2.2);
  scene.add(flock);

  // Camera rig: framing depends on aspect so phones still see the whole scene
  const base = { z: 9.5, y: 0.9, ty: 0.35, fov: 35 };
  const target = new Vector3(0, -0.9, 0);
  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    if (aspect < 1) {
      base.fov = 48;
      base.z = Math.min(16, 2.9 / (Math.tan((48 * Math.PI) / 360) * aspect));
      base.y = 1.4;
      base.ty = -0.9;
    } else {
      base.fov = 35;
      base.z = 9.5;
      base.y = 0.9;
      base.ty = 0.35;
    }
    camera.fov = base.fov;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.x = e.clientX / window.innerWidth - 0.5;
    pointer.y = e.clientY / window.innerHeight - 0.5;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  // Quality governor: if frames are slow on this device, lower resolution, then trim shadows
  let dpr = renderer.getPixelRatio();
  let slowTime = 0;
  let watched = 0;
  const govern = (dt: number) => {
    if (watched > 12) return; // settle after ~12s of rendering
    watched += dt;
    slowTime = dt > 0.024 ? slowTime + dt : Math.max(0, slowTime - dt * 0.5);
    if (slowTime > 0.9) {
      slowTime = 0;
      if (dpr > 1) {
        dpr = Math.max(1, dpr - 0.5);
        renderer.setPixelRatio(dpr);
        resize();
      } else if (shadowMeshes[0]?.visible) {
        shadowMeshes.forEach((m) => (m.visible = false));
      } else if (dpr > 0.75) {
        dpr = 0.75;
        renderer.setPixelRatio(dpr);
        resize();
      }
    }
  };

  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  let prev = performance.now();
  let t = 0;
  const frame = () => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    t += dt;
    govern(dt);
    const p = ease(Math.min(1, Math.max(0, opts.getProgress())));

    // gentle drift on touch screens, pointer parallax with a mouse
    const px = coarse ? Math.sin(t * 0.35) * 0.25 : pointer.x;
    const py = coarse ? Math.cos(t * 0.27) * 0.12 : pointer.y;
    pointer.sx += (px - pointer.sx) * Math.min(1, dt * 3);
    pointer.sy += (py - pointer.sy) * Math.min(1, dt * 3);

    // camera drifts forward and up while the paper layers spread apart and the front ones sink away
    camera.position.set(pointer.sx * 1.6, base.y - pointer.sy * 0.7 + p * 0.6, base.z - p * 2.6);
    target.set(pointer.sx * 0.3, base.ty - p * 0.15, 0);
    camera.lookAt(target);
    for (const h of hills) {
      h.group.position.z = h.z * (1 + p * 0.55);
      h.group.position.y = -p * Math.max(0, h.z + 1.2) * 0.75;
    }
    starMat.opacity = Math.max(0, (p - 0.45) / 0.55) * 0.9;

    // the sun sets and the sky turns to dusk
    sun.position.y = glow.position.y = 0.6 - p * 3.6;
    skyMat.uniforms.dusk.value = p;
    ambient.intensity = 2.3 - p * 0.7;
    key.intensity = 1.2 - p * 0.6;

    for (const c of clouds) {
      c.g.position.x += dt * 0.12;
      if (c.g.position.x > 11) c.g.position.x = -11;
      c.g.position.y = c.y - p * 1.4; // clouds sink with the light instead of sliding off the top
    }
    flock.position.x += dt * 0.55;
    flock.position.y = 1.9 + Math.sin(t * 0.6) * 0.15;
    if (flock.position.x > 10) flock.position.x = -10;
    birds.forEach((b, i) => (b.scale.y = 0.35 + 0.65 * Math.abs(Math.sin(t * 7 + i * 1.3))));

    renderer.render(scene, camera);
  };

  let running = false;
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) {
      running = true;
      prev = performance.now();
      renderer.setAnimationLoop(frame);
    } else if (!entry.isIntersecting && running) {
      running = false;
      renderer.setAnimationLoop(null);
    }
  });
  io.observe(container);

  const onLost = (e: Event) => {
    e.preventDefault();
    opts.onFail();
  };
  canvasEl.addEventListener("webglcontextlost", onLost);

  frame();
  opts.onReady();

  return {
    destroy() {
      io.disconnect();
      ro.disconnect();
      renderer.setAnimationLoop(null);
      window.removeEventListener("pointermove", onPointer);
      canvasEl.removeEventListener("webglcontextlost", onLost);
      for (const d of disposables) d.dispose();
      renderer.dispose();
      canvasEl.remove();
    },
  };
}
