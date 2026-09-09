import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Solar3DContactProps {
  className?: string;
  height?: string | number;
}

export default function Solar3DContact({ className = "", height = "300px" }: Solar3DContactProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const width = mount.clientWidth || 380;
    const heightPx = mount.clientHeight || 300;

    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 100);
    camera.position.set(0, 0.4, 4.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0); // 100% transparent
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    const panelGroup = new THREE.Group();
    panelGroup.rotation.x = 0.35;
    panelGroup.rotation.y = -0.45;
    scene.add(panelGroup);

    // ── High-Fidelity Materials (Same as About Page) ──
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.9,
      roughness: 0.2,
    });

    const cellMat = new THREE.MeshStandardMaterial({
      color: 0x081f3d, // Deep monocrystalline crystal navy
      roughness: 0.1,
      metalness: 0.88,
    });

    const busbarMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.98,
      roughness: 0.08,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.3,
      roughness: 0.04,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    });

    const pW = 1.8;
    const pH = 2.6;
    const thickness = 0.06;

    // Frame
    const frameGeo = new THREE.BoxGeometry(pW, pH, thickness);
    const frame = new THREE.Mesh(frameGeo, frameMat);
    panelGroup.add(frame);

    // 5x8 Monocrystalline Solar Cells
    const cols = 5;
    const rows = 8;
    const margin = 0.018;
    const gridW = pW - 0.08;
    const gridH = pH - 0.08;
    const cW = (gridW - margin * (cols - 1)) / cols;
    const cH = (gridH - margin * (rows - 1)) / rows;
    const cellGeo = new THREE.PlaneGeometry(cW, cH);

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const cell = new THREE.Mesh(cellGeo, cellMat);
        const x = -gridW / 2 + cW / 2 + c * (cW + margin);
        const y = gridH / 2 - cH / 2 - r * (cH + margin);
        cell.position.set(x, y, thickness / 2 + 0.003);
        panelGroup.add(cell);
      }
      const colCenterX = -gridW / 2 + cW / 2 + c * (cW + margin);
      const bb = new THREE.Mesh(new THREE.BoxGeometry(0.005, gridH, 0.001), busbarMat);
      bb.position.set(colCenterX, 0, thickness / 2 + 0.005);
      panelGroup.add(bb);
    }

    // Glass Top
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(pW - 0.04, pH - 0.04), glassMat);
    glass.position.z = thickness / 2 + 0.008;
    panelGroup.add(glass);

    // Energy halo orbital ring
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
    const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.018, 16, 80), orbitMat);
    orbit.rotation.x = Math.PI / 2.2;
    panelGroup.add(orbit);

    // Ambient floating golden photons
    const sparkCount = 24;
    const sparkGeo = new THREE.SphereGeometry(0.028, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 });
    const sparks: { mesh: THREE.Mesh; angle: number; radius: number }[] = [];

    for (let i = 0; i < sparkCount; i++) {
      const sp = new THREE.Mesh(sparkGeo, sparkMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.random() * 1.1;
      sp.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 2.2, Math.sin(angle) * radius);
      panelGroup.add(sp);
      sparks.push({ mesh: sp, angle, radius });
    }

    // ── Lighting ──
    const amb = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(amb);

    const sun = new THREE.DirectionalLight(0xfffbeb, 3.4);
    sun.position.set(4, 5, 4);
    scene.add(sun);

    const blue = new THREE.DirectionalLight(0x0284c7, 1.5);
    blue.position.set(-4, -1, 3);
    scene.add(blue);

    // ── Mouse Follow ──
    let targetY = -0.45;
    let targetX = 0.35;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetY = -0.45 + x * 0.7;
      targetX = 0.35 + y * 0.4;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ── Animation Loop ──
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      panelGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;
      orbit.rotation.z = elapsed * 0.35;

      panelGroup.rotation.y += (targetY - panelGroup.rotation.y) * 0.06;
      panelGroup.rotation.x += (targetX - panelGroup.rotation.x) * 0.06;

      sparks.forEach((sp) => {
        sp.angle += 0.012;
        sp.mesh.position.x = Math.cos(sp.angle) * sp.radius;
        sp.mesh.position.z = Math.sin(sp.angle) * sp.radius;
      });

      renderer.render(scene, camera);
    };

    // Pause rendering when offscreen to preserve Safari/WebKit 60fps smoothness
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(mount);

    const safeAnimate = () => {
      frameId = requestAnimationFrame(safeAnimate);
      if (isVisible) {
        animate();
      }
    };

    safeAnimate();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      frameGeo.dispose();
      frameMat.dispose();
      cellGeo.dispose();
      cellMat.dispose();
      busbarMat.dispose();
      glassMat.dispose();
      orbitMat.dispose();
      sparkGeo.dispose();
      sparkMat.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ height, touchAction: "pan-y" }}
      className={`w-full relative pointer-events-none select-none touch-pan-y ${className}`}
    />
  );
}
