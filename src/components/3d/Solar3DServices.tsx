import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Solar3DServicesProps {
  className?: string;
  height?: string | number;
}

export default function Solar3DServices({ className = "", height = "380px" }: Solar3DServicesProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── 1. Scene Setup ──
    const scene = new THREE.Scene();
    const width = mount.clientWidth || 480;
    const heightPx = mount.clientHeight || 380;

    const camera = new THREE.PerspectiveCamera(42, width / heightPx, 0.1, 100);
    camera.position.set(0, 0.8, 4.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    mainGroup.rotation.x = 0.32;
    mainGroup.rotation.y = -0.45;
    scene.add(mainGroup);

    // ── 2. Materials ──
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.9,
      roughness: 0.2,
    });

    const cellMat = new THREE.MeshStandardMaterial({
      color: 0x081f3d,
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

    // ── 3. High-Fidelity Solar Panel ──
    const pW = 1.8;
    const pH = 2.8;
    const thickness = 0.06;

    const panelGroup = new THREE.Group();
    panelGroup.position.set(-0.6, 0, 0);
    mainGroup.add(panelGroup);

    // Frame
    const frameGeo = new THREE.BoxGeometry(pW, pH, thickness);
    const frame = new THREE.Mesh(frameGeo, frameMat);
    panelGroup.add(frame);

    // Cells
    const cols = 5;
    const rows = 8;
    const margin = 0.02;
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

    const glass = new THREE.Mesh(new THREE.PlaneGeometry(pW - 0.04, pH - 0.04), glassMat);
    glass.position.z = thickness / 2 + 0.008;
    panelGroup.add(glass);

    // ── 4. Smart Industrial Inverter Unit ──
    const invGroup = new THREE.Group();
    invGroup.position.set(1.4, -0.1, 0.3);
    mainGroup.add(invGroup);

    // Brushed dark-titanium chassis
    const invChassisMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25,
    });
    const invBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.8, 0.35), invChassisMat);
    invGroup.add(invBody);

    // Heat-sink cooling fins on sides
    const finMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.3 });
    for (let i = -6; i <= 6; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.03, 0.38), finMat);
      fin.position.y = i * 0.11;
      invGroup.add(fin);
    }

    // Glass LCD Display Panel
    const lcdMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9 });
    const lcd = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.35), lcdMat);
    lcd.position.set(0, 0.45, 0.18);
    invGroup.add(lcd);

    // High-Efficiency Status Indicator Lights (Emerald & Amber)
    const ledGreen = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    ledGreen.position.set(-0.2, 0.15, 0.18);
    invGroup.add(ledGreen);

    const ledBlue = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    ledBlue.position.set(0, 0.15, 0.18);
    invGroup.add(ledBlue);

    const ledAmber = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
    ledAmber.position.set(0.2, 0.15, 0.18);
    invGroup.add(ledAmber);

    // ── 5. Ambient Energy Sparkles ──
    const sparksCount = 30;
    const sparkGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
    const sparks: { mesh: THREE.Mesh; angle: number; radius: number; speedY: number }[] = [];

    for (let i = 0; i < sparksCount; i++) {
      const sp = new THREE.Mesh(sparkGeo, sparkMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.3 + Math.random() * 1.2;
      sp.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 2.2, Math.sin(angle) * radius);
      mainGroup.add(sp);
      sparks.push({ mesh: sp, angle, radius, speedY: 0.01 + Math.random() * 0.015 });
    }

    // ── 6. Lighting ──
    const amb = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(amb);

    const sun = new THREE.DirectionalLight(0xfffbeb, 3.4);
    sun.position.set(4, 5, 4);
    scene.add(sun);

    const cyan = new THREE.DirectionalLight(0x0284c7, 1.6);
    cyan.position.set(-4, -1, 3);
    scene.add(cyan);

    // ── 7. Mouse Parallax ──
    let targetY = -0.45;
    let targetX = 0.32;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetY = -0.45 + x * 0.7;
      targetX = 0.32 + y * 0.4;
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

    // ── 8. Animation Loop ──
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      mainGroup.position.y = Math.sin(elapsed * 1.4) * 0.08;

      mainGroup.rotation.y += (targetY - mainGroup.rotation.y) * 0.06;
      mainGroup.rotation.x += (targetX - mainGroup.rotation.x) * 0.06;

      // Pulse LCD screen
      lcdMat.color.setHSL(0.55, 0.9, 0.45 + Math.sin(elapsed * 3) * 0.08);

      // Rotate sparkles
      sparks.forEach((sp) => {
        sp.angle += 0.01;
        sp.mesh.position.x = Math.cos(sp.angle) * sp.radius;
        sp.mesh.position.z = Math.sin(sp.angle) * sp.radius;
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
      invChassisMat.dispose();
      finMat.dispose();
      lcdMat.dispose();
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
