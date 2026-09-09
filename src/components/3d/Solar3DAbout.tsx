import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Solar3DAboutProps {
  className?: string;
  height?: string | number;
}

export default function Solar3DAbout({ className = "", height = "380px" }: Solar3DAboutProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const width = mount.clientWidth || 450;
    const heightPx = mount.clientHeight || 380;

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 0.5, 4.4);

    const isMobile = width < 600;
    const isLowEnd =
      isMobile ||
      (typeof navigator !== "undefined" &&
        ((navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
          ((navigator as unknown as { deviceMemory?: number }).deviceMemory &&
            (navigator as unknown as { deviceMemory?: number }).deviceMemory! <= 4)));

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isLowEnd,
      powerPreference: isLowEnd ? "low-power" : "default",
      precision: isLowEnd ? "mediump" : "highp",
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(isLowEnd ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0); // 100% transparent
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    // ── Solar Panel Model ──
    const panelGroup = new THREE.Group();
    panelGroup.rotation.x = 0.35;
    panelGroup.rotation.y = -0.55;
    scene.add(panelGroup);

    const pW = 2.0;
    const pH = 3.0;
    const thickness = 0.07;

    // Metallic Frame
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      metalness: 0.9,
      roughness: 0.2,
    });
    const frameGeo = new THREE.BoxGeometry(pW, pH, thickness);
    const frame = new THREE.Mesh(frameGeo, frameMat);
    panelGroup.add(frame);

    // Monocrystalline Silicon Cells
    const cellMat = new THREE.MeshStandardMaterial({
      color: 0x0a2246,
      roughness: 0.12,
      metalness: 0.85,
    });

    const cols = 5;
    const rows = 8;
    const margin = 0.02;
    const gridW = pW - 0.08;
    const gridH = pH - 0.08;
    const cW = (gridW - margin * (cols - 1)) / cols;
    const cH = (gridH - margin * (rows - 1)) / rows;
    const cellGeo = new THREE.PlaneGeometry(cW, cH);

    const busbarMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.98,
      roughness: 0.08,
    });

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const cell = new THREE.Mesh(cellGeo, cellMat);
        const x = -gridW / 2 + cW / 2 + c * (cW + margin);
        const y = gridH / 2 - cH / 2 - r * (cH + margin);
        cell.position.set(x, y, thickness / 2 + 0.003);
        panelGroup.add(cell);
      }

      // Silver Busbar lines
      const colCenterX = -gridW / 2 + cW / 2 + c * (cW + margin);
      const bbGeo = new THREE.BoxGeometry(0.006, gridH, 0.002);
      const bb = new THREE.Mesh(bbGeo, busbarMat);
      bb.position.set(colCenterX, 0, thickness / 2 + 0.006);
      panelGroup.add(bb);
    }

    // Anti-reflective ARC Glass
    const glassGeo = new THREE.PlaneGeometry(pW - 0.04, pH - 0.04);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.3,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.z = thickness / 2 + 0.009;
    panelGroup.add(glass);

    // Glowing energy halo ring around the panel
    const ringGeo = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.2;
    panelGroup.add(ring);

    // Sparkling floating ambient energy orbs
    const sparksCount = 30;
    const sparkGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 });
    const sparks: { mesh: THREE.Mesh; angle: number; radius: number; speed: number }[] = [];

    for (let i = 0; i < sparksCount; i++) {
      const sp = new THREE.Mesh(sparkGeo, sparkMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.random() * 1.2;
      sp.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 2.5, Math.sin(angle) * radius);
      panelGroup.add(sp);
      sparks.push({ mesh: sp, angle, radius, speed: 0.01 + Math.random() * 0.015 });
    }

    // ── Lighting ──
    const amb = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(amb);

    const sun = new THREE.DirectionalLight(0xfffbeb, 3.2);
    sun.position.set(4, 5, 4);
    scene.add(sun);

    const cyanLight = new THREE.DirectionalLight(0x0284c7, 1.5);
    cyanLight.position.set(-4, -2, 2);
    scene.add(cyanLight);

    // ── Mouse Interaction ──
    let targetRotY = -0.55;
    let targetRotX = 0.35;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = -0.55 + x * 0.8;
      targetRotX = 0.35 + y * 0.4;
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

      // Floating wave motion
      panelGroup.position.y = Math.sin(elapsed * 1.5) * 0.1;
      ring.rotation.z = elapsed * 0.3;

      // Smooth rotation follow
      panelGroup.rotation.y += (targetRotY - panelGroup.rotation.y) * 0.06;
      panelGroup.rotation.x += (targetRotX - panelGroup.rotation.x) * 0.06;

      // Rotate energy sparks
      sparks.forEach((sp) => {
        sp.angle += sp.speed;
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
      glassGeo.dispose();
      glassMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
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
