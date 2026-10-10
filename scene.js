// Portfolio world: a gallery of the six projects as small sculptures on the sand.
// Each project chapter dollies the camera to its piece.
import { createWorld, THREE, smooth } from "./world.js";

const FLOOR = -1.6;
const C = { kaaval: "#ec5418", kaappu: "#2a3cf2", fairdoor: "#12734a", aquanxt: "#0b7a75", upaid: "#a6c514", virasat: "#a0752a", ink: "#15120e", paper: "#f1ebdf" };

createWorld(document.getElementById("world"), async ({ scene, camera, sun }) => {
  const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.45, ...o });
  const phys = (c, o = {}) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.15, ...o });
  const glass = () => new THREE.MeshPhysicalMaterial({ color: 0xf4f1ea, roughness: 0.05, transparent: true, opacity: 0.3, clearcoat: 1, depthWrite: false, side: THREE.DoubleSide });
  const sh = (m) => { m.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return m; };
  const box = (w, h, d, mat) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  const pieces = [];

  // 1 · Kaaval: a gate
  { const g = new THREE.Group(), ink = std(C.ink), acc = std(C.kaaval, { emissive: C.kaaval, emissiveIntensity: 0.08 });
    const p1 = box(0.16, 3, 0.16, ink); p1.position.set(0, 1.5, -1.3); const p2 = p1.clone(); p2.position.z = 1.3;
    const top = box(0.2, 0.12, 2.8, acc); top.position.y = 3;
    const pane = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.9, 2.5), glass()); pane.position.y = 1.5;
    const base = box(0.6, 0.06, 2.9, ink); base.position.y = 0.03;
    const slabs = [0.45, 0.85, 1.25].map((y, i) => { const s = box(0.04, 0.22, 0.9 - i * 0.15, i === 1 ? std(C.paper) : acc); s.position.set(-0.9 - i * 0.7, y + 0.6, (i - 1) * 0.6); return s; });
    g.add(p1, p2, top, pane, base, ...slabs); g.rotation.y = -0.6; pieces.push({ g: sh(g), key: "kaaval" }); }

  // 2 · Kaappu: the split vault
  { const g = new THREE.Group(), R = 1.1, N = 5, L = (Math.PI * 2) / N, m = phys(C.kaappu), inner = std("#efe7d7", { side: THREE.DoubleSide });
    for (let i = 0; i < N; i++) {
      const w = new THREE.Group(), p0 = i * L, mid = p0 + L / 2;
      w.add(new THREE.Mesh(new THREE.SphereGeometry(R, 56, 36, p0, L), m));
      for (const a of [p0, p0 + L]) { const f = new THREE.Mesh(new THREE.CircleGeometry(R * 0.999, 40, -Math.PI / 2, Math.PI), inner); f.rotation.y = Math.PI + a; w.add(f); }
      w.position.set(-Math.cos(mid) * 0.22, 0, Math.sin(mid) * 0.22); g.add(w);
    }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.012, 8, 160), std(C.ink)); ring.rotation.x = Math.PI / 2 - 0.35; g.add(ring);
    g.position.y = 1.35; pieces.push({ g: sh(g), key: "kaappu", spin: 0.25 }); }

  // 3 · FairDoor: a door and a queue
  { const g = new THREE.Group(), ink = std(C.ink);
    const a = box(0.14, 2.8, 0.14, ink); a.position.set(0, 1.4, -0.75); const b = a.clone(); b.position.z = 0.75;
    const t = box(0.14, 0.14, 1.64, ink); t.position.y = 2.8;
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.7), new THREE.MeshBasicMaterial({ color: C.fairdoor, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false })); glow.rotation.y = Math.PI / 2; glow.position.y = 1.35;
    const sill = box(0.4, 0.03, 1.5, std(C.fairdoor)); sill.position.y = 0.015;
    g.add(a, b, t, glow, sill);
    const dot = new THREE.SphereGeometry(0.07, 12, 8), dm = std(C.ink), hot = std("#e2462c");
    for (let i = 0; i < 26; i++) { const lane = i % 4, k = Math.floor(i / 4); const s = new THREE.Mesh(dot, dm); s.position.set(-0.6 - k * 0.32, 0.07, (lane - 1.5) * 0.28); g.add(s); }
    for (let i = 0; i < 9; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.11), hot); s.position.set(-0.6 - i * 0.24, 0.055, 1.05); g.add(s); }
    g.rotation.y = -0.9; pieces.push({ g: sh(g), key: "fairdoor" }); }

  // 4 · AquaNXT: Home, the countertop filter
  { const g = new THREE.Group(), body = std(C.paper), water = phys("#5fb7ae", { transparent: true, opacity: 0.55, depthWrite: false });
    const pl = box(1.3, 0.65, 1.3, body); pl.position.y = 0.33;
    const t1 = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.95, 1.25), glass()); t1.position.y = 0.65 + 0.48;
    const w1 = box(1.2, 0.55, 1.2, water); w1.position.y = 0.65 + 0.28;
    const band = box(1.28, 0.06, 1.28, body); band.position.y = 1.63;
    const t2 = t1.clone(); t2.position.y = 1.66 + 0.48; const w2 = box(1.2, 0.65, 1.2, water); w2.position.y = 1.66 + 0.33;
    const lid = box(1.3, 0.08, 1.3, body); lid.position.y = 2.65;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 8, 30), std(C.aquanxt, { emissive: C.aquanxt, emissiveIntensity: 0.4 })); ring.position.set(0.45, 0.45, 0.66);
    const scr = box(0.32, 0.16, 0.02, std(C.ink)); scr.position.set(-0.35, 0.47, 0.66);
    g.add(pl, t1, w1, band, t2, w2, lid, ring, scr); g.scale.setScalar(1.15); g.rotation.y = -0.5; pieces.push({ g: sh(g), key: "aquanxt" }); }

  // 5 · UpAid: a stack of verified pages, one marked
  { const g = new THREE.Group();
    for (let i = 0; i < 9; i++) { const p = box(1.5, 0.05, 2.0, std(i % 3 ? C.paper : "#e6dcc8")); p.position.set(Math.sin(i * 1.7) * 0.08, 0.03 + i * 0.07, Math.cos(i * 1.3) * 0.06); p.rotation.y = Math.sin(i) * 0.06; g.add(p); }
    const tab = box(0.3, 0.02, 0.5, std(C.upaid, { emissive: C.upaid, emissiveIntensity: 0.15 })); tab.position.set(0.7, 0.48, -0.5); g.add(tab);
    const lens = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.05, 12, 40), std(C.ink)); lens.position.set(-0.1, 1.3, 0.2); lens.rotation.x = -0.9;
    const handle = box(0.08, 0.6, 0.08, std(C.ink)); handle.position.set(0.25, 0.95, 0.55); handle.rotation.x = -0.9; handle.rotation.z = -0.6;
    g.add(lens, handle); g.position.y = 0; pieces.push({ g: sh(g), key: "upaid" }); }

  // 6 · Virasat: the family record
  { const g = new THREE.Group(), cover = std("#1f3b2c"), brass = std(C.virasat, { metalness: 0.6, roughness: 0.3 });
    const book = box(1.5, 0.32, 2.0, cover); book.position.y = 0.16;
    const pages = box(1.42, 0.26, 1.9, std(C.paper)); pages.position.set(0.05, 0.16, 0);
    const emb = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.03, 36), brass); emb.position.set(0, 0.335, -0.2);
    g.add(book, pages, emb);
    for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 32), brass); c.position.set(1.25, 0.03 + i * 0.065, 0.7); g.add(c); }
    g.rotation.y = 0.4; pieces.push({ g: sh(g), key: "virasat" }); }

  // lay them out along a gentle curve
  const SP = 6.2;
  pieces.forEach((p, i) => { p.x = i * SP; p.z = -Math.sin(i * 0.5) * 1.2; p.g.position.x = p.x; p.g.position.z = p.z; p.g.position.y += FLOOR; p.base = p.g.rotation.y; p.baseY = p.g.position.y; p.s0 = p.g.scale.x; scene.add(p.g); });
  const last = (pieces.length - 1) * SP;

  // camera rig: [camX, camY, camZ, lookX, lookY, lookZ] for each stage
  const focus = (i) => { const p = pieces[i]; return [p.x - 4.3, 0.9, p.z + 11.5, p.x - 4.3, -0.2, p.z]; };
  const K = [
    [-14, 1.6, 9, 6, 0.2, -4],             // 0 hero: the gallery receding on the right
    [last + 14, 1.6, 9, last - 6, 0.2, -4], // 1 why: the same gallery, seen from the other end, on the left
    focus(0), focus(1), focus(2), focus(3), focus(4), focus(5),
    [last / 2, 8.5, 21, last / 2, -1.2, -1], // 8 research: everything from above
    [last / 2, 8.5, 21, last / 2, -1.2, -1],
    [last / 2, 6, 18, last / 2, -1, -1],
    [last / 2, 3.5, 16, last / 2, -0.6, -1],
  ];
  const at = (s) => { const i = Math.max(0, Math.min(K.length - 2, Math.floor(s))), f = smooth(0.12, 0.88, s - i); return K[i].map((v, j) => v + (K[i + 1][j] - v) * f); };
  const look = new THREE.Vector3();

  return (st) => {
    const c = at(st.stage), t = st.t;
    const mob = st.mobile;
    camera.position.set(c[0] + st.px * 0.4 + (mob ? 3.3 : 0), c[1] - st.py * 0.2 + (mob ? 1.2 : 0), c[2] + (mob ? 5 : 0));
    look.set(c[3] + (mob ? 3.3 : 0), c[4] + (mob ? 0.8 : 0), c[5]);
    camera.lookAt(look);
    // keep the shadow-casting sun over whatever the camera is looking at
    sun.target.position.set(look.x, FLOOR, look.z); sun.position.set(look.x - 7, 11, look.z + 6);
    const fi = Math.round(st.stage) - 2;
    pieces.forEach((p, i) => {
      const focused = i === fi ? 1 : 0;
      p.g.rotation.y = p.base + Math.sin(t * 0.25 + i) * 0.12 + (p.spin ? t * p.spin : 0) + focused * st.px * 0.35;
      p.g.position.y = p.baseY + Math.sin(t * 0.9 + i) * 0.03;
      // in the work chapter only the project being read stays on stage
      const inWork = smooth(1.55, 1.95, st.stage) * (1 - smooth(7.6, 8.1, st.stage));
      const near = 1 - smooth(0.42, 0.78, Math.abs(st.stage - 0.5 - (i + 2)));
      p.g.scale.setScalar(Math.max(0.0001, (1 - inWork) + inWork * near) * (p.s0 || 1));
    });
  };
}, { bg: "#e8e1d3", fog: [14, 46] });
