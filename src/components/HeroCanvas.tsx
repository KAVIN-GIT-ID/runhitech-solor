import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Constants ────────────────────────────────────────────────────────────────
const PARTICLE_COUNT   = 110;
const CONNECTION_DIST  = 1.8;   // world-units threshold to draw a line
const PARTICLE_SPEED   = 0.0025;
const LINE_OPACITY_MAX = 0.18;

// Colour palette — amber/gold solar energy + hint of brand blue
const PARTICLE_COLORS = [
  new THREE.Color("#F59E0B"), // amber-500
  new THREE.Color("#FBBF24"), // amber-400
  new THREE.Color("#FCD34D"), // amber-300
  new THREE.Color("#1D4ED8"), // blue-700
  new THREE.Color("#3B82F6"), // blue-500
];

// ─── HeroCanvas ───────────────────────────────────────────────────────────────
export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene Setup ──
    const scene    = new THREE.Scene();
    const width    = mount.clientWidth;
    const height   = mount.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // transparent
    mount.appendChild(renderer.domElement);

    // ── Particles ──
    interface Particle {
      mesh: THREE.Mesh;
      velocity: THREE.Vector3;
      colorIdx: number;
    }

    const particles: Particle[] = [];
    const aspectRatio = width / height;
    const spreadX = 9 * aspectRatio;
    const spreadY = 7;
    const spreadZ = 2;

    const sphereGeo = new THREE.SphereGeometry(0.045, 8, 8);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const colorIdx  = Math.floor(Math.random() * PARTICLE_COLORS.length);
      const color     = PARTICLE_COLORS[colorIdx];
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.55 + Math.random() * 0.35,
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * spreadX,
        (Math.random() - 0.5) * spreadY,
        (Math.random() - 0.5) * spreadZ,
      );

      // Slow upward drift with slight x/z wobble
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * PARTICLE_SPEED * 0.4,
        PARTICLE_SPEED * (0.5 + Math.random() * 0.6),
        (Math.random() - 0.5) * PARTICLE_SPEED * 0.2,
      );

      scene.add(mesh);
      particles.push({ mesh, velocity, colorIdx });
    }

    // ── Connection Lines (using LineSegments for performance) ──
    // We'll rebuild the geometry each frame; use a BufferGeometry with a
    // generous upper-bound of positions.
    const MAX_LINES      = PARTICLE_COUNT * 4;
    const linePositions  = new Float32Array(MAX_LINES * 2 * 3);
    const lineGeo        = new THREE.BufferGeometry();
    const linePosAttr    = new THREE.BufferAttribute(linePositions, 3);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute("position", linePosAttr);

    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#F59E0B"),
      transparent: true,
      opacity: LINE_OPACITY_MAX,
      vertexColors: false,
    });
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegments);

    // ── Sun Glow ──
    // A large soft glowing disc in the upper-right area
    const glowGeo = new THREE.CircleGeometry(1.2, 64);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FCD34D"),
      transparent: true,
      opacity: 0.07,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.set(3.5, 2.8, -1);
    scene.add(glowMesh);

    // Outer halo
    const haloGeo = new THREE.CircleGeometry(2.2, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FCD34D"),
      transparent: true,
      opacity: 0.03,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.set(3.5, 2.8, -1.1);
    scene.add(haloMesh);

    // ── Resize handler ──
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Mouse parallax ──
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Animation loop ──
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Update particles
      particles.forEach(({ mesh, velocity }) => {
        mesh.position.addScaledVector(velocity, 1);

        // Wrap top → bottom
        if (mesh.position.y >  spreadY / 2 + 0.5) mesh.position.y = -spreadY / 2 - 0.5;
        if (mesh.position.x >  spreadX / 2 + 0.5) mesh.position.x = -spreadX / 2 - 0.5;
        if (mesh.position.x < -spreadX / 2 - 0.5) mesh.position.x =  spreadX / 2 + 0.5;

        // Gentle pulse opacity
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.4 + 0.3 * Math.sin(elapsed * 1.5 + mesh.position.x);
      });

      // Camera gentle parallax drift
      camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.2 - camera.position.y) * 0.04;

      // Rebuild connection lines
      let lineIdx = 0;
      const connDist2 = CONNECTION_DIST * CONNECTION_DIST;

      for (let i = 0; i < particles.length; i++) {
        const pa = particles[i].mesh.position;
        for (let j = i + 1; j < particles.length; j++) {
          if (lineIdx >= MAX_LINES) break;
          const pb = particles[j].mesh.position;
          const dx = pa.x - pb.x;
          const dy = pa.y - pb.y;
          const dz = pa.z - pb.z;
          const dist2 = dx*dx + dy*dy + dz*dz;
          if (dist2 < connDist2) {
            const base = lineIdx * 6;
            linePositions[base]     = pa.x;
            linePositions[base + 1] = pa.y;
            linePositions[base + 2] = pa.z;
            linePositions[base + 3] = pb.x;
            linePositions[base + 4] = pb.y;
            linePositions[base + 5] = pb.z;
            lineIdx++;
          }
        }
      }

      lineGeo.setDrawRange(0, lineIdx * 2);
      linePosAttr.needsUpdate = true;

      // Fade line opacity by proximity density
      lineMat.opacity = lineIdx > 0 ? LINE_OPACITY_MAX : 0;

      // Sun glow slow pulse
      const glowScale = 1 + 0.04 * Math.sin(elapsed * 0.6);
      glowMesh.scale.setScalar(glowScale);
      haloMesh.scale.setScalar(1 + 0.06 * Math.sin(elapsed * 0.4));

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      sphereGeo.dispose();
      lineGeo.dispose();
      glowGeo.dispose();
      haloGeo.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
