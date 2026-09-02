import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Solar3DHomeProps {
  className?: string;
  height?: string | number;
}

export default function Solar3DHome({ className = "", height = "440px" }: Solar3DHomeProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── 1. Scene & Renderer ──
    const scene = new THREE.Scene();
    const width = mount.clientWidth || 550;
    const heightPx = mount.clientHeight || 440;

    const camera = new THREE.PerspectiveCamera(42, width / heightPx, 0.1, 100);
    camera.position.set(0, 1.2, 4.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0); // 100% transparent
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    // ── 2. Materials (Ultra-realistic photorealistic textures) ──
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8, // Anodized silver aluminum
      metalness: 0.92,
      roughness: 0.18,
    });

    const cellMat = new THREE.MeshStandardMaterial({
      color: 0x081f3d, // Deep monocrystalline crystal blue
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
      opacity: 0.32,
      roughness: 0.04,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
    });

    const railMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Galvanized industrial steel
      metalness: 0.85,
      roughness: 0.35,
    });

    // ── 3. High-Fidelity Solar Panel Builder ──
    const createPhotorealisticPanel = (pW = 1.6, pH = 2.8) => {
      const group = new THREE.Group();
      const thickness = 0.06;

      // Outer Frame
      const frameGeo = new THREE.BoxGeometry(pW, pH, thickness);
      const frame = new THREE.Mesh(frameGeo, frameMat);
      group.add(frame);

      // Backsheet
      const backGeo = new THREE.PlaneGeometry(pW - 0.06, pH - 0.06);
      const backMat = new THREE.MeshBasicMaterial({ color: 0x030712 });
      const back = new THREE.Mesh(backGeo, backMat);
      back.position.z = thickness / 2 + 0.002;
      group.add(back);

      // 6 x 10 Half-cut Monocrystalline Cell Matrix (60 cells per panel)
      const cols = 5;
      const rows = 10;
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
          group.add(cell);
        }

        // 3 Micro-busbars per column
        const colCenterX = -gridW / 2 + cW / 2 + c * (cW + margin);
        [-cW * 0.28, 0, cW * 0.28].forEach((offset) => {
          const bb = new THREE.Mesh(new THREE.BoxGeometry(0.004, gridH, 0.002), busbarMat);
          bb.position.set(colCenterX + offset, 0, thickness / 2 + 0.005);
          group.add(bb);
        });
      }

      // High-Gloss Anti-Reflective ARC Glass
      const glassGeo = new THREE.PlaneGeometry(pW - 0.04, pH - 0.04);
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.z = thickness / 2 + 0.008;
      group.add(glass);

      return group;
    };

    // ── 4. Main Array Group (Dual Commercial Panels on Elevated Mount) ──
    const mainGroup = new THREE.Group();
    mainGroup.rotation.x = 0.38;
    mainGroup.rotation.y = -0.42;
    scene.add(mainGroup);

    // Left Panel
    const panelL = createPhotorealisticPanel(1.5, 2.6);
    panelL.position.set(-0.82, 0, 0);
    mainGroup.add(panelL);

    // Right Panel
    const panelR = createPhotorealisticPanel(1.5, 2.6);
    panelR.position.set(0.82, 0, 0);
    mainGroup.add(panelR);

    // Structural Mounting Rails (Underneath)
    const longRail = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.06, 0.1), railMat);
    longRail.position.set(0, 0.7, -0.09);
    mainGroup.add(longRail);

    const longRail2 = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.06, 0.1), railMat);
    longRail2.position.set(0, -0.7, -0.09);
    mainGroup.add(longRail2);

    // Industrial Triangular Tilt Support Struts
    const strutMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.3 });
    [-1.2, 0, 1.2].forEach((x) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.1, 12), strutMat);
      leg.rotation.x = Math.PI / 5;
      leg.position.set(x, 0.3, -0.45);
      mainGroup.add(leg);
    });

    // Glowing clean energy aura particles
    const sparksCount = 35;
    const sparkGeo = new THREE.SphereGeometry(0.028, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 });
    const sparks: { mesh: THREE.Mesh; angle: number; radius: number; speedY: number }[] = [];

    for (let i = 0; i < sparksCount; i++) {
      const sp = new THREE.Mesh(sparkGeo, sparkMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.4 + Math.random() * 1.5;
      sp.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 2.5, Math.sin(angle) * radius);
      mainGroup.add(sp);
      sparks.push({ mesh: sp, angle, radius, speedY: 0.008 + Math.random() * 0.015 });
    }

    // ── 5. Lighting Setup ──
    const amb = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(amb);

    const sun = new THREE.DirectionalLight(0xfffbeb, 3.5);
    sun.position.set(5, 6, 5);
    scene.add(sun);

    const sky = new THREE.DirectionalLight(0x38bdf8, 1.6);
    sky.position.set(-5, -2, 3);
    scene.add(sky);

    // ── 6. Mouse Parallax ──
    let targetY = -0.42;
    let targetX = 0.38;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetY = -0.42 + x * 0.7;
      targetX = 0.38 + y * 0.4;
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

    // ── 7. Animation Loop ──
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle floating bob
      mainGroup.position.y = Math.sin(elapsed * 1.4) * 0.09;

      mainGroup.rotation.y += (targetY - mainGroup.rotation.y) * 0.06;
      mainGroup.rotation.x += (targetX - mainGroup.rotation.x) * 0.06;

      // Energy particles rise
      sparks.forEach((sp) => {
        sp.mesh.position.y += sp.speedY;
        if (sp.mesh.position.y > 2.0) {
          sp.mesh.position.y = -1.5;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      frameMat.dispose();
      cellMat.dispose();
      busbarMat.dispose();
      glassMat.dispose();
      railMat.dispose();
      strutMat.dispose();
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
